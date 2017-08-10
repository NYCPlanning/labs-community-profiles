const cartoUser = 'cpp';
const cartoDomain = 'cartoprod.capitalplanning.nyc';

const buildTemplate = (layergroupid, type) => { // eslint-disable-line
  return `https://${cartoDomain}/user/${cartoUser}/api/v1/map/${layergroupid}/{z}/{x}/{y}.${type}`;
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

  getTileTemplate(SQL, CartoCSS = '#layer { polygon-fill: #FFF; }') {
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
        .then((json) => { resolve(buildTemplate(json.layergroupid, 'mvt')); });
    });
  },
};

export default carto;
