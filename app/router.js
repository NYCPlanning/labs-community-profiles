import { get } from '@ember/object'; // eslint-disable-line
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import EmberRouter from '@ember/routing/router';
import config from 'labs-community-portal/config/environment';

export default class Router extends EmberRouter {
  @service metrics;

  location= config.locationType;

  rootURL= config.rootURL;

  didTransition() {
    this._super(...arguments); // eslint-disable-line
    this._trackPage();
  }

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      get(this, 'metrics').trackPage({ page, title });
    });
  }
}

Router.map(function () {  // eslint-disable-line
  this.route('profile', { path: '/:boro/:cd' }, () => {});
  this.route('about', { path: '/about' }, () => {});
  this.route('not-found', { path: '/*path' });
});
