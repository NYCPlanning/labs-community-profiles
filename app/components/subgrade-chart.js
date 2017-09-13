import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import githubraw from '../utils/githubraw';

const LandUseChart = Ember.Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',
  datasetName: 'subgrade_space',

  data: Ember.computed('sql', 'borocd', function() {
    const borocd = this.get('borocd');
    const datasetName = this.get('datasetName');
    
    return githubraw(datasetName, borocd);
  }),
});

export default LandUseChart;
