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

function generateZoningSQL(borocd) {
  const SQL = `
    WITH zones as (
      SELECT ST_Intersection(ST_MakeValid(a.the_geom), ST_MakeValid(b.the_geom)) as the_geom, zonedist
      FROM support_zoning_zd a, support_admin_cdboundaries b
      WHERE ST_intersects(ST_MakeValid(a.the_geom), ST_MakeValid(b.the_geom))
      AND b.borocd = '${borocd}'
    ),
    totalsm AS (
      SELECT sum(ST_Area(the_geom::geography)) as total
      FROM zones
    )

  SELECT sum(percent) as percent, zonedist FROM (
      SELECT  ROUND((sum(ST_Area(the_geom::geography))/totalsm.total)::numeric,4) as percent, LEFT(zonedist, 1) as zonedist
    FROM zones, totalsm
    GROUP BY zonedist, totalsm.total
    ORDER BY percent DESC
  ) x
  GROUP BY zonedist
`;

  return SQL;
}

export default Ember.Route.extend(ScrollToTop, {

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
  },
});
