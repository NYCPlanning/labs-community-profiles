import Ember from 'ember'; // eslint-disable-line
import config from './config/environment'; // eslint-disable-line

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: Ember.inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      Ember.get(this, 'metrics').trackPage({ page, title });
    });
  },
});

Router.map(function () {  // eslint-disable-line
  this.route('profile', { path: '/:boro/:cd' }, () => {});
  this.route('about', { path: '/about' }, () => {});
  this.route('not-found', { path: '/*path' });
});

export default Router;
