#! /bin/sh

set -e

if [ "${POSTGRES_DB}" = "**None**" -a "${POSTGRES_DB_FILE}" = "**None**" ]; then
  echo "You need to set the POSTGRES_DB or POSTGRES_DB_FILE environment variable."
  exit 1
fi

if [ "${POSTGRES_HOST}" = "**None**" ]; then
  if [ -n "${POSTGRES_PORT_5432_TCP_ADDR}" ]; then
    POSTGRES_HOST=${POSTGRES_PORT_5432_TCP_ADDR}
    POSTGRES_PORT=${POSTGRES_PORT_5432_TCP_PORT}
  else
    echo "You need to set the POSTGRES_HOST environment variable."
    exit 1
  fi
fi

if [ "${POSTGRES_USER}" = "**None**" -a "${POSTGRES_USER_FILE}" = "**None**" ]; then
  echo "You need to set the POSTGRES_USER or POSTGRES_USER_FILE environment variable."
  exit 1
fi

if [ "${POSTGRES_PASSWORD}" = "**None**" -a "${POSTGRES_PASSWORD_FILE}" = "**None**" ]; then
  echo "You need to set the POSTGRES_PASSWORD or POSTGRES_PASSWORD_FILE environment variable or link to a container named POSTGRES."
  exit 1
fi

#Process vars
if [ "${POSTGRES_DB_FILE}" = "**None**" ]; then
  POSTGRES_DBS=$(echo "${POSTGRES_DB}" | tr , " ")
elif [ -r "${POSTGRES_DB_FILE}" ]; then
  POSTGRES_DBS=$(cat "${POSTGRES_DB_FILE}")
else
  echo "Missing POSTGRES_DB_FILE file."
  exit 1
fi
if [ "${POSTGRES_USER_FILE}" = "**None**" ]; then
  export PGUSER="${POSTGRES_USER}"
elif [ -r "${POSTGRES_USER_FILE}" ]; then
  export PGUSER=$(cat "${POSTGRES_USER_FILE}")
else
  echo "Missing POSTGRES_USER_FILE file."
  exit 1
fi
if [ "${POSTGRES_PASSWORD_FILE}" = "**None**" ]; then
  export PGPASSWORD="${POSTGRES_PASSWORD}"
elif [ -r "${POSTGRES_PASSWORD_FILE}" ]; then
  export PGPASSWORD=$(cat "${POSTGRES_PASSWORD_FILE}")
else
  echo "Missing POSTGRES_PASSWORD_FILE file."
  exit 1
fi
POSTGRES_HOST_OPTS="-h ${POSTGRES_HOST} -p ${POSTGRES_PORT} ${POSTGRES_EXTRA_OPTS}"

#Loop all databases
for DB in ${POSTGRES_DBS}; do
  #Initialize filename vers
  DFILE="${BACKUP_DIR}/${DB}.sql.gz"
  #Create dump
  echo "Creating dump of ${DB} database from ${POSTGRES_HOST}..."
  pg_dump -f "${DFILE}" ${POSTGRES_HOST_OPTS} ${DB}
done

echo "SQL backup created successfully"