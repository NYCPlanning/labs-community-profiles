import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import githubraw from '../utils/githubraw';

function getColor(group) {
  const colorMap = {
    '1–2 Family Homes': '#f4f455',
    'Small Apartments (<= 5 units, < 5 stories)': '#f7d496',
    'Large Apartments (> 5 units, 5-plus stories)': '#ea6661',
    'Mixed-use Apartments': '#FF9900',
    'Commercial': '#f7cabf',
    'Manufacturing': '#d36ff4',
    'Public Facilities, Institutions, Other': '#5CA2D1',
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
