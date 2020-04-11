# Generated by Django 3.0.4 on 2020-04-04 10:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stream',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('stream_id', models.CharField(max_length=16)),
                ('active', models.BooleanField(default=True)),
                ('publisher', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='report',
            name='badass_id',
        ),
        migrations.RemoveField(
            model_name='report',
            name='sender_id',
        ),
        migrations.AddField(
            model_name='report',
            name='badass',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                    related_name='badass_id', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='report',
            name='sender',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                    related_name='sender_id', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='StreamView',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('stream', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='app.Stream')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PollStat',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('vote', models.IntegerField(choices=[
                 (0, 'Dislike'), (1, 'Like')], default=1)),
                ('stream', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='app.Stream')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]