FROM alpine:3.20 AS downloader
ARG PB_VERSION=0.38.0
RUN apk add --no-cache ca-certificates unzip wget && \
    wget -q -O /tmp/pb.zip \
      "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" && \
    unzip /tmp/pb.zip -d /pb && \
    rm /tmp/pb.zip

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
COPY --from=downloader /pb/pocketbase /pb/pocketbase
RUN chmod +x /pb/pocketbase && mkdir -p /pb/pb_data /pb/pb_migrations

WORKDIR /pb
EXPOSE 8090

ENTRYPOINT ["/pb/pocketbase"]
CMD ["serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations"]
