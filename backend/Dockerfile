# Backend Dockerfile
FROM python:3.11

WORKDIR /app

COPY requirements.txt /app/
RUN python3 -m venv venv \
    && . venv/bin/activate \
    && pip install --upgrade pip \
    && pip install -r requirements.txt

COPY . /app

EXPOSE 5050

CMD ["/bin/bash", "-c", "source venv/bin/activate && python3 app.py"]

