# dotnet-container

## Goal

- Build simple dotnet web project.
- Publish to github container registry for AWS (Lightsail?) deployment.
- Refresh + demonstrate good containerisation/CI practices.
- Simple launchpad codebase for future backend projects.

## Local set up (Windows WSL)

- [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Ensure docker is set up with WSL](https://docs.docker.com/desktop/wsl/)
- [Install dotnet in WSL](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu)

## Creating the app

```bash
$ dotnet new sln
$ dotnet new web -o web
$ dotnet sln add web
```

## Running on local machine

```bash
$ dotnet build
$ dotnet run --project web
```

## Running in container

See [dockerfile](./web/Dockerfile).

```bash
$ docker build -t web ./web
$ docker run web
```

## References

- [Dotnet console docker sample](https://github.com/dotnet/dotnet-docker/blob/main/samples/dotnetapp/README.md)
- [Dotnet asp docker sample](https://github.com/dotnet/dotnet-docker/blob/main/samples/aspnetapp/README.md)
- [Dotnet CLI project creation](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-new)
- [Containerizing dotnet](https://chris-ayers.com/2023/12/03/containerizing-dotnet-part-1)
