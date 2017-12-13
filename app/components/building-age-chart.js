import { computed } from '@ember/object'; // eslint-disable-line
import Component from '@ember/component';
import fetch from 'fetch'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import githubraw from '../utils/githubraw';


const BuildingAgeChart = Component.extend(ResizeAware, {
  classNames: ['relative'],
  borocd: '',
  data: computed('sql', 'borocd', function() {
    const borocd = this.get('borocd');
    return githubraw('building_age', borocd);
  }),
});

export default BuildingAgeChart;
