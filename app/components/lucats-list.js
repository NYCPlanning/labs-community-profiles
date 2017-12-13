import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import fetch from 'fetch'; // eslint-disable-line

export default Component.extend({
  district: null,
  projects: computed('district', function() {
    // remove space in 'staten island'
    const boro = this.get('district.boro').replace(/\s+/g, '').toLowerCase();
    const cd = this.get('district.cd');
    const URL = `https://lucats.planninglabs.nyc/ulurp/cd/${boro}/${cd}.json`;

    return fetch(URL)
      .then(data => data.json())
      .then((data) => {
        data.forEach((d) => {
          d.projectName = d.projectName !== '' ? d.projectName : 'Unnamed Project'; // eslint-disable-line
        });

        return data;
      });
  }),
  active: computed('projects', function() {
    const projects = this.get('projects');
    return projects.then(data => data.filter(d => d.status === 'active'));
  }),

  completed: computed('projects', function() {
    const projects = this.get('projects');
    return projects.then(data => data.filter(d => d.status === 'completed'));
  }),
});
