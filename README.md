![itell_panoramic](https://github.com/user-attachments/assets/97897488-c989-4856-98b6-62abb33985b9)

# iTELL

See our documentation here:
[iTELL Wiki](https://github.com/learlab/itell-strapi-demo/wiki)

## Development Instructions

There are two ways to run a iTELL project locally:

- Use [Dev Containers](#with-dev-containers). This is the recommended approach
  if you are comfortable working with VSCode and Docker.

- Build the project [manually](#manual-setup). This may be more straightforward
  if you are experienced in working with pnpm monorepos.

Either way, you can start with cloning this repository

```
git clone https://github.com/learlab/itell.git
```

## Manual Setup

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/en/download/): use version 20.0 or higher

- [pnpm](https://pnpm.io/installation): use version 9.0 or higher

- A postgres database. If you choose to use a local database, you need to create
  a database with an arbitrary name and get its url. You can use a tool like
  [pgAdmin](https://www.pgadmin.org/) for this.

After cloning the repository and `cd` into the folder, you will see the
following folder structure: (omitting some folders for brevity)

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

Go the specific volume folder you are working on. For example, if you are
working on the `app-1` volume, change directory into `apps/app-1/`.

```bash
cd apps/app-1
```

Create a new file `.env` in the volume folder. Fill in the necessary environment
variables, see [instructions](./vercel.md)

> [!IMPORTANT] Replace the `DATABASE_URL` value in `.env` with the URL of your
> postgres database.

With the `.env` file in place, you can initialize your database and build the
app.

```bash
pnpm run setup
```

The command takes care of all the setup jobs including installing dependencies,
building internal libraries, initializing the database, etc. It should finish in
less than 5 minutes, the logs at the end looks like

```
@itell/app-1:build: ○  (Static)   prerendered as static content
@itell/app-1:build: ●  (SSG)      prerendered as static HTML (uses generateStaticParams)
@itell/app-1:build: ƒ  (Dynamic)  server-rendered on demand
@itell/app-1:build:
@itell/app-1:build:

 Tasks:    10 successful, 10 total
Cached:    0 cached, 10 total
  Time:    1m40.234s
```

If no error message is shown, the setup is successful. You can now start the
development server via

```
pnpm run dev
```

This will print a localhost URL where you can view the app in your browser.

The next time you want to start the development server, you only need to run
`pnpm run dev` in the volume folder. No need to run the other commands again.

> [!NOTE] If you need to switch between multiple projects, you also need to
> configure your Git `git config --global merge.ours.driver true`

### All commands

```bash
# install dependencies
pnpm install
# go to the volume directory
cd apps/app-1
# fill in the .env file and initialize the database
pnpm drizzle-kit migrate
# build
pnpm run build:deps

# start the development server
pnpm run dev
```

## With Dev Containers

Dev containers are a convenient method for ensuring a completely reproducible
development environment.

1. Install Docker and VS Code.
2. Install the Remote - Containers extension in VS Code.
3. Clone this repository and open it in VS Code.
4. Add a `.env` file to the root of the repository (speak to a team member for
   the contents).
5. Use the "Reopen in Container" command.
6. Open a new VS Code terminal (inside the container) and run
   `pnpm install turbo --global`.
7. Make sure that the git repository is trusted. Use the "Git: Manage Unsafe
   Repositories" command.
8. Run `turbo run dev --filter=@itell/research-methods-in-psychology` (or
   whichever iTELL volume/app you want to work on).
