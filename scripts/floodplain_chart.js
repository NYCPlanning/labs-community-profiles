module.exports = {
  name: 'floodplain_chart',
  sql: borocd => (`
    SELECT
        landuse_desc,
        ROUND(SUM(lotarea)::numeric / cdarea, 4) as total,
        ROUND(SUM(floodplain_2015_lotarea)::numeric / cdarea, 4) as fp2015,
        ROUND(SUM(floodplain_2015_lotarea)::numeric / cdarea, 4) as fp2050
      FROM (
        SELECT a.the_geom, a.lotarea, c.description as landuse_desc, c.code as landuse,
          CASE EXISTS(
            SELECT 1 FROM support_waterfront_pfirm15 f WHERE ST_Intersects(a.the_geom, f.the_geom) AND (fld_zone = 'AE' OR fld_zone = 'VE')
         ) WHEN TRUE THEN a.lotarea ELSE 0 END as floodplain_2015_lotarea,
          CASE EXISTS(
            SELECT 1 FROM cdprofiles_floodplain_2050 g WHERE ST_Intersects(a.the_geom, g.the_geom)
         ) WHEN TRUE THEN a.lotarea ELSE 0 END as floodplain_2050_lotarea,
        SUM (lotarea) OVER () as cdarea
        FROM support_mappluto a
        INNER JOIN support_landuse_lookup c
              ON a.landuse::integer = c.code
        INNER JOIN support_admin_cdboundaries b
        ON ST_Contains(b.the_geom, a.the_geom)
        AND b.borocd = '${borocd}'
        ) lots
    GROUP BY landuse_desc, cdarea
  `),
};
