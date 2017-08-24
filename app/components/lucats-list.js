import Ember from 'ember'; // eslint-disable-line
import fetch from 'fetch'; // eslint-disable-line

export default Ember.Component.extend({
  district: null,
  projects: Ember.computed('district', function() {
    const boro = this.get('district.boro').toLowerCase();
    const cd = this.get('district.cd');
    const URL = `https://lucats.planninglabs.nyc/cdprojects/${boro}/${cd}`;

    return fetch(URL)
      .then(data => data.json())
      .then((data) => {
        data.forEach((d) => {
          d.projectName = d.projectName !== '' ? d.projectName : 'Unnamed Project'; // eslint-disable-line
        });

        return data;
      });
  }),
});
