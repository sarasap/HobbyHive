# hhPosts/urls.py
from django.urls import path
from .views import CreatePostView, ListPostsView, LikePostView

urlpatterns = [
    path('create/', CreatePostView.as_view(), name='create_post'),
    path('list/', ListPostsView.as_view(), name='list_posts'),
    path('<int:pk>/like/', LikePostView.as_view(), name='like_post'),
]
