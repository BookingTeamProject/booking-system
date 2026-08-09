FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Копируем .csproj файлы ВСЕХ трех проектов
COPY ["backend/TrailsUA.API/TrailsUA.API.csproj", "backend/TrailsUA.API/"]
COPY ["backend/TrailsUA.Domain/TrailsUA.Domain.csproj", "backend/TrailsUA.Domain/"]
COPY ["backend/TrailsUA.Infrastructure/TrailsUA.Infrastructure.csproj", "backend/TrailsUA.Infrastructure/"]

# Восстанавливаем зависимости
RUN dotnet restore "backend/TrailsUA.API/TrailsUA.API.csproj"

# Копируем остальной код и собираем
COPY . .
WORKDIR "/src/backend/TrailsUA.API"
RUN dotnet publish "TrailsUA.API.csproj" -c Release -o /app/publish

# Финальный образ для запуска
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TrailsUA.API.dll"]
