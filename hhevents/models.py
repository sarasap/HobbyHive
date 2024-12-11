# hhevents/models.py

from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    CATEGORY_CHOICES = [
        ('social', 'Social'),
        ('business', 'Business'),
        ('education', 'Education'),
        ('sports', 'Sports'),
        ('cultural', 'Cultural'),
    ]

    title = models.CharField(max_length=200)
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    max_attendees = models.PositiveIntegerField(null=True, blank=True)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    attendees = models.ManyToManyField(User, related_name='attending_events', blank=True)
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)  

    def __str__(self):
        return self.title
