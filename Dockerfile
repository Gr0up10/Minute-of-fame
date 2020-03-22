FROM maplegend/node_python:master
ENV PYTHONUNBUFFERED 1
ENV DOCKER 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
RUN python manage.py migrate
RUN python manage.py createcachetable
RUN cd app/js && npm install && npm run build
RUN python manage.py collectstatic