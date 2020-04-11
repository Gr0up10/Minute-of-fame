from app.models import Stream


def get_current_stream():
    print(is_stream_active())
    if is_stream_active():
        print(Stream.objects.filter(active=True).count())
        if Stream.objects.filter(active=True).count() > 1:
            clear_streams()
            return None
    else:
        return None
    return Stream.objects.get(active=True)


def get_current_stream_id():
    return get_current_stream().stream_id


def is_stream_active():
    return Stream.objects.filter(active=True).exists()


def clear_streams():
    for s in Stream.objects.filter(active=True):
        s.active = False
        s.save()
