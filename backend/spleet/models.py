from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from spleeter.separator import Separator
from django.core.validators import FileExtensionValidator
import shutil
import os
import uuid


def file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return filename


class Spleet(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    message = models.TextField(max_length=140, blank=True)
    media = models.FileField(upload_to=file_path, blank=False, validators=[
                             FileExtensionValidator(["mp3"])])


@receiver(models.signals.post_save, sender=Spleet)
def postSaveSpleet(sender, instance, **kwargs):

    try:
        audio_descriptors = ['media/'+str(instance.media.name)]
        # Using embedded configuration.
        separator = Separator('spleeter:2stems')
        for i in audio_descriptors:
            separator.separate_to_file(
                i, 'media/', codec='mp3', synchronous=False)

        separator.join()

    except FileExistsError:
        audio_descriptors = ['media/'+str(instance.media.name)]
        # Using embedded configuration.
        separator = Separator('spleeter:2stems')
        for i in audio_descriptors:
            separator.separate_to_file(
                i, 'media/', codec='mp3', synchronous=False)

        separator.join()


@receiver(models.signals.post_delete, sender=Spleet)
def delFromMediaWhenDB(sender, instance, **kwargs):
    if instance.media:
        if os.path.isfile(instance.media.path):
            os.remove(instance.media.path)
            shutil.rmtree(
                'media/'+(os.path.splitext(instance.media.name)[0]), ignore_errors=True)
            shutil.rmtree('media/'+str(instance.media.name),
                          ignore_errors=True)
