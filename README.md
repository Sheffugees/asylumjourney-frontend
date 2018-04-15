# asylumjourney-frontend

Angular frontend for the Asylum Journey project, http://asylumjourney.sheffugees.org/. Part of [Sheffugees](http://www.yoomee.com/first-refugee-hackathon)

Please note that this project, and the data it uses, are a work in progress.

## Dependencies

- Node, https://nodejs.org/en/download/
- Gulp, https://gulpjs.com/

## Getting Started

```
npm install
````

## Running locally

```
npm start
```

## Testing the production build locally

```
npm run build
npm run serve:dist
```

## Deployment

You will need to have access to the Firebase projects and install the CLI `npm install -g firebase-tools` to deploy.

### Deploying to production

In the **master branch**

```
npm run deploy-production
```

### Deploying to staging

In the **develop branch**

```
npm run deploy-staging
```

## Running tests

```
npm test
````

## Browser support

IE10+