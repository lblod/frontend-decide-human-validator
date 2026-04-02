import EmberRouter from '@ember/routing/router';
import config from 'frontend-decide-human-validator/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('annotations', function () {
    this.route('index', { path: '' });
    this.route('annotation', { path: '/:annotation_id' });
  });

  this.route('expressions');

  this.route('validate', {
    path: '/validate/:expression_id',
  });

  this.route('route-not-found', {
    path: '/*wildcard',
  });
});
