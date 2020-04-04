from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Report(models.Model):
    badass = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='badass_id', null=True)
    sender = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='sender_id', null=True)
    date = models.DateTimeField(auto_now=True)
    # reason's
    multi_account = models.BooleanField(default=False)
    offensive = models.BooleanField(default=False)
    inappropriate_video_content = models.BooleanField(default=False)
    additional_information = models.CharField(max_length=250)


class Stream(models.Model):
    publisher = models.ForeignKey(to=User, on_delete=models.CASCADE)
    stream_id = models.CharField(max_length=16)
    active = models.BooleanField(default=True)


class StreamView(models.Model):
    stream = models.ForeignKey(to=Stream, on_delete=models.CASCADE)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)


class LikeDislike(models.IntegerChoices):
    DISLIKE = 0
    LIKE = 1


class PollStat(models.Model):
    stream = models.ForeignKey(to=Stream, on_delete=models.CASCADE)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    vote = models.IntegerField(
        choices=LikeDislike.choices,
        default=LikeDislike.LIKE,
    )


class Profile(models.Model):
    """User quotes"""
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    quotes = models.CharField(max_length=60)
    email = models.CharField(max_length=60)
    location = models.CharField(max_length=60)
    Vk = models.CharField(max_length=60)
    instagram = models.CharField(max_length=60)
    facebook = models.CharField(max_length=60)
    twitter = models.CharField(max_length=60)
    odnoklassniki = models.CharField(max_length=60)
    youtube_play = models.CharField(max_length=60)