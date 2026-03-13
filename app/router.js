import EmberRouter from '@ember/routing/router';
import config from 'frontend-decide/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('auth', { path: '/authorization' }, function () {
    this.route('index', { path: '' });
    this.route('receive-credential');
    this.route('present-credential');
    this.route('registration');
    this.route('callback');
    this.route('buy-access');
  });

  this.route('mock-login');
  this.route('login');
  this.route('logout'); 

  this.route('dcat', function () {
    this.route('distributions.distribution', {
      path: '/distributions/:distribution_id',
    });
    this.route('datasets', function () {
      this.route('index', { path: '' });
      this.route('dataset', { path: '/:dataset_id' });
    });
    this.route('catalogs', function () {
      this.route('index', { path: '' });
      this.route('catalog', { path: '/:catalog_id' });
    });
  });

  this.route('annotations', function () {
    this.route('index', { path: '' });
    this.route('annotation', { path: '/:annotation_id' });
  });

  this.route('route-not-found', {
    path: '/*wildcard',
  });
});
