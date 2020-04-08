FROM maplegend/node_python:master
ENV PYTHONUNBUFFERED 1
ENV DOCKER 1
ARG DEBUG=1
ENV DEBUG $DEBUG
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
RUN cd app/js && npm install && npm run build
RUN python manage.py collectstatic