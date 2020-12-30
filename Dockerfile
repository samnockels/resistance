FROM python:3.7-alpine
WORKDIR /app
ENV FLASK_APP=server.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev libffi-dev openssl-dev linux-headers 
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY ./app .
CMD ["flask", "run"]