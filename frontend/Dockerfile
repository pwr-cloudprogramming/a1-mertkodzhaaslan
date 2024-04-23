
FROM busybox:1.35

WORKDIR /usr/src/app

COPY src/ .

ENTRYPOINT ["busybox"]
CMD ["httpd", "-f", "-v", "-p", "3000"]
