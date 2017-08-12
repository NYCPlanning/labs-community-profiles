import Ember from 'ember';
import DS from 'ember-data';
import neighborhoodsCrosswalk from '../utils/nabesCrosswalk';
import bbox from 'npm:@turf/bbox';

export default DS.Model.extend({
  borocd: DS.attr('number'),
  boro: DS.attr('string'),
  cd: DS.attr('string'),
  geometry: DS.attr(),
  bounds: Ember.computed('geometry', function() {
    const geometry = this.get('geometry');
    return bbox(geometry);
  }),
  neighborhoods: Ember.computed('borocd', function() {
    const borocd = this.get('borocd');
    return neighborhoodsCrosswalk[borocd];
  }),
  dataprofile: {},
});
