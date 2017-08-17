import Ember from 'ember';
const statements = 'https://api.github.com/repos/NYCPlanning/labs-cd-needs-statements/git/trees/master?recursive=1';
const download = 'https://github.com/NYCPlanning/labs-cd-needs-statements/raw/master/';

export default Ember.Component.extend({
  district: null,
  downloadPath: download,
  allStatements: Ember.computed('district', function() {
    return fetch(statements).then(d => d.json());
  }),

  availableYears: Ember.computed('district', function() {
    const district = this.get('district');

    return this.get('allStatements')
      .then(statements=> {
        console.log(statements);
        return statements.tree
          .filter(statement => statement.type === 'blob')
          .filter(statement => statement.path.indexOf(district.get('borocdAcronym')) !== -1)
          .map(statement => {
            statement.name = stripDirectory(statement.path);
            return statement;
          });
      });
  }),

  showAll: false,

  truncatedYears: Ember.computed('district', 'showAll', function() {
    return this.get('availableYears').then(years => {
      console.log(years);
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
