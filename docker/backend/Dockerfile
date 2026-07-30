FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["backend/TrailsUA.Api/TrailsUA.Api.csproj", "backend/TrailsUA.Api/"]
RUN dotnet restore "backend/TrailsUA.Api/TrailsUA.Api.csproj"

COPY . .
WORKDIR "/src/backend/TrailsUA.Api"
RUN dotnet publish "TrailsUA.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TrailsUA.Api.dll"]
