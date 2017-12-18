import Component from '@ember/component'; // eslint-disable-line
import computed from 'ember-computed-decorators';

export default Component.extend({
  mode: '2015',

  @computed('mode')
  floodplainSQL(mode) {
    if (mode === '2015') {
      return 'SELECT * FROM support_waterfront_pfirm15 WHERE fld_zone = \'AE\' OR fld_zone = \'VE\'';
    }

    return 'SELECT * FROM cdprofiles_floodplain_2050';
  },

  actions: {
    setMode(mode) {
      this.set('mode', mode);
    },

    sum(accum, curr) {
      return accum + curr;
    },
  },
});
