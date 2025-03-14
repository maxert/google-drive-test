# 📁 NestJS Google Drive File Uploader

Цей проєкт реалізує простий, ефективний і захищений веб-сервіс на базі **NestJS**, який дозволяє завантажувати файли на **Google Drive** через посилання, а також переглядати список завантажених файлів.

## 🚀 Можливості

- Завантаження файлів з інтернету безпосередньо на Google Drive.
- Отримання списку всіх завантажених файлів з посиланнями.
- Підтримка файлів великого розміру (через потокове завантаження).
- Автоматичні міграції з TypeORM.
- Повна інтеграція CI/CD через GitHub Actions.

## 🛠️ Використані технології

- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Google Drive API**
- **Docker Compose**
- **JWT, Helmet, Throttler (для безпеки)**
- **GitHub Actions (CI/CD)**

## 📦 Встановлення та запуск




### 1. Клонування репозиторію

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. Конфігурація

Створи файл `.env`:

```dotenv
DB_HOST=localhost (postgres якщо Docker)
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret
```

Помісти файл авторизації Google Drive (`client_secret.json`) в корінь проєкту.

### 4. Запуск з Docker Compose

```bash
docker-compose up -d --build
```

Сервіс буде доступний за адресою `http://localhost:3000`.

## 📌 Використання API

### 🔼 Завантаження файлів

```http
POST /files

{
  "urls": ["https://example.com/file.pdf"]
}
```

### 📃 Отримання списку файлів

```http
GET /files
```

## 🛠️ Запуск скриптів та міграцій TypeORM

### Генерація міграцій

```bash
npm run build
npm run typeorm migration:generate -d dist/config/ormconfig.js src/database/YourMigrationName
```

### Запуск міграцій

```bash
npm run build
npm run typeorm migration:run -d dist/config/ormconfig.js
```

## 🔄 CI/CD Workflow

CI/CD налаштовано через **GitHub Actions**:

- Перевірка компіляції та запуск міграцій при push у гілку `main`.
- Автоматичний deploy через Docker Compose.

## 📂 Структура проєкту

```
nestjs-app
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .env
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── google-drive
│   │   ├── google-drive.module.ts
│   │   ├── google-drive.interface.ts
│   │   └── google-drive.service.ts
│   ├── files
│   │   ├── files.module.ts
│   │   ├── files.controller.ts
│   │   ├── files.service.ts
│   │   ├── files.processor.ts
│   │   ├── repository
│   │   │   ├── IFilesRepository.ts
│   │   │   └── files.repository.ts
│   │   ├── entities
│   │   │   └── file.entity.ts
│   │   └── dto
│   │       ├── create-file.dto.ts
│   │       └── file-response.dto.ts
└── ...
```

