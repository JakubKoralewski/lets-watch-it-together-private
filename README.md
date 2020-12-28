# lets-watch-it-together [![](https://img.shields.io/badge/Wiki-Notion-%23000)](https://www.notion.so/jcubed/Let-s-Watch-It-Together-Wiki-881515aba11241eaa43e7a9428419d81) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/JakubKoralewski/lets-watch-it-together/test) [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


RUP University Project

## Contributing

### Development

This is when you have Node.js and Docker installed.

```bash
$ npm install
$ docker-compose up --detach
$ npm run dev
```

Then once you're finished, tear down the PostgreSQL and Redis containers.
```bash
$ docker-compose down
```

### Production

Make sure you have Docker installed. Then run:

```bash
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```