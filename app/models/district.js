import Ember from 'ember'; // eslint-disable-line
import DS from 'ember-data'; // eslint-disable-line
import neighborhoodsCrosswalk from '../utils/nabesCrosswalk';
import bbox from 'npm:@turf/bbox' // eslint-disable-line
import centroid from 'npm:@turf/centroid'; // eslint-disable-line

export default DS.Model.extend({
  borocd: DS.attr('number'),
  boro: DS.attr('string'),
  cd: DS.attr('string'),
  geometry: DS.attr(),
  bounds: Ember.computed('geometry', function() {
    const geometry = this.get('geometry');
    return bbox(geometry);
  }),
  centroid: Ember.computed('geometry', function() {
    const geometry = this.get('geometry');
    return centroid(geometry).geometry.coordinates;
  }),
  neighborhoods: Ember.computed('borocd', function() {
    const borocd = this.get('borocd');
    return neighborhoodsCrosswalk[borocd].join(', ');
  }),
  dataprofile: {},
  name: Ember.computed('boro', 'cd', 'neighborhoods', function() {
    const { boro, cd, neighborhoods } =
      this.getProperties('boro', 'cd', 'neighborhoods');

    return `${boro} ${cd} - ${neighborhoods}`;
  }),
});
