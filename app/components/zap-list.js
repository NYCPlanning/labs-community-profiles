import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import fetch from 'fetch'; // eslint-disable-line

export default Component.extend({
  district: null,

  projects: computed('district', function() {
    const zapAcronym = this.get('district.zapAcronym');

    const URL = `https://zap-api-production.herokuapp.com/projects?community-districts[]=${zapAcronym}&dcp_publicstatus[]=Noticed&dcp_publicstatus[]=Filed&dcp_publicstatus[]=In Public Review&page=1`;

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

        const projectsUnderscored = projects.map(project => ({
          dcp_publicstatus: project.attributes['dcp-publicstatus'],
          dcp_name: project.attributes['dcp-name'],
          dcp_projectname: project.attributes['dcp-projectname'],
          dcp_ulurp_nonulurp: project.attributes['dcp-ulurp-nonulurp'],
          applicant: project.attributes.applicant,
        }));

        return {
          noticed: projectsUnderscored.filter(d => d.dcp_publicstatus === 'Noticed'),
          filed: projectsUnderscored.filter(d => d.dcp_publicstatus === 'Filed'),
          inPublicReview: projectsUnderscored.filter(d => d.dcp_publicstatus === 'In Public Review'),
        };
      });
  }),
});
