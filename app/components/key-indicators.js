import Ember from 'ember';
import carto from '../utils/carto';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  shouldRender: false,
  borocd: '',
  indicators: ['borocd'],
  coalescedIndicators: Ember.A([]),
  sql: Ember.computed('indicators.[]', function() {
    const indicators = this.get('indicators').join(',');

    return `SELECT ${indicators}, 
      CASE
        WHEN LEFT(borocd::text, 1) = '1' THEN 'Manhattan ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '2' THEN 'Bronx ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '3' THEN 'Brooklyn ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '4' THEN 'Queens ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '5' THEN 'Staten Island ' || borocd %25 100
      END as boro_district,
      borocd
      FROM community_district_profiles`;
  }),

  comparisonData: Ember.computed('sql', function() {
    const sql = this.get('sql');
    return carto.SQL(sql, 'json')
      .then((json) => {
        return json;
      });
  }),
});
