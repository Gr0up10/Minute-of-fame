FROM postgres:alpine

RUN set -x \
	&& apk update && apk add ca-certificates curl \
	&& curl -L https://github.com/prodrigestivill/go-cron/releases/download/v0.0.9/go-cron-linux-arm64-static.gz | zcat > /usr/local/bin/go-cron \
	&& chmod a+x /usr/local/bin/go-cron \
	&& apk del ca-certificates

ENV POSTGRES_DB="**None**" \
    POSTGRES_DB_FILE="**None**" \
    POSTGRES_HOST="**None**" \
    POSTGRES_PORT=5432 \
    POSTGRES_USER="**None**" \
    POSTGRES_USER_FILE="**None**" \
    POSTGRES_PASSWORD="**None**" \
    POSTGRES_PASSWORD_FILE="**None**" \
    POSTGRES_EXTRA_OPTS="-Z9" \
    SCHEDULE="@daily" \
    BACKUP_DIR="/backups"

COPY backup.sh /backup.sh
RUN chmod +x backup.sh

VOLUME /backups

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["exec /usr/local/bin/go-cron -s \"$SCHEDULE\" -- /backup.sh  && psql -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} ${POSTGRES_DB} < /backups/${POSTGRES_DB}.sql.gz"]