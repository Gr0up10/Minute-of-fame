# Generated by Django 3.0.3 on 2020-02-21 13:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20200220_1952'),
    ]

    operations = [
        migrations.RenameField(
            model_name='report',
            old_name='badass_id',
            new_name='badass',
        ),
        migrations.RenameField(
            model_name='report',
            old_name='sender_id',
            new_name='sender',
        ),
    ]
