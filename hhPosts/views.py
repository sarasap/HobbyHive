from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from hhMain.models import UserProfile

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get the user's profile and hobbies
        profile = UserProfile.objects.get(user=self.request.user)
        joined_hobbies = profile.hobbies.all()
        return Post.objects.filter(hobbies__in=joined_hobbies).distinct()

    def get_serializer_context(self):
        return {'request': self.request}


class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LikePostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = Post.objects.get(id=post_id)
        if request.user in post.likes.all():
            post.likes.remove(request.user)  # Unlike if already liked
        else:
            post.likes.add(request.user)  # Like if not liked yet
        return Response({'likes_count': post.likes.count()}, status=status.HTTP_200_OK)

class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        serializer.save(user=self.request.user, post=post)


class UserHobbiesPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get the user's profile and hobbies
        profile = UserProfile.objects.get(user=self.request.user)
        joined_hobbies = profile.hobbies.all()

        # Return posts related to the user's hobbies
        return Post.objects.filter(hobbies__in=joined_hobbies).distinct()
