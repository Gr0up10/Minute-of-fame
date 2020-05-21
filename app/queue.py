"""
Base class for streamers queue
"""


class QueueModel(object):
    """QueueModel"""
    def __init__(self, select_next):
        """
        select_next - функция, в которую
        надо передать id следующего
        стримера, когда придет его очередь
        """
        self.queue = []
        self.elapsed = 0
        self.current_streamer = None
        self.next_streamer = select_next

    def add_to_queue(self, id):
        """
        добавить в очередь
        :param id:
        :return:
        """
        self.queue.append(id)

    def remove_from_queue(self, id):
        """
        удалить из очереди
        :param id:
        :return:
        """
        self.queue.remove(id)

    def tick(self):
        """
        вызывается каждую секунду, в нем
        надо делать всю основную логику,
        т.е. засекать время, и когда пройдет
        40 сек, выбирать следующего стримера из очереди
        """
        if self.elapsed < 40:
            self.elapsed += 1
        else:
            self.elapsed = 0
            self.select_next()

    def select_next(self):
        """
        Возвращает следующего
         по очереди, т.е. первого в списке
        :return:
        """
        self.current_streamer = self.queue[0]
        if len(self.queue):
            self.queue.pop(0)
            self.next_streamer(self.queue[0])
