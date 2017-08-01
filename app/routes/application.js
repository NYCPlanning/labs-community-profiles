import Ember from 'ember';

const SQL = 'SELECT a.borocd AS borocd, b.boroname AS boroname, a.the_geom FROM ny_community_districts a INNER JOIN ny_boroughs b ON ST_Intersects(ST_Centroid(a.the_geom), b.the_geom)';
const ENDPOINT = `https://cartoprod.capitalplanning.nyc/user/cpp/api/v2/sql?q=${SQL}&format=geojson`;

export default Ember.Route.extend({
  model() {
    return fetch(ENDPOINT)
      .then(response => response.json());
  },
  actions: {
    transitionToProfile(boro) {
      this.transitionTo('profile', boro.boro, boro.borocd);
    }
  }
});
