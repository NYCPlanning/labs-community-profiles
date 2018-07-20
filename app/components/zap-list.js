import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import fetch from 'fetch'; // eslint-disable-line

export default Component.extend({
  district: null,

  projects: computed('district', function() {
    const zapAcronym = this.get('district.zapAcronym');

    const URL = `https://zap-api.planninglabs.nyc/projects?community-districts[]=${zapAcronym}&dcp_publicstatus[]=Filed&dcp_publicstatus[]=In Public Review&page=1`;

    return fetch(URL)
      .then(res => res.json())
      .then((res) => {
        // get the data object, return object with arrays of projects grouped by dcp_publicstatus_simp
        const projects = res.data;

        projects.forEach((project) => {
          const applicant = project.attributes.applicants.split(';')[0];
          project.attributes.applicant = applicant; // eslint-disable-line
        });

        return {
          filed: projects.filter(d => d.attributes.dcp_publicstatus_simp === 'Filed'),
          inPublicReview: projects.filter(d => d.attributes.dcp_publicstatus_simp === 'In Public Review'),
        };
      });
  }),
});
