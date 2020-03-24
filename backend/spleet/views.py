from .serializers import SpleetSerializer
from .models import Spleet
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.http import HttpResponse
from wsgiref.util import FileWrapper


class SpleetView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        spleets = Spleet.objects.all()
        serializer = SpleetSerializer(spleets, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        spleets_serializer = SpleetSerializer(data=request.data)
        if spleets_serializer.is_valid():
            spleets_serializer.save()
            return Response(spleets_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', spleets_serializer.errors)
            return Response(spleets_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Vocals(generics.ListAPIView):
    def get(self, request, id, format=None):
        queryset = Spleet.objects.get(id=id)
        file_handle = queryset.media.path.rpartition('.')[0]+"/vocals.mp3"
        document = open(file_handle, 'rb')
        response = HttpResponse(FileWrapper(document), content_type='audio/mpeg')
        response['Content-Disposition'] = 'attachment; filename="%s"' % queryset.media.name
        return response

class Instrumental(generics.ListAPIView):
    def get(self, request, id, format=None):
        queryset = Spleet.objects.get(id=id)
        file_handle = queryset.media.path.rpartition('.')[0]+"/accompaniment.mp3"
        document = open(file_handle, 'rb')
        response = HttpResponse(FileWrapper(document), content_type='audio/mpeg')
        response['Content-Disposition'] = 'attachment; filename="%s"' % queryset.media.name
        return response