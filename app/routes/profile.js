import Ember from 'ember';

const HOST = 'https://cartoprod.capitalplanning.nyc/user/cpp/api/v2/sql';
const JOINSQL = ' SELECT a.borocd AS borocd, b.boroname AS boroname, a.the_geom \
                  FROM ny_community_districts a \
                  INNER JOIN ny_boroughs b ON ST_Intersects(ST_Centroid(a.the_geom), b.the_geom)';

export default Ember.Route.extend({
  model(params) {
    let ENDPOINT = `${HOST}?q=${JOINSQL} WHERE a.borocd=${params.name}`;
    return fetch(ENDPOINT)
      .then(response => response.json())
      .then(json => {
        return json.rows[0];
      });
  }
});
