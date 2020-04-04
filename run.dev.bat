cd app/js && npm run build && cd ../.. && python manage.py collectstatic --noinput && daphne -b 0.0.0.0 -p 8000 minute_of_fame.asgi:application
PAUSE
