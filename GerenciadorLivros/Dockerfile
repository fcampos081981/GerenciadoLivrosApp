FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY *.sln .
COPY GerenciadorLivros.API/*.csproj ./GerenciadorLivros.API/
COPY GerenciadorLivros.Application/*.csproj ./GerenciadorLivros.Application/
COPY GerenciadorLivros.Domain/*.csproj ./GerenciadorLivros.Domain/
COPY GerenciadorLivros.Infrastructure/*.csproj ./GerenciadorLivros.Infrastructure/
COPY GerenciadorLivros.Tests/*.csproj ./GerenciadorLivros.Tests/

RUN dotnet restore

COPY . .

WORKDIR /src/GerenciadorLivros.API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "GerenciadorLivros.API.dll"]