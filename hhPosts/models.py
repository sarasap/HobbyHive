from django.db import models
from django.contrib.auth.models import User
from hhHobbies.models import Hobby

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    caption = models.TextField(blank=True, null=True)
    media = models.ImageField(upload_to='posts_media/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    hobbies = models.ManyToManyField(Hobby, related_name='posts', blank=True)

    def __str__(self):
        return f'{self.user.username} - {self.caption[:30]}'

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} on {self.post.caption[:20]}'
    
