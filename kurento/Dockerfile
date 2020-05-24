FROM kurento/kurento-media-server
COPY ./SdpEndpoint.conf.json /etc/kurento/modules/kurento/SdpEndpoint.conf.json

EXPOSE 8888

HEALTHCHECK --start-period=15s --interval=30s --timeout=3s --retries=1 CMD /healthchecker.sh

ENTRYPOINT ["/entrypoint.sh"]