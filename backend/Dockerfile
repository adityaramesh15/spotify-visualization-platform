# Backend Dockerfile
FROM python:3.11

WORKDIR /app

COPY requirements.txt /app/
RUN pip3 install -r requirements.txt

COPY . /app

EXPOSE 5050

CMD ["python", "app.py"]
