from celery import shared_task
from spleeter.separator import Separator


@shared_task
def asyncSpleet(instance):

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
