import Ember from 'ember';
import { L } from 'ember-leaflet';

const HOST = 'https://cartoprod.capitalplanning.nyc/user/cpp/api/v2/sql';
const JOINSQL = 'SELECT RIGHT(borocd::text, 2)::int as cd, a.borocd AS borocd, b.boroname AS boroname, ST_AsGeoJSON(a.the_geom) AS the_geom \
                  FROM ny_community_districts a \
                  INNER JOIN ny_boroughs b ON ST_Intersects(ST_Centroid(a.the_geom), b.the_geom)';

export default Ember.Route.extend({
  mapState: Ember.inject.service(),
  model(params) {
    let ENDPOINT = `${HOST}?q=${JOINSQL} WHERE borocd=${params.name}`;
    return fetch(ENDPOINT)
      .then(response => response.json())
      .then(json => {
        return json.rows[0];
      });
  },
  afterModel(profile) {
    let mapState = this.get('mapState');
    mapState.set('bounds', L.geoJson(JSON.parse(profile.the_geom)).getBounds());
  }
});
