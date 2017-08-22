import Ember from 'ember';
import d3 from 'd3';
import { ChildMixin } from 'ember-composability-tools';

const { computed } = Ember;

export default Ember.Component.extend({
  borocd: '',
  column: '',
  data: [],
  unit: '',
  outliers: [],

  sortedData: computed('data', 'borocd', function() {
    const borocd = this.get('borocd');
    return this.get('data').then(data => {
      return data.sortBy(`${this.get('column')}`).reverse().map(d => {
        d.is_selected = (borocd === d.borocd) ? true : false;
        return d;
      })
      .filter(d => {
        return !(this.get('outliers').includes(d.borocd));
      });
    });
  }),
});
