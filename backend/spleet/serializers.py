from rest_framework import serializers
from .models import Spleet


class SpleetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spleet
        fields = '__all__'
