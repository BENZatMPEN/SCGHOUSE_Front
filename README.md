# การติดตั้ง

## Clone project หรือ copy files

## 1. ตั้งค่า environment variables ใน docker-compose.yaml
#### environment

| Variable            | Value    | Description     |
| ------------------- | -------- | --------------- |
| REACT_APP_BACKEND_API_ENDPOINT      | http://127.0.0.1:2300 |           |

## 2. รัน docker file build
```
docker build -t production-anslysis-dashboard .
```
## 3. รัน docker-compose.yaml up
```
docker compose up -d
```
## 4. เปิดเว็บ

```
http://localhost:8000
```

## 5. Default User Password
```
User: admin
Password: mpen987654321
```