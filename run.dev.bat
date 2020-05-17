cd app/js && npm run build && cd ../.. && python manage.py collectstatic --noinput && python manage.py migrate && python manage.py createcachetable && python manage.py runserver 0.0.0.0:80
PAUSE