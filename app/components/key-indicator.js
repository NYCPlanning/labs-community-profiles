import Ember from 'ember';
import d3 from 'd3';

const { computed } = Ember;

export default Ember.Component.extend({
  borocd: '',
  column: '',
  data: [],
  unit: '',

  sortedData: computed('data', 'borocd', function() {
    const borocd = this.get('borocd');
    return this.get('data').then(data=> {
      return data.sortBy(`${this.get('column')}`).reverse().map(d => {
        d.is_selected = (borocd === d.borocd) ? true : false;
        return d;
      });
    });
  })
});
