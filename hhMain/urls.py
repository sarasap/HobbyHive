from django.urls import path, include
from .views import register, login_view, home, logout_view
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('home/', views.home, name='home'),
    path('profile/', views.profile_view, name='profile'),
]
