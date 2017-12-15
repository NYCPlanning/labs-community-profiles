import computed from 'ember-computed-decorators';
import Component from '@ember/component'; // eslint-disable-line
import ResizeAware from 'ember-resize/mixins/resize-aware'; // eslint-disable-line
import carto from '../utils/carto';
import landUseLookup from '../utils/land-use-lookup';


const BuildingTypeChart = Component.extend(ResizeAware, {
  classNameBindings: ['loading'],
  classNames: ['relative'],

  resizeWidthSensitive: true,
  resizeHeightSensitive: true,
  loading: false,
  property: '', // one of 'numbldgs' or 'unitsres' passed in to component
  borocd: '',

  @computed('borocd', 'property')
  sql(borocd, property) {
    return `
      SELECT
        x.landuse as group,
        SUM(${property}) as value,
        ROUND(SUM(${property})::numeric / NULLIF(propertytotal,0), 4) AS value_pct
      FROM (
        WITH floodplain AS (
            SELECT * FROM support_waterfront_pfirm15 WHERE fld_zone = 'AE' OR fld_zone = 'VE'
        )

        SELECT
          landuse::integer,
          ${property},
          SUM (${property}) OVER () as propertytotal
        FROM support_mappluto a, floodplain b
        WHERE cd = ${borocd} AND ST_Within(a.the_geom, b.the_geom)
      ) x
      GROUP BY landuse, propertytotal
      ORDER BY SUM(${property}) DESC
    `;
  },

  @computed('sql', 'borocd')
  data() {
    const sql = this.get('sql');
    return carto.SQL(sql)
      .then((data) => { // eslint-disable-line
        return data.map(d => ({
          group: landUseLookup(d.group).description,
          color: landUseLookup(d.group).color,
          value: d.value,
          value_pct: d.value_pct,
        }));
      });
  },
});

export default BuildingTypeChart;
