# Gerenciador de Livros

## Instalação do Docker necessária para executar a solução
- Windows/MacOs: https://docs.docker.com/desktop/
- Linux: https://docs.docker.com/engine/install/

## Executar via Docker

Na raiz do projeto após ser clonado, entre no diretório:

    cd GerenciadorLivros
- Verifique se está no diretório raiz e contém o arquivo: docker-compose.yml

Execute o comando do Docker:

    docker compose up --build -d

Abra o navegador:

-   Swagger: http://localhost:8080/swagger/
-   Aplicação: http://localhost:3000/

## Executar em modo de depuração - Backend

### NET 10.0
- NET 10: https://dotnet.microsoft.com/en-us/download/dotnet/10.0

    Siga o passo a passo para o seu sistema operacional

### SQLServer
    Na raiz do projeto após ser clonado, entre no diretório:

    cd GerenciadorLivros

    cd DockerSqlServer

    docker compose up -d

## Modificações para acesso ao BANCO
    Abra a IDE Visual Studio ou Rider 
    acesse: GerenciadorLivros.API

### Modificar **appsettings.json**

### Atual executando via docker
    "DefaultConnection": "..."

#### Para

    "DefaultConnection": "Server=localhost;Database=GerenciadorLivrosDB;User Id=sa;Password=TesteAPI!123;TrustServerCertificate=True"

## Executando via IDE
    Execute via  Visual Studio ou Rider, clicar no botão de "RUN" ou de "Debug"

## Executando via linha de comando
    cd GerenciadorLivros

- Verifique se está no diretório raiz do backend e se contém o arquivo: GerenciadorLivros.sln

#### Execute os comandos abaixo para iniciar a aplicaçao

    dotnet ef database update --project GerenciadorLivros.Infrastructure --startup-project GerenciadorLivros.API
 
    Executando do diretório da solução:
    dotnet run --project GerenciadorLivros.API

    Executando do diretório do projeto:
    cd GerenciadorLivros.API
    dotnet run

 ### Caso ocorra algum erro verifique se dotnet-ef está instalado

    instalar: dotnet tool install --global dotnet-ef
    atualizar: dotnet tool update --global dotnet-ef

### Abra o navegador:

-   Swagger: http://localhost:5128/swagger/

## Executar em modo de depuração - Frontend

### Instalar o Node.js 24.x

- Node.js: https://nodejs.org/pt-br/download

    Siga o passo a passo para o seu sistema operacional

### Instalando as dependências 
    Na raiz do projeto após ser clonado, entre no diretório:

    cd GerenciadorLivros

    cd GerenciadorLivrosApp 

    npm install 
### Modificar **env.ts**

### Atual executando via docker
    export const ENV = {
        API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    };

#### Para
    export const ENV = {
        API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5128/api/v1',
    };

### Executando o frontend
    npm run dev

-   Aplicação: http://localhost:5173/

### Executando testes unitários do frontend
    npx vitest