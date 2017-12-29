import Component from '@ember/component'; // eslint-disable-line
import computed from 'ember-computed-decorators';

export default Component.extend({
  mode: '2015',

  @computed('mode')
  buildingComparisonChartColumn(mode) {
    return (mode === '2015') ? 'current_fp_bldg' : 'future_fp_bldg';
  },

  @computed('mode')
  resunitsComparisonChartColumn(mode) {
    return (mode === '2015') ? 'current_fp_resunits' : 'future_fp_resunits';
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
