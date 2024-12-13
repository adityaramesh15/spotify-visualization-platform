FROM python:3.11


RUN groupadd --gid 1000 developer \
    && useradd --uid 1000 --gid developer --shell /bin/bash --create-home developer

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY . /app/


RUN chown -R developer:developer /app


ENV PYTHONPATH="${PYTHONPATH}:/app"
EXPOSE 5050


USER developer

CMD [ "python3", "app.py" ]