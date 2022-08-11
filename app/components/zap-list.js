import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import fetch from 'fetch'; // eslint-disable-line
import ENV from 'labs-community-portal/config/environment';

export default Component.extend({
  district: null,

  projects: computed('district', function() {
    try {
      const zapAcronym = this.get('district.zapAcronym');

      const zapApi = ENV.environment === 'development' ? ENV.ZAP_STAGING_API : ENV.ZAP_PRODUCTION_API;

      console.log('environment', ENV);
      console.log('ZAP API URL:');
      console.log(ENV.ZAP_STAGING_API ? `found dev: ${ENV.ZAP_STAGING_API}` : 'not found');
      console.log(ENV.ZAP_PRODUCTION_API ? `found prod: ${ENV.ZAP_PRODUCTION_API}` : 'not found');

      const URL = `${zapApi}/projects?community-districts[]=${zapAcronym}&dcp_publicstatus[]=Filed&dcp_publicstatus[]=In Public Review&page=1`;

      return fetch(URL)
        .then(res => res.json())
        .then((res) => {
          // get the data object, return object with arrays of projects grouped by dcp_publicstatus_simp
          const projects = res.data;

          projects.forEach((project) => {
            if (project.attributes.applicants) {
              const applicant = project.attributes.applicants.split(';')[0];
              project.attributes.applicant = applicant; // eslint-disable-line
            } else {
              project.attributes.applicant = 'Unknown Applicant';
            }
          });

          return {
            filed: projects.filter(d => d.attributes.dcp_publicstatus_simp === 'Filed'),
            inPublicReview: projects.filter(d => d.attributes.dcp_publicstatus_simp === 'In Public Review'),
          };
        });
    } catch (e) {
      console.log('error in the computed property of projects on sap-list.js', e);
      throw e;
    }
  }),
});
