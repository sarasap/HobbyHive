from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'caption', 'image', 'video', 'created_at', 'like_count']
        read_only_fields = ['user', 'created_at', 'like_count']
