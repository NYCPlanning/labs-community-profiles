import DS from 'ember-data';
import carto, { buildSqlUrl } from '../utils/carto';
import neighborhoodsCrosswalk from '../utils/nabesCrosswalk';

const SQL = `
  SELECT ST_Simplify(the_geom, 0.0001) AS the_geom, borocd %25 100 as cd,
    CASE
      WHEN LEFT(borocd::text, 1) = '1' THEN 'Manhattan'
      WHEN LEFT(borocd::text, 1) = '2' THEN 'Bronx'
      WHEN LEFT(borocd::text, 1) = '3' THEN 'Brooklyn'
      WHEN LEFT(borocd::text, 1) = '4' THEN 'Queens'
      WHEN LEFT(borocd::text, 1) = '5' THEN 'Staten Island'
    END as boro,
    borocd,
    cartodb_id as id
  FROM support_admin_cdboundaries
  WHERE borocd %25 100 < 20 
  ORDER BY boro, cd ASC
`;

export default DS.JSONAPIAdapter.extend({
  keyForAttribute(key) {
    return key;
  },
  buildURL(modelName, id, snapshot, requestType, query) {
    return buildSqlUrl(SQL);
  },
});
