import Ember from 'ember'; // eslint-disable-line
import carto from '../utils/carto';

export default Ember.Component.extend({
  district: null,
  plans: Ember.computed('district', function() {
    const borocd = this.get('district.borocd');
    const SQL = `SELECT * FROM cdprofiles_197a_plans WHERE cd LIKE '%25${borocd}%25'`;
    return carto.SQL(SQL, 'json');
  }),
});
