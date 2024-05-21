FROM busybox:1.35
WORKDIR /usr/src/app
COPY frontend/src/ .
EXPOSE 80
CMD ["httpd", "-f", "-p", "3000"]
