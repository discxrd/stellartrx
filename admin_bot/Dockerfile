# build deps
FROM python:alpine3.19 as builder

WORKDIR /admin_bot

ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1 
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 

COPY requirements.txt . 

RUN pip wheel --no-cache-dir --no-deps --wheel-dir /admin_bot/wheels -r requirements.txt

# Runtime
FROM python:3.11-alpine3.19

WORKDIR /admin_bot

ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1 
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 

COPY --from=builder /admin_bot/wheels /wheels
COPY --from=builder /admin_bot/requirements.txt .
COPY . .

RUN pip install --no-cache /wheels/*

ENTRYPOINT [ "python", "main.py" ]