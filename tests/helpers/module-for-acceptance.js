import { module } from 'qunit';
import { resolve } from 'rsvp';
import startApp from './start-app';
import destroyApp from './destroy-app';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments); //eslint-disable-line
      }

      return null;
    },

    afterEach() {
      const afterEach = options.afterEach && options.afterEach.apply(this, arguments); //eslint-disable-line
      return resolve(afterEach).then(() => destroyApp(this.application));
    },
  });
}
