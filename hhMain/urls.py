from django.urls import path, include
from .views import register, login_view, home, logout_view

urlpatterns = [
    path('register/', register),
    path('login/', login_view),
    path('logout/', logout_view, name='logout'),
    path('home/', home, name='home')
]
