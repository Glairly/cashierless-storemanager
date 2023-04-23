docker build . -t frontend:latest
docker run --rm -p 3000:3000 frontend:latest