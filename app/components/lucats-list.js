import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import fetch from 'fetch'; // eslint-disable-line

export default Component.extend({
  district: null,

  projects: computed('district', function() {
    const zapAcronym = this.get('district.zapAcronym');

    const URL = `http://localhost:3000/zap/${zapAcronym}.json`;

    return fetch(URL)
      .then(data => data.json());
  }),

  // active: computed('projects', function() {
  //   const projects = this.get('projects');
  //   return projects.then(data => data.filter(d => d.status === 'active'));
  // }),
  //
  // completed: computed('projects', function() {
  //   const projects = this.get('projects');
  //   return projects.then(data => data.filter(d => d.status === 'completed'));
  // }),
});
