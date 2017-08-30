import Ember from 'ember'; // eslint-disable-line
import fetch from 'fetch'; // eslint-disable-line

export default Ember.Component.extend({
  district: null,
  projects: Ember.computed('district', function() {
    const boro = this.get('district.boro').toLowerCase();
    const cd = this.get('district.cd');
    const URL = `https://lucats.planninglabs.nyc/urlurp/cd/${boro}/${cd}.json`;

    return fetch(URL)
      .then(data => data.json())
      .then((data) => {
        data.forEach((d) => {
          d.projectName = d.projectName !== '' ? d.projectName : 'Unnamed Project'; // eslint-disable-line
        });

        return data;
      });
  }),
  active: Ember.computed('projects', function() {
    const projects = this.get('projects');
    return projects.then(data => data.filter(d => d.status === 'active'));
  }),

  completed: Ember.computed('projects', function() {
    const projects = this.get('projects');
    return projects.then(data => data.filter(d => d.status === 'completed'));
  }),
});
