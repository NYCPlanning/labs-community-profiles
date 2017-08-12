import Ember from 'ember';
import DS from 'ember-data';
import neighborhoodsCrosswalk from '../utils/nabesCrosswalk';

export default DS.Model.extend({
  borocd: DS.attr('number'),
  boro: DS.attr('string'),
  cd: DS.attr('string'),
  geometry: DS.attr(),
  bounds: Ember.computed('geometry', function() {
    return [];
  }),
  neighborhoods: Ember.computed('borocd', function() {
    const borocd = this.get('borocd');
    return neighborhoodsCrosswalk[borocd];
  }),
  dataprofile: {},
});
