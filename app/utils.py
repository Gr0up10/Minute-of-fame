cache = {}


def methods_with_decorator(cls, decorator):
    """способы работы с декоратором"""
    method_list = [getattr(cls, func)
                   for func in dir(cls) if callable(getattr(cls, func))]
    return [m for m in method_list if
            hasattr(m, '__name__') and m.__name__ == 'wrapped_f' and m.__getattribute__('fn') == decorator]


def get_action_index(command, internal):
    """получить индекс действия"""
    return command + ('1' if internal else '0')


def get_actions(cls):
    """получение актавности """
    return {get_action_index(m.__getattribute__('command'), m.__getattribute__('internal')): m
            for m in methods_with_decorator(cls, action)}


def find_action(cls, command, internal=False):
    """найти действие"""
    if cls in cache:
        methods = cache[cls]
    else:
        methods = get_actions(cls)
        cache[cls] = methods

    return methods[get_action_index(command, internal)]


def action(command, internal=False):
    """действия """
    def wrap(f):
        async def wrapped_f(self, *args):
            await f(self, *args)

        wrapped_f.__setattr__('command', command)
        wrapped_f.__setattr__('internal', internal)
        wrapped_f.__setattr__('fn', action)
        wrapped_f.__setattr__('wrapped', f)
        return wrapped_f

    return wrap
