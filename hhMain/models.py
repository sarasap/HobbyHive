# hhMain/models.py

from django.contrib.auth.models import User
from django.db import models
from hhHobbies.models import Hobby

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    hobbies = models.ManyToManyField(Hobby, related_name='profiles', blank=True)  # New field

    def __str__(self):
        return f"{self.user.username}'s profile"