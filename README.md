Further development in https://github.com/JakubKoralewski/lets-watch-it-together

# lets-watch-it-together [![](https://img.shields.io/badge/Wiki-Notion-%23000)](https://www.notion.so/jcubed/Let-s-Watch-It-Together-Wiki-881515aba11241eaa43e7a9428419d81) [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/JakubKoralewski/lets-watch-it-together/test?label=tests)](https://github.com/JakubKoralewski/lets-watch-it-together/actions?query=workflow%3Atest) [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

SCRUM University Project

Live at https://lets-watch-it-together-scrum.herokuapp.com

This repository has been a private fork of the [original one](https://github.com/JakubKoralewski/lets-watch-it-together)
where a small SCRUM team was supposed to improve the project after the RUP
phase was finished. The original repo is the place further development should be done.

Read the [Let's Watch It Together Wiki](https://www.notion.so/jcubed/Let-s-Watch-It-Together-Wiki-881515aba11241eaa43e7a9428419d81)
for more information regarding the implementation.

## Contributing

Check out [.env.example](.env.example) file, you have to fill some of those environment
variables, and copy them to `.env` (and create it if it doesn't exist).

This includes:
- `GITHUB_ID` and `GITHUB_SECRET`
    - the GitHub OAuth app credentials for login to work,
    - you may create a GitHub OAuth app yourself or
      contact @JakubKoralewski for those credentials
- `TMDB_API_KEY`
    - to be able to talk to TMDB API
    - you need to create a TMDB account at `https://themoviedb.org` and copy
      the `v3 auth` key from `https://www.themoviedb.org/settings/api`
- potentially more if this README wasn't updated
   

### Development

This is when you have [Node.js](https://nodejs.org/en/download/) and 
[Docker](https://docs.docker.com/get-docker/) installed.

Make sure Docker is running.
Set `NODE_ENV` to `development` to disable PWA.

1. Install Node dependencies:

    Only required first time you run, or when dependencies change.

    ```bash
    $ npm install
    ```

2. Start PostgreSQL and Redis containers in Docker:

    #### Option A

    When you want the `docker-compose` command to run in the background:

    ```bash
    $ docker-compose up --detach
    ```

    #### Option B

    To see the output of `docker-compose`. You will need to run 
    the commands after this one in another terminal window.

    ```bash
    $ docker-compose up
    ```

3. Run migrations:

    Only required first time the database is run, or when new migrations
    are added.

    ```bash
    $ npx prisma migrate dev --preview-feature
    ```
   
   You can also add some dummy users if you want:
   
   **THIS BREAKS EVERYTHING IF THE SERVER IS RUNNING!!!**
   ```bash
   $ npm run dev-seed
   ```
   
   Once you run the above command you should be able to use the `SIGN IN WITH TEST USERS`
   button. You may see an error after clicking it, but proceed to type either `guest1`
   or `guest2` (case-insensitive) to login as one of the test users. This should allow
   you to send friend requests, accept them, send meeting invites etc. in your local
   development environment.
   
   Clicking the `SIGN IN WITH TEST USERS` button without running the above command is
   currently [undefined behavior](https://en.wikipedia.org/wiki/Undefined_behavior).

4. Start the Next.js app in development mode (with live reload):

    ```bash
    $ npm run dev
    ```
   
   You can now start making changes to the code!
   
5. Tear down database and cache.

    If used Option A, then once you're finished, tear down the PostgreSQL and Redis containers: 
    ```bash
    $ docker-compose down
    ```
   
    Else just hit Ctrl+C if run Option B.

#### Testing

Before you commit and push a Pull Request it is a good idea to check if the tests
still pass. It's also a good idea to add more tests regarding the feature 
you added.

To run tests once:

```bash
$ npm test
```

To run tests in the background as you are developing 
(only those tests will be run for which files have changed):

```bash
$ npx jest --watch
```

You can use the `--watchAll` flag to rerun all tests.

See the [Jest docs](https://jestjs.io/docs/en/getting-started) for more details.


### Database schema changes

If you changed the schema inside `prisma/schema.prisma` you need to save those changes
as SQL migrations for other developers to replay those changes on their databases as well:

```bash
$ npx prisma migrate dev --name a-descriptive-name-of-the-thing-you-changed --preview-feature
```

where `a-descriptive-name-of-the-thing-you-changed` is a descriptive name of the thing you changed
inside the database schema, e.g. `dropped-the-database-because-its-stupid`.

Use the `--create-only` flag when running `migrate dev` if you want to change the generated SQL 
before applying it to make some database specific changes that Prisma does not yet support.

See the [Prisma Migrate documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
for more details.

### Production

To see how the containers run in production, or when you change the [`Dockerfile`](./Dockerfile)
you may want to run these commands.

Make sure you have Docker installed. Then run (to test all containers):

```bash
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

To test just the web app `Dockerfile`:

```bash
$ docker build . --tag lwit
```

To also run the above built image:
```bash
$ docker run -e PORT=3000 lwit
```

where `3000` is the port you want the server to run on and `lwit` is
the same tag you named the image in `docker build`.

To also have all the environment variables (you need to fill them in):
But this looks like it can't connect to the other Docker containers
(Postgres and Redis), so it doesn't work... try the `docker-compose` command above
```bash
$ docker run -p 3000:3000 -e PORT=3000 \
  -e DATABASE_URL=postgresql://postgres:postgres-dev@localhost:5432/db \
  -e REDIS_URL=redis://localhost:6379 -e GITHUB_ID=PASTEHERE \
  -e GITHUB_SECRET=PASTEHERE -e TMDB_API_KEY=PASTEHERE lwit
```

Also you can build the app to make sure it works in production:
```bash
$ NODE_ENV=production npm run build
```
