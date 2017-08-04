import Ember from 'ember'; // eslint-disable-line
import neighborhoodsCrosswalk from '../utils/nabesCrosswalk';
import carto from '../utils/carto';

const SQL = `
  SELECT ST_Simplify(the_geom, 0.0001) AS the_geom, borocd %25 100 as cd,
    CASE
      WHEN LEFT(borocd::text, 1) = '1' THEN 'Manhattan'
      WHEN LEFT(borocd::text, 1) = '2' THEN 'Bronx'
      WHEN LEFT(borocd::text, 1) = '3' THEN 'Brooklyn'
      WHEN LEFT(borocd::text, 1) = '4' THEN 'Queens'
      WHEN LEFT(borocd::text, 1) = '5' THEN 'Staten Island'
    END as boro,
    borocd
  FROM support_admin_cdboundaries
  WHERE borocd %25 100 < 20 
  ORDER BY boro, cd ASC
`;

export default Ember.Route.extend({
  model() {
    return carto.SQL(SQL, 'geojson')
      .then(geojson => ({
        type: geojson.type,
        features: geojson.features.map((feature) => {
          const borocd = feature.properties.borocd;
          const thisFeature = feature;
          thisFeature.properties.neighborhoods = neighborhoodsCrosswalk[borocd];
          return thisFeature;
        }),
      }));
  },

  actions: {
    transitionToProfile(boro) {
      this.transitionTo('profile', boro.boro.dasherize(), boro.borocd % 100);
    },
  },
});
