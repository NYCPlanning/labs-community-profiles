import Ember from 'ember'; // eslint-disable-line
import fetch from 'fetch'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import githubraw from '../utils/githubraw';


const BuildingAgeChart = Ember.Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',
  data: Ember.computed('sql', 'borocd', function() {
    const borocd = this.get('borocd');
    return githubraw('building_age', borocd);
  }),
});

export default BuildingAgeChart;
