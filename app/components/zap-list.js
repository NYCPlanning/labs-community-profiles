import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import fetch from 'fetch'; // eslint-disable-line
import ENV from 'labs-community-portal/config/environment';

export default Component.extend({
  district: null,

  projects: computed('district', function() {
    try {
      const zapAcronym = this.get('district.zapAcronym');
      /* eslint-disable-next-line no-unused-vars */
      const zapApi = ENV.ZAP_API;

      const URL = `${zapApi}/projects?community-districts[]=${zapAcronym}`;

      return fetch(URL)
        .then(res => res.json())
        .then((res) => {
          // get the data object, return object with arrays of projects grouped by dcp_publicstatus_simp
          const projects = res.data;

          if (projects) {
            projects.forEach((project) => {
              if (project.attributes.applicants) {
                const applicant = project.attributes.applicants.split(';')[0];
                project.attributes.applicant = applicant; // eslint-disable-line
              } else {
                project.attributes.applicant = 'Unknown Applicant';
              }
            });
          }

          return {
            filed: projects.filter(d => d.attributes['dcp-publicstatus'] === 'Filed'),
            inPublicReview: projects.filter(d => d.attributes['dcp-publicstatus'] === 'In Public Review'),
          };
        });
    } catch (e) {
      console.log('error in the computed property of projects on zap-list.js', e); // eslint-disable-line
      throw e;
    }
  }),
});
