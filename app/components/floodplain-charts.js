import Component from '@ember/component'; // eslint-disable-line
import { computed } from '@ember/object';

export default Component.extend({
  mode: '100-yr',

  buildingComparisonChartColumn: computed('mode', function() {
    return (this.mode === '100-yr') ? 'fp_100_bldg' : 'fp_500_bldg';
  }),

  resunitsComparisonChartColumn: computed('mode', function() {
    return (this.mode === '100-yr') ? 'fp_100_resunits' : 'fp_500_resunits';
  }),

  actions: {
    setMode(mode) {
      this.set('mode', mode);
    },

    sum(accum, curr) {
      return accum + curr;
    },
  },
});
