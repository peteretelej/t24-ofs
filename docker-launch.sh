#!/bin/bash
set -e 

# fetch dserve: lightweight directory server (requires Go)
go get github.com/peteretelej/dserve

docker stop ofs ||true
docker rm ofs ||true

docker run -d --name ofs --restart always \
	--memory 20m --cpus 0.02 \
	-p "127.0.0.1:9115:9115" \
	-v /etc/ssl:/etc/ssl:ro \
	-v /etc/localtime:/etc/localtime:ro \
	-v $GOPATH/bin/dserve:/usr/bin/dserve:ro \
	-v $(pwd):/app \
	debian:jessie dserve -dir /app -port 9115

docker logs -f ofs





