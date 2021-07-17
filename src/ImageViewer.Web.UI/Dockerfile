FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src

# Copy csproj and do restore.
COPY ./ImageViewer.Web.UI.csproj ./
RUN dotnet restore

# Copy everything else and build.
COPY . ./
RUN dotnet publish -c Release -r linux-arm -o /app

# Build final image.
FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim-arm32v7
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["./ImageViewer.Web.UI"]