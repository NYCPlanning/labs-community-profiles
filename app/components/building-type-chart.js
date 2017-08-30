import Ember from 'ember'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line

import carto from '../utils/carto';

function getColor(group) {
  const colorMap = {
    '1-2 family attached/semi-detached': '#f4f455',
    '1-2 family detached': '#f4f455',
    'Small Apartment Buildings': '#f7d496',
    'Commercial-only buildings': '#ea6661',
    'Other Building Types': '#5f5f60',
    'Big apartment buildings': '#FF9900',
    'Small mixed-use buildings': '#f7cabf',
    'Big mixed-use buildings': '#f7cabf',
    'Manufacturing buildings': '#d36ff4',
  };

  return colorMap[group];
}

const BuildingTypeChart = Ember.Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['relative'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,
  property: '', // one of 'numbldgs' or 'unitsres' passed in to component
  borocd: '',
  sql: Ember.computed('borocd', function sql() {
    const borocd = this.get('borocd');
    const property = this.get('property');
    const SQL = `
      SELECT
      SUM(${property}) as value,
     building_typology as group,
     ROUND(SUM(${property})::numeric / propertytotal, 4) AS value_pct
      FROM (
        SELECT
          ${property},
        CASE
          WHEN (unitsres < 3 AND unitsres > 0) AND (proxcode = '0' OR proxcode = '1') THEN '1-2 family detached'
          WHEN (unitsres < 3 AND unitsres > 0) AND (proxcode = '2' OR proxcode = '3') THEN '1-2 family attached/semi-detached'
          WHEN (unitsres < 6 AND unitsres > 2) AND (numfloors < 5) AND (comarea = 0 AND officearea = 0 AND retailarea = 0 AND factryarea = 0) THEN 'Small Apartment Buildings'
          WHEN (unitsres < 6 AND unitsres > 2) AND (comarea > 0 OR officearea > 0 OR retailarea > 0 OR factryarea > 0) THEN 'Small mixed-use buildings'
          WHEN (unitsres = 0 AND numfloors < 5) AND (comarea > 0 OR officearea > 0 OR retailarea > 0) AND factryarea = 0 THEN 'Commercial-only buildings'
          WHEN (unitsres = 0 AND numfloors < 5) AND factryarea > 0 THEN 'Manufacturing buildings'
          WHEN (unitsres >= 6 AND numfloors > 4) AND (comarea = 0 AND officearea = 0 AND retailarea = 0 AND factryarea = 0) THEN 'Big apartment buildings'
          WHEN (UnitsRes >= 6 AND NumFloors > 4) AND (ComArea > 0 OR OfficeArea > 0 OR RetailArea > 0) AND FactryArea = 0 THEN 'Big mixed-use buildings'
          ELSE 'Other Building Types'
        END AS building_typology,
        SUM (${property}) OVER () as propertytotal
        FROM support_mappluto a
        INNER JOIN support_admin_cdboundaries b
        ON ST_Contains(b.the_geom, a.the_geom)
        AND b.borocd = '${borocd}'
        INNER JOIN support_waterfront_pfirm15 c
        ON ST_Intersects(a.the_geom, c.the_geom)
        AND (fld_zone = 'AE' OR fld_zone = 'VE')
      ) x
      GROUP BY building_typology, propertytotal
      ORDER BY SUM(${property}) DESC
    `;

    return SQL;
  }),

  data: Ember.computed('sql', 'borocd', function() {
    const sql = this.get('sql');
    return carto.SQL(sql)
      .then((data) => {
        return data.map((d) => {
          const colorAdded = d;
          colorAdded.color = getColor(d.group);
          return d;
        });
      });
  }),
});

export default BuildingTypeChart;
