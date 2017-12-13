import { alias } from '@ember/object/computed'; // eslint-disable-line
import EmberObject, { computed } from '@ember/object';
import DS from 'ember-data'; // eslint-disable-line
import toGeojson from '../utils/to-geojson'; // eslint-disable-line
import isIntersecting from 'npm:@turf/inside'; // eslint-disable-line
import District from '../models/district';

export default DS.Model.extend({
  district: computed('geometry', function() {
    const districts = this.store.peekAll('district');
    const point = this.get('geometry');

    return districts
      .find(dist =>
        isIntersecting(point, dist.get('geometry')),
      ) || EmberObject.create();
  }),
  borocd: computed('district', function() {
    const district = this.get('district');

    return district.get('borocd');
  }),
  boro: computed('district', function() {
    const district = this.get('district');

    return district.get('boro');
  }),
  cd: computed('district', function() {
    const district = this.get('district');

    return district.get('cd');
  }),
  name: alias('label'),
  neighborhoods: alias('label'),
  label: DS.attr('string'),
  region: DS.attr('string'),
  geometry: DS.attr(),
  locality: DS.attr('string'),
});
