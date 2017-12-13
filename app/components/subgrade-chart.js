import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import githubraw from '../utils/githubraw';

const LandUseChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',
  datasetName: 'subgrade_space',

  data: computed('sql', 'borocd', function() {
    const borocd = this.get('borocd');
    const datasetName = this.get('datasetName');
    
    return githubraw(datasetName, borocd);
  }),
});

export default LandUseChart;
