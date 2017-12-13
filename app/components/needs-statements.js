import { computed } from '@ember/object';
import Component from '@ember/component';
import fetch from 'fetch';

const statements = 'https://api.github.com/repos/NYCPlanning/labs-cd-needs-statements/git/trees/master?recursive=1';
const download = 'https://docs.google.com/viewer?url=https://github.com/NYCPlanning/labs-cd-needs-statements/raw/master/';

export default Component.extend({
  district: null,
  downloadPath: download,
  allStatements: computed('district', function() {
    return fetch(statements).then(d => d.json());
  }),

  availableYears: computed('district', function() {
    const district = this.get('district');

    return this.get('allStatements')
      .then(statements=> {
        return statements.tree
          .filter(statement => statement.type === 'blob')
          .filter(statement => statement.path.indexOf(district.get('borocdAcronym')) !== -1)
          .map(statement => {
            statement.name = stripDirectory(statement.path);
            return statement;
          })
          .reverse();
      });
  }),

  showAll: false,

  truncatedYears: computed('district', 'showAll', function() {
    return this.get('availableYears').then(years => {
      if(this.get('showAll')) {
        return years;
      } else {
        return years.slice(0,3);
      }
    });
  }),

  actions: {
    toggleList() {
      this.toggleProperty('showAll');
    },
  },
});

function stripDirectory(string) {
  const loc = string.lastIndexOf('/');
  return string.substring(loc+1, string.length);
}
