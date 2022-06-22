import { computed } from '@ember/object'; // eslint-disable-line
import DS from 'ember-data'; // eslint-disable-line
import bbox from '@turf/bbox' // eslint-disable-line
import centroid from '@turf/centroid'; // eslint-disable-line
import numeral from 'numeral';
import neighborhoodsCrosswalk from '../utils/nabesCrosswalk';

const acronymCrosswalk = {
  Bronx: 'BX',
  Brooklyn: 'BK',
  Manhattan: 'MN',
  Queens: 'QN',
  'Staten Island': 'SI',
};

export default DS.Model.extend({
  borocd: DS.attr('number'),
  boro: DS.attr('string'),
  borocdAcronym: computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')];
    const cd = numeral(this.get('cd')).format('00');
    return `${acronym}${cd}`;
  }),
  zapAcronym: computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')];
    const cd = numeral(this.get('cd')).format('00');
    return `${acronym}${cd}`;
  }),
  borocdAcronymLowerCase: computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')].toLowerCase();
    const cd = numeral(this.get('cd')).format('00');
    return `${acronym}${cd}`;
  }),
  boroAcronym: computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')];
    return `${acronym}`;
  }),
  boroAcronymLowerCase: computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')].toLowerCase();
    return `${acronym}`;
  }),
  healthProfileLink: computed('boro', function() {
    const boroAcronymLowerCase = this.get('boroAcronymLowerCase');
    let cd = this.get('cd');
    if (boroAcronymLowerCase === 'si' || boroAcronymLowerCase === 'qn') {
      cd = numeral(cd).format('00');
    }
    return `https://www1.nyc.gov/assets/doh/downloads/pdf/data/2015chp-${boroAcronymLowerCase}${cd}.pdf`;
  }),
  cd: DS.attr('string'),
  geometry: DS.attr(),
  bounds: computed('geometry', function() {
    const geometry = this.get('geometry');
    return bbox(geometry);
  }),
  centroid: computed('geometry', function() {
    const geometry = this.get('geometry');
    return centroid(geometry).geometry.coordinates;
  }),
  neighborhoods: computed('borocd', function() {
    const borocd = this.get('borocd');
    return neighborhoodsCrosswalk[borocd].join(', ');
  }),
  dataprofile: {},
  name: computed('boro', 'cd', 'neighborhoods', function() {
    const { boro, cd, neighborhoods } = this.getProperties('boro', 'cd', 'neighborhoods');

    return `${boro} ${cd} - ${neighborhoods}`;
  }),
});
