FROM golang:1.24-alpine AS build

ARG MINIO_VERSION=RELEASE.2025-09-07T16-13-09Z
RUN go install github.com/minio/minio@${MINIO_VERSION}

FROM alpine:3.22
RUN apk add --no-cache ca-certificates tzdata
COPY --from=build /go/bin/minio /usr/local/bin/minio

EXPOSE 9000 9001
ENTRYPOINT ["minio"]
