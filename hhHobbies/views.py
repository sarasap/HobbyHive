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
from django.contrib.auth.models import User
from rest_framework.views import APIView


nltk.download("wordnet")

class HobbyListCreateView(generics.ListCreateAPIView):
    queryset = Hobby.objects.all()
    serializer_class = HobbySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Create a new hobby and return the hobby's detail URL.
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
        return Response(
            {
                'id': hobby.id,
                'name': hobby.name,
                'url': f'/{hobby.name.lower().replace(" ", "-")}/'  # Generate hobby URL
            },
            status=status.HTTP_201_CREATED
        )

    @staticmethod
    def are_hobbies_similar(hobby1, hobby2):
        similarity_score = fuzz.token_sort_ratio(hobby1, hobby2)
        return similarity_score > 85

    @staticmethod
    def normalize_name(name):
        lemmatizer = WordNetLemmatizer()
        stemmer = PorterStemmer()
        words = name.lower().split()
        normalized_words = [stemmer.stem(lemmatizer.lemmatize(word)) for word in words]
        return " ".join(normalized_words)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Hobby
from hhPosts.models import Post
from hhPosts.serializers import PostSerializer


class PostsByHobbyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, hobby_name):
        # Fetch the hobby by name
        hobby = Hobby.objects.filter(name__iexact=hobby_name).first()
        if not hobby:
            return Response({'error': 'Hobby not found'}, status=404)

        # Fetch posts related to this hobby
        posts = Post.objects.filter(hobbies=hobby)
        serialized_posts = PostSerializer(posts, many=True, context={'request': request}).data

        return Response(serialized_posts)


from django.contrib.auth.models import User

class HobbyDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, hobby_name):
        # Fetch the hobby by name
        hobby = Hobby.objects.filter(name__iexact=hobby_name).first()
        if not hobby:
            return Response({'error': 'Hobby not found'}, status=404)

        # Fetch posts related to this hobby
        posts = Post.objects.filter(hobbies=hobby)
        serialized_posts = PostSerializer(posts, many=True, context={'request': request}).data

        # Fetch users who have joined this hobby via the UserProfile model
        users = User.objects.filter(profile__hobbies=hobby)  # Use the correct field name (profile)
        serialized_users = [{'id': user.id, 'username': user.username} for user in users]

        return Response({
            'posts': serialized_posts,
            'users': serialized_users,  # Add users to the response
        })
