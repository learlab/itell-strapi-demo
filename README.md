# iTELL

See our documentation here: [iTELL Wiki]([https://learlab.org/itellguide/](https://github.com/learlab/itell-strapi-demo/wiki))

## Development Instructions (using devcontainer)

Dev containers are a convenient method for ensuring a completely reproducible development environment.

1. Install Docker and VS Code.
2. Install the Remote - Containers extension in VS Code.
3. Clone this repository and open it in VS Code.
4. Add a `.env` file to the root of the repository (speak to a team member for the contents).
4. Use the "Reopen in Container" command.
5. Open a new VS Code terminal (inside the container) and run `pnpm install turbo --global`.
6. Make sure that the git repository is trusted. Use the "Git: Manage Unsafe Repositories" command.
7. Run `turbo run dev --filter=@itell/research-methods-in-psychology` (or whichever iTELL volume/app you want to work on).
