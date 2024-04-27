FROM python:3.9

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /RCC_BookManagementSystem

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
