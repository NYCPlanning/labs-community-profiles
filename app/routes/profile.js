import Ember from 'ember'; // eslint-disable-line
import { L } from 'ember-leaflet'; // eslint-disable-line
import { task } from 'ember-concurrency';
import ScrollToTop from '../mixins/scroll-to-top';
import githubraw from '../utils/githubraw';

import carto from '../utils/carto';

function buildBorocd(boro, cd) {
  let borocode;
  switch (boro) {
    case 'manhattan':
      borocode = 100;
      break;
    case 'bronx':
      borocode = 200;
      break;
    case 'brooklyn':
      borocode = 300;
      break;
    case 'queens':
      borocode = 400;
      break;
    case 'staten-island':
      borocode = 500;
      break;
    default:
  }
  return borocode + parseInt(cd, 10);
}

export default Ember.Route.extend(ScrollToTop, {
  queryParams: {
    section: {
      refresh: true,
    },
  },

  mapState: Ember.inject.service(),
  model(params) {
    const { boro, cd } = params;
    const borocd = buildBorocd(boro, cd);
    const sql = `SELECT * FROM community_district_profiles WHERE borocd=${borocd}`;

    const selectedDistrict =
      this.modelFor('application').findBy('borocd', borocd);

    return carto.SQL(sql, 'json')
      .then((json) => {
        selectedDistrict.set('dataprofile', json[0]);
        return selectedDistrict;
      });
  },
  afterModel(district) {
    const mapState = this.get('mapState');

    mapState.setProperties({
      bounds: district.get('bounds'),
      centroid: district.get('centroid'),
    });
  },
  setupController(controller, district) {
    this._super(...arguments);

    const borocd = district.get('borocd');
    const zoningData = this.get('zoningData').perform(borocd, controller);
    controller.setProperties({
      zoningData,
    });
  },

  zoningData: task(function * (borocd, controller) {
    return githubraw('zoning', borocd)
  }).restartable(),

  actions: {
    error() {
      this.transitionTo('/not-found');
    },
    didTransition() {
      console.log('transition');
    },
  },
});
