from app.models import Stream


def get_current_stream():
    return Stream.objects.get(active=True)


def get_current_stream_id():
    return get_current_stream().stream_id


def is_stream_active():
    return Stream.objects.filter(active=True).exists()
