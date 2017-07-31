import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return $.getJSON(`https://cartoprod.capitalplanning.nyc/user/cpp/api/v2/sql?q=select%20cartodb_id,%20borocd%20%20from%20ny_community_districts WHERE borocd=${params.name}`);
  }
});
