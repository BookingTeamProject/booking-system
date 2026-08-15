# Жизненный цикл HTTP-запроса (Data Flow)

## Схема прохождения запроса через систему

```mermaid
flowchart LR
    A[React Client] -->|1. HTTP Request| B[CORS Middleware]
    B -->|2. Allowed| C[ExceptionHandling Middleware]
    C -->|3. Try/Catch| D[JWT Auth Guard]
    D -->|4. Valid Token| E[Controller]
    E -->|5. DTO| F[Business Service]
    F -->|6. LINQ Query| G[EF Core DbContext]
    G -->|7. SQL| H[(PostgreSQL Docker)]
    H -->|8. Data| G
    G -->|9. Entities| F
    F -->|10. DTO Result| E
    E -->|11. 200 OK JSON| A
```

## Этапы обработки запроса:
1. **CORS Policy:** Проверка домена источника (`http://localhost:5173`).
2. **Global Error Middleware:** Оборачивание всего пайплайна в `try-catch` блок для перехвата необработанных исключений и возврата JSON-ошибок.
3. **Authentication & Authorization Guard:** Валидация JWT токена в заголовке `Authorization: Bearer <token>` и проверка прав ролей (`[Authorize(Roles = "...")]`).
4. **Controller:** Приём DTO, первичная валидация входных данных.
5. **Service Layer:** Выполнение бизнес-логики, проверка прав владения ресурсом, хеширование.
6. **Data Access (EF Core):** Взаимодействие с PostgreSQL через LINQ-запросы, Lazy/Eager Loading (`Include`).