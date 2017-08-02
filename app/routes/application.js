import Ember from 'ember';
const SQL = " \
  SELECT ST_Simplify(the_geom, 0.0005) AS the_geom, RIGHT(borocd::text, 2)::int as cd,\
    CASE\
      WHEN LEFT(borocd::text, 1) = '1' THEN 'Manhattan'\
      WHEN LEFT(borocd::text, 1) = '2' THEN 'Bronx'\
      WHEN LEFT(borocd::text, 1) = '3' THEN 'Brooklyn'\
      WHEN LEFT(borocd::text, 1) = '4' THEN 'Queens'\
      WHEN LEFT(borocd::text, 1) = '5' THEN 'Staten Island'\
    END as boro,\
    borocd\
  FROM support_admin_cdboundaries\
  ORDER BY boro, cd ASC\
";
const ENDPOINT = `https://cartoprod.capitalplanning.nyc/user/cpp/api/v2/sql?q=${SQL}&format=geojson`;

export default Ember.Route.extend({ 
  model() {
    return fetch(ENDPOINT)
      .then(response => response.json());
  },

  actions: {
    transitionToProfile(boro) {
      this.get('controller').set('selected', boro);
      this.transitionTo('profile', boro.value.dasherize(), boro.full);
    }
  }
});
