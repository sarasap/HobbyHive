from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from .models import Post, Comment, Event

class PostModelTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='testpass123'
        )

    def test_create_post(self):
        """Test creating a post"""
        # Create a test image
        test_image = SimpleUploadedFile(
            name='test_image.jpg', 
            content=b'', 
            content_type='image/jpeg'
        )

        # Create a post
        post = Post.objects.create(
            user=self.user,
            caption='Test post caption',
            media=test_image
        )

        # Assertions
        self.assertEqual(post.user, self.user)
        self.assertEqual(post.caption, 'Test post caption')
        self.assertTrue(post.media)
        self.assertIsNotNone(post.created_at)

    def test_post_like_functionality(self):
        """Test post like functionality"""
        # Create a post
        post = Post.objects.create(user=self.user, caption='Test post')
        
        # Create another user to like the post
        another_user = User.objects.create_user(
            username='anotheruser', 
            password='testpass456'
        )
        
        # Add like
        post.likes.add(another_user)
        
        # Assertions
        self.assertEqual(post.likes.count(), 1)
        self.assertTrue(another_user in post.likes.all())

class CommentModelTestCase(TestCase):
    def setUp(self):
        # Create a test user and post
        self.user = User.objects.create_user(
            username='testuser', 
            password='testpass123'
        )
        self.post = Post.objects.create(
            user=self.user, 
            caption='Test post'
        )

    def test_create_comment(self):
        """Test creating a comment"""
        comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            text='Test comment'
        )

        # Assertions
        self.assertEqual(comment.post, self.post)
        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.text, 'Test comment')
        self.assertIsNotNone(comment.created_at)


class PostViewsTestCase(TestCase):
    def setUp(self):
        # Create test client and user
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', 
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_post(self):
        """Test creating a post via API"""
        # Create a test image
        test_image = SimpleUploadedFile(
            name='test_image.jpg', 
            content=b'', 
            content_type='image/jpeg'
        )

        # Prepare post data
        post_data = {
            'caption': 'Test post via API',
            'media': test_image
        }

        # Send POST request
        response = self.client.post('/api/posts/', 
            data=post_data, 
            format='multipart'
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Post.objects.first().caption, 'Test post via API')

    def test_like_post(self):
        """Test liking a post via API"""
        # Create a post
        post = Post.objects.create(
            user=self.user, 
            caption='Test post to like'
        )

        # Like the post
        response = self.client.post(f'/api/posts/{post.id}/like/')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 1)

    def test_create_comment(self):
        """Test creating a comment via API"""
        # Create a post
        post = Post.objects.create(
            user=self.user, 
            caption='Test post for comment'
        )

        # Prepare comment data
        comment_data = {
            'text': 'Test comment via API'
        }

        # Send POST request
        response = self.client.post(
            f'/api/posts/{post.id}/comment/', 
            data=comment_data
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.first().text, 'Test comment via API')

