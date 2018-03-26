import angular from 'angular'; // eslint-disable-line no-unused-vars
import 'angular-mocks';

const context = require.context('./app', true, /\.(js|ts|tsx)$/);
context.keys().forEach(context);
