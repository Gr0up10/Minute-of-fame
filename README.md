# minute of fame

Что бы запустить проект через docker-compose используйте следующею комманды

`docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 dockernet`

`docker-compose up --build`

Если вы не хотите каждый раз пересобирать контейнер, выполните следующие команды
1. Установите nodejs, npm и postgres
2. Запустите зависимые процессы через специальный docker-compose конфиг `docker-compose -f docker-compose.dev.yml up
 -d` (эта команда запустит контейнеры в фоне, так что если будете запускать основной проект через докер не забудте сначана выключить эти контейнеры)
3. Перейдите в директорию с js скриптами `cd ./app/js` и установите зависимости `npm install`
4. Вернитесь обратно `cd ../..` и создайте cache таблицу `python3 manage.py createcachetable`
5. Создайте миграции `python3 manage.py makemigrations` и примините их `python3 manage.py migrate`
6. Запустите сервер `run.dev.bat` если windows, если linux, то сначала сделайте скрипт запускаемым `chmod +x run.dev.sh` и теперь можете запускать `./run.dev.sh`

На linux сервер будет доступен на 8000 порте на windows на 80

Что бы применить нужные изменения теперь нужно будет только перезапусть скрипт `run.dev`

