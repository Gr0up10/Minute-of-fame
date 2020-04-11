import redis

from minute_of_fame import settings


class MetaSingleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(MetaSingleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class RedisConnection(metaclass=MetaSingleton):
    def __init__(self):
        (rhost, rport) = settings.CHANNEL_LAYERS['default']['CONFIG']['hosts'][0]
        print('host', settings.CHANNEL_LAYERS['default']['CONFIG']['hosts'][0])
        self.redis_instance = redis.StrictRedis(host=rhost, port=rport, db=5)
        print('connected to redis')
