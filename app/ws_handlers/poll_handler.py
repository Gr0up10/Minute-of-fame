from app.utils import *
from app.ws_handlers.handler import Handler
from asgiref.sync import sync_to_async
from app.models import PollStat, LikeDislike
from app.ws_handlers.stream_utils import *


class PollHandler(Handler):
    name = "poll"

    @action(command="like")
    async def like(self, sender, packet):
        await sync_to_async(self.vote)(sender, True)
        await self.update()
        print("like")

    @action(command="dislike")
    async def dislike(self, sender, packet):
        await sync_to_async(self.vote)(sender, False)
        await self.update()
        print("dislike")

    @staticmethod
    def get_stat():
        stream = get_current_stream()
        stat = PollStat.objects.filter(stream=stream)
        likes, dises = 0, 0
        for s in stat:
            if s.vote == LikeDislike.LIKE:
                likes += 1
            else:
                dises += 1
        print(likes, dises)
        return likes, dises

    async def update(self):
        likes, dislikes = await sync_to_async(PollHandler.get_stat)()
        print("update ", likes, dislikes)
        await self.send_broadcast("update", {"likes": likes, "dislikes": dislikes})

    @staticmethod
    def vote(sender, like):
        current = PollStat.objects.filter(user=sender.scope["user"], stream=get_current_stream())
        if current.exists():
            current[0] = PollStat(user=sender.scope["user"], stream=get_current_stream(),
                 vote=LikeDislike.LIKE if like else LikeDislike.DISLIKE)
            current[0].save()
        else:
            PollStat(user=sender.scope["user"], stream=get_current_stream(),
                     vote=LikeDislike.LIKE if like else LikeDislike.DISLIKE).save()