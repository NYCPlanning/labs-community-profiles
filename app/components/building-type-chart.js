import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import githubraw from '../utils/githubraw';

function getColor(group) {
  const colorMap = {
    '1-2 Family': '#f4f455',
    'Small Apartment Buildings': '#f7d496',
    'Commercial Buildings': '#ea6661',
    'Big Apartment Buildings': '#FF9900',
    'Mixed-use Apartment Buildings': '#f7cabf',
    'Manufacturing Buildings': '#d36ff4',
    'Public facilities, utilities and other buildings': '#5CA2D1',
  };

  return colorMap[group];
}

const BuildingTypeChart = Ember.Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['relative'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,
  property: '', // one of 'numbldgs' or 'unitsres' passed in to component
  borocd: '',
  data: Ember.computed('property', 'borocd', function() {
    const borocd = this.get('borocd');
    const property = this.get('property');
    const filler = property === 'numbldgs' ? 'buildings' : 'units';
    const id = `building_type_${filler}`;
    return githubraw(id, borocd)
      .then((data) => {
        console.log('DATA', data)
        return data.map((d) => {
          const colorAdded = d;
          colorAdded.color = getColor(d.group);
          return d;
        });
      });
  }),
});

export default BuildingTypeChart;
