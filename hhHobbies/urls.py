from django.urls import path
from .views import HobbyListCreateView, PostsByHobbyView

urlpatterns = [
    path('hobbies/', HobbyListCreateView.as_view(), name='hobbies'),
    path('hobbies/<int:hobby_id>/posts/', PostsByHobbyView.as_view(), name='posts-by-hobby'),
]
