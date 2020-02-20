from django.db import models
from django.contrib.auth.models import User


#Create your models here.


class Report(models.Model):
    badass_id = models.ForeignKey(to=User, on_delete=models.CASCADE,related_name='badass_id')
    sender_id = models.ForeignKey(to=User, on_delete=models.CASCADE,related_name='sender_id')
    date = models.DateTimeField(auto_now=True)
    # reason's
    multi_account = models.BooleanField(default=False)
    offensive = models.BooleanField(default=False)
    inappropriate_video_content = models.BooleanField(default=False)
    additional_information = models.CharField(max_length=250)
