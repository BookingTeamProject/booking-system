# Механизм авторизации и безопасности

## 1. Ролевая модель (RBAC)

Приложение поддерживает 4 уровня доступа:
* `User (0)` — Орендар / Турист (просмотр маршрутов, бронирование, отзывы).
* `Landlord (1)` — Орендодавець / Гид (создание и удаление собственных маршрутов).
* `Moderator (2)` — Модератор (проверка контента).
* `Admin (3)` — Администратор (полное управление пользователями и ролями).

---

## 2. Диаграмма последовательности входа (JWT & Refresh Token)

```mermaid
sequenceDiagram
    autonumber
    actor User as Пользователь (React)
    participant API as ASP.NET Core API
    participant Service as AuthService
    participant DB as PostgreSQL DB

    User->>API: POST /api/auth/login {email, password}
    API->>Service: LoginAsync(dto)
    Service->>DB: SELECT * FROM Users WHERE Email = email
    DB-->>Service: Возвращает данные пользователя
    Service->>Service: Проверка BCrypt.Verify(password, hash)
    
    alt Пароль верный
        Service->>Service: Генерация Access Token (15 мин) + Refresh Token (7 дней)
        Service->>DB: UPDATE Users SET RefreshToken = token
        DB-->>Service: Успешное сохранение
        Service-->>API: AuthResponseDto (Tokens + UserInfo)
        API-->>User: 200 OK + JWT Access & Refresh Tokens
    else Пароль неверный
        Service-->>API: Exception ("Неверный email или пароль")
        API-->>User: 400 Bad Request / Error JSON
    end
```