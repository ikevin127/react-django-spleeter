from rest_framework import serializers
from .models import Spleet
from django_celery_results.models import TaskResult


class SpleetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spleet
        fields = '__all__'


class CelerySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskResult
        fields = '__all__'
