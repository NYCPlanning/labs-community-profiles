import Ember from 'ember'; // eslint-disable-line
import DS from 'ember-data'; // eslint-disable-line
import toGeojson from '../utils/to-geojson'; // eslint-disable-line
import isIntersecting from 'npm:@turf/inside'; // eslint-disable-line

export default DS.Model.extend({
  district: Ember.computed('geometry', function() {
    const districts = this.store.peekAll('district');
    const point = this.get('geometry');

    return districts
      .find(dist =>
        isIntersecting(point, dist.get('geometry')),
      ) || Ember.Object.create();
  }),
  borocd: Ember.computed('district', function() {
    const district = this.get('district');

    return district.get('borocd');
  }),
  boro: Ember.computed('district', function() {
    const district = this.get('district');

    return district.get('boro');
  }),
  cd: Ember.computed('district', function() {
    const district = this.get('district');

    return district.get('cd');
  }),
  name: Ember.computed.alias('label'),
  neighborhoods: Ember.computed.alias('label'),
  label: DS.attr('string'),
  region: DS.attr('string'),
  geometry: DS.attr(),
  locality: DS.attr('string'),
});
