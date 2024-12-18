from django.urls import path
from .views import HobbyListCreateView, PostsByHobbyView, HobbyDetailView

urlpatterns = [
    path('hobbies/', HobbyListCreateView.as_view(), name='hobbies'),
    path('hobbies/<str:hobby_name>/',HobbyDetailView.as_view(), name='hobby-detail'),
    path('hobbies/<str:hobby_name>/posts/', PostsByHobbyView.as_view(), name='posts-by-hobby'),
]
