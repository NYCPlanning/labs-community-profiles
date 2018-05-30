import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import fetch from 'fetch'; // eslint-disable-line

export default Component.extend({
  district: null,

  projects: computed('district', function() {
    const zapAcronym = this.get('district.zapAcronym');

    const URL = `https://zap-api.planninglabs.nyc/zap/${zapAcronym}.json`;

    return fetch(URL)
      .then(data => data.json());
  }),
});
