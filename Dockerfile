FROM python:3
ENV PYTHONUNBUFFERED 1
ENV DOCKER 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
RUN python manage.py createcachetable
RUN python manage.py migrate
RUN python manage.py collectstatic
RUN python manage.py createcachetable