# asylumjourney-frontend

Angular frontend for the Asylum Journey project, http://asylumjourney.sheffugees.org/. Part of [Sheffugees](http://www.yoomee.com/first-refugee-hackathon)

Please note that this project, and the data it uses, are a work in progress.

## Getting Started

```
npm install

gulp
````

## Running locally

```
gulp serve
```

## Deployment

You will need to have access to the Firebase projects and install the CLI `npm install -g firebase-tools` to deploy.

Before deploying you need to run `gulp build` to build the latest version to the dist folder.

### Deploying to production

In the master branch

```
gulp build

firebase deploy -P production
```

### Deploying to staging

In the develop branch

```
gulp build

firebase deploy -P staging
```


## Running tests

```
gulp test
````

## Staging site

http://sheffugees.amybdesign.co.uk/

The staging site uses a fork of the main repo - https://github.com/amyvbenson/asylumjourney-frontend

To deploy to staging, in the staging repo:

* PR to master branch
* Review & merge
* Pull master
* change the CNAME file to contain `sheffugees.amybdesign.co.uk`
* gulp deploy
* undo the CNAME change

## Style guide

https://github.com/johnpapa/angular-styleguide

## Contributing

See [Issues](https://github.com/Sheffugees/asylumjourney-frontend/issues) for details of features, bugs etc.  Please target Pull Requests at the develop branch.
