import Ember from 'ember'; // eslint-disable-line
import carto from '../utils/carto';

export default Ember.Component.extend({
  district: null,
  studies: Ember.computed('district', function() {
    const borocd = this.get('district.borocd');
    const SQL = `SELECT * FROM cdprofiles_studies_plans WHERE cd LIKE '%25${borocd}%25'`;
    return carto.SQL(SQL, 'json')
      .then((json) => {
        return json;
      });
  }),
});
