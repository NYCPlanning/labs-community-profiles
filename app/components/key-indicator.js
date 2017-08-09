import Ember from 'ember';
import d3 from 'd3';

const { computed } = Ember;

export default Ember.Component.extend({
  borocd: '',
  column: '',
  data: [],

  sortedData: computed('data', function() {
    return this.get('data').then(data=> {
      return data.sortBy(`${this.get('column')}`).reverse();
    });
  }),

  rankingIndex: computed('borocd', 'sortedData', function() {
    const borocd = this.get('borocd');

    return this.get('sortedData').then(sorted=> {
      return sorted.findIndex(el=>el.borocd === borocd);
    });
  }),
});
