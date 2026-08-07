FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["backend/TrailsUA.API/TrailsUA.API.csproj", "backend/TrailsUA.API/"]
RUN dotnet restore "backend/TrailsUA.API/TrailsUA.API.csproj"

COPY . .
WORKDIR "/src/backend/TrailsUA.API"
RUN dotnet publish "TrailsUA.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TrailsUA.API.dll"]
