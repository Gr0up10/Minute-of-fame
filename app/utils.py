cache = {}


def methods_with_decorator(cls, decorator):
    method_list = [getattr(cls, func) for func in dir(cls) if callable(getattr(cls, func))]
    return [m for m in method_list if m.__name__ == 'wrapped_f' and m.__getattribute__('fn') == decorator]


def get_actions(cls):
    return {m.__getattribute__('command')['command']: m for m in methods_with_decorator(cls, action)}


def find_action(cls, command):
    if cls in cache:
        methods = cache[cls]
    else:
        methods = get_actions(cls)
        cache[cls] = methods

    return methods[command]


def action(**kw):
    def wrap(f):
        async def wrapped_f(self, *args):
            await f(self, *args)
        wrapped_f.__setattr__('command', kw)
        wrapped_f.__setattr__('fn', action)
        wrapped_f.__setattr__('wrapped', f)
        return wrapped_f
    return wrap
