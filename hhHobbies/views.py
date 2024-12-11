from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Hobby
from .serializers import HobbySerializer
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from hhPosts.models import Post
from hhPosts.serializers import PostSerializer
from django.conf import settings
from fuzzywuzzy import fuzz
import nltk
from nltk.stem import WordNetLemmatizer, PorterStemmer

nltk.download("wordnet")

class HobbyListCreateView(generics.ListCreateAPIView):
    queryset = Hobby.objects.all()
    serializer_class = HobbySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Create a new hobby with enhanced duplicate checking using fuzzywuzzy, lemmatization, and stemming.
        """
        name = request.data.get('name', '').strip()
        if not name:
            return Response({'error': 'Hobby name cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Normalize the input name
        normalized_name = self.normalize_name(name)

        # Check for duplicates
        for hobby in Hobby.objects.all():
            normalized_existing_name = self.normalize_name(hobby.name)
            if self.are_hobbies_similar(normalized_name, normalized_existing_name):
                return Response(
                    {'error': f'Hobby "{name}" is similar to existing hobby "{hobby.name}".'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # If no duplicate, create the hobby
        hobby = Hobby.objects.create(name=name)
        return Response(HobbySerializer(hobby).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def are_hobbies_similar(hobby1, hobby2):
        """
        Use fuzzy matching to determine if two hobbies are similar.
        """
        similarity_score = fuzz.token_sort_ratio(hobby1, hobby2)
        print(f"Comparing '{hobby1}' and '{hobby2}' - Similarity Score: {similarity_score}")
        return similarity_score > 85  # Adjust threshold as needed

    @staticmethod
    def normalize_name(name):
        """
        Normalize a hobby name by applying lemmatization, stemming, and lowercasing.
        """
        lemmatizer = WordNetLemmatizer()
        stemmer = PorterStemmer()

        # Lowercase the name and split into words
        words = name.lower().split()

        # Apply lemmatization followed by stemming
        normalized_words = [stemmer.stem(lemmatizer.lemmatize(word)) for word in words]

        # Join back into a single string
        return " ".join(normalized_words)


class PostsByHobbyView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hobby_id = self.kwargs['hobby_id']
        hobby = Hobby.objects.filter(id=hobby_id).first()
        if not hobby:
            return Post.objects.none()  # Return empty queryset if hobby does not exist
        return Post.objects.filter(hobbies=hobby)