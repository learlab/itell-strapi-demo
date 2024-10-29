![itell_panoramic](https://github.com/user-attachments/assets/97897488-c989-4856-98b6-62abb33985b9)

# iTELL

See our documentation here: [iTELL Wiki](https://github.com/learlab/itell-strapi-demo/wiki)

## Development Instructions

There are two ways to run a iTELL project locally:

- Use [Dev Containers](#with-dev-containers). This is the recommended approach if you are comfortable working with VSCode and Docker.

- Build the project [manually](#manual-setup). This may be more straightforward if you are experienced in working with pnpm monorepos.

Either way, you can start with cloning this repository

```
git clone https://github.com/learlab/itell-strapi-demo.git
```

## Manual Setup

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/en/download/): use version 20.0 or higher

- [pnpm](https://pnpm.io/installation): use version 9.0 or higher

- A postgres database. If you choose to use a local database, you need to create a database with an arbitrary name and get its url. You can use a tool like [pgAdmin](https://www.pgadmin.org/) for this.

After cloning the repository and `cd` into the folder, you will see the following folder structure: (omitting some folders for brevity)

```bash
apps/
  app-1/
    package.json
  app-2/
packages
  package-1/
  package-2/
package.json
```

The `apps` folder contains the different iTELL volumes. Each app is a separate Next.js project. You only need to work on the one volume that is relevant to you. All the apps need common dependencies that you should download via

```
pnpm install
```

Then, find the `package.json` file for the specific volume you are working on. For example, if you are working on the `app-1` volume, go to `apps/app-1/package.json`. Find the `name` field in the `package.json` file, e.g.

```
"name": "@itell/app-1",
```

> [!IMPORTANT]
> Go to the volume-specific package.json, not the package.json file that is in the root of the repository.

After you find the volume name, run the following command from the root directory

```bash
# replace @itell/app-1 with your volume name
pnpm turbo run build --filter @itell/app-1
```

Then, cd into your volume directory

```
cd apps/app-1
```

You will find a `.env.example` file in the root of the volume directory. Copy this file and rename it to `.env`. Fill in the necessary environment variables. Contact a team member for the values.

> [!IMPORTANT]
> Replace the `DATABASE_URL` value in `.env` with the URL of your postgres database.

With the `.env` file in place, you can initialize your database and start the development server with the following commands

```
pnpm drizzle-kit migrate
pnpm run dev
```

The `pnpm drizzle-kit migrate` command is only needed once to initialize the database. The `pnpm run dev` command is used to start the development server.

This will print a localhost URL where you can view the app in your browser.

From now on, you typically only need to run commands from the `apps/app-1` directory without worrying about the entire monorepo.

### All commands

```bash

pnpm install
pnpm turbo run build --filter @itell/app-1

cd apps/app-1
# fill in the .env file
pnpm drizzle-kit migrate
pnpm run dev
```

## With Dev Containers

Dev containers are a convenient method for ensuring a completely reproducible development environment.

1. Install Docker and VS Code.
2. Install the Remote - Containers extension in VS Code.
3. Clone this repository and open it in VS Code.
4. Add a `.env` file to the root of the repository (speak to a team member for the contents).
5. Use the "Reopen in Container" command.
6. Open a new VS Code terminal (inside the container) and run `pnpm install turbo --global`.
7. Make sure that the git repository is trusted. Use the "Git: Manage Unsafe Repositories" command.
8. Run `turbo run dev --filter=@itell/research-methods-in-psychology` (or whichever iTELL volume/app you want to work on).
