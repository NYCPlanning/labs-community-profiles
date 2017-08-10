import Ember from 'ember'; // eslint-disable-line
import config from './config/environment'; // eslint-disable-line

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function () { // eslint-disable-line
  this.route('profile', { path: '/:boro/:cd' }, () => {});
  this.route('404', { path: '/404' });
});

export default Router;
