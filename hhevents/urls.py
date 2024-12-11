# hhevents/urls.py

from django.urls import path
from .views import ListEventsView, CreateEventView
from . import views

urlpatterns = [
    path('', ListEventsView.as_view(), name='list-events'),
    path('create-event/', CreateEventView.as_view(), name='create-event'),
    path('<int:pk>/rsvp/', views.rsvp_event, name='rsvp-event'),
]
