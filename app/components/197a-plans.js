import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import carto from '../utils/carto';

export default Component.extend({
  district: null,
  plans: computed('district', function() {
    const borocd = this.get('district.borocd');
    const SQL = `SELECT * FROM cdprofiles_197a_plans WHERE cd LIKE '%25${borocd}%25'`;
    return carto.SQL(SQL, 'json');
  }),
});
