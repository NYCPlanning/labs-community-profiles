const cartoUser = 'cpp';
const cartoDomain = 'cartoprod.capitalplanning.nyc';

const buildTemplate = (layergroupid) => { // eslint-disable-line
  return `https://${cartoDomain}/user/${cartoUser}/api/v1/map/${layergroupid}/{z}/{x}/{y}.png`;
};

const carto = {
  SQL(query, type = 'json') {
    const cleanedQuery = query.replace('\n', '');
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'GET',
        url: `https://${cartoDomain}/user/${cartoUser}/api/v2/sql?q=${cleanedQuery}&format=${type}`,
        success(d) {
          resolve(type === 'json' ? d.rows : d);
        },
      })
        .fail(() => reject());
    });
  },

  getTileTemplate() {
    const SQL = `
      SELECT a.the_geom_webmercator, b.code as landuse, b.description as landuse_desc
      FROM support_mappluto a
      LEFT JOIN support_landuse_lookup b
      ON a.landuse::integer = b.code
    `;

    const CartoCSS = `
      #pluto15v1 {
       polygon-opacity: 0.8;
       line-width: .5;
       line-opacity: 1;
       polygon-fill: #000;
      }

      #pluto15v1[landuse=1] {
       polygon-fill: #f4f455;
       line-color: #f4f455;
      }
      #pluto15v1[landuse=2] {
       polygon-fill: #f7d496;
       line-color: #f7d496;
      }
      #pluto15v1[landuse=3] {
       polygon-fill: #FF9900;
       line-color: #FF9900;
      }
      #pluto15v1[landuse=4] {
       polygon-fill: #f7cabf;
      line-color: #f7cabf;
      }
      #pluto15v1[landuse=5] {
       polygon-fill: #ea6661;
      line-color: #ea6661;
      }
      #pluto15v1[landuse=6] {
       polygon-fill: #d36ff4;
      line-color: #d36ff4;
      }
      #pluto15v1[landuse=7] {
       polygon-fill: #dac0e8;
      line-color: #dac0e8;
      }
      #pluto15v1[landuse=8] {
       polygon-fill: #5CA2D1;
      line-color: #5CA2D1;
      }
      #pluto15v1[landuse=9] {
       polygon-fill: #8ece7c;
      line-color: #8ece7c;
      }
      #pluto15v1[landuse=10] {
       polygon-fill: #bab8b6;
      line-color: #bab8b6;
      }

      #pluto15v1[landuse=11] {
       polygon-fill: #5f5f60;
      line-color: #5f5f60;
      }
    `;

    const params = {
      version: '1.3.0',
      layers: [{
        type: 'mapnik',
        options: {
          cartocss_version: '2.1.1',
          cartocss: CartoCSS,
          sql: SQL,
        },
      }],
    };

    return new Promise((resolve, reject) => {
      fetch(`https://${cartoDomain}/user/${cartoUser}/api/v1/map`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
        .catch(err => reject(err))
        .then(response => response.json())
        .then((json) => { resolve(buildTemplate(json.layergroupid)); });
    });
  },
};

export default carto;
