# Generated by Django 3.0.4 on 2020-03-24 23:58

import django.core.validators
from django.db import migrations, models
import spleet.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Spleet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('message', models.TextField(blank=True, max_length=140)),
                ('media', models.FileField(upload_to=spleet.models.file_path, validators=[django.core.validators.FileExtensionValidator(['mp3'])])),
            ],
        ),
    ]
