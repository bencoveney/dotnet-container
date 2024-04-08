FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG TARGETARCH
WORKDIR /source

COPY *.csproj .
RUN dotnet restore -a $TARGETARCH

# https://github.com/dotnet/sdk/issues/37291
COPY . .
RUN dotnet publish -c Release -a $TARGETARCH -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_HTTP_PORTS=5000
EXPOSE 5000
USER $APP_UID
ENTRYPOINT ["./api"]