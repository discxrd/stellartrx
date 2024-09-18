FROM python:3.11-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /teaser

COPY ./requirements.txt ./requirements.txt

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .