import fetch from 'fetch';

const cartoUser = 'cpp';
const cartoDomain = 'cartoprod.capitalplanning.nyc';

const buildTemplate = (layergroupid, type) => { // eslint-disable-line
  return `https://${cartoDomain}/user/${cartoUser}/api/v1/map/${layergroupid}/{z}/{x}/{y}.${type}`;
};

const buildSqlUrl = (cleanedQuery, type = 'json') => {
  return `https://${cartoDomain}/user/${cartoUser}/api/v2/sql?q=${cleanedQuery}&format=${type}`
}

const carto = {
  SQL(query, type = 'json') {
    const cleanedQuery = query.replace('\n', '');
    const url = buildSqlUrl(cleanedQuery, type);

    return fetch(url)
      .then((response) => {
        if(response.ok) {
          return response.json();
        }
        throw new Error('Not found');
      })
      .then((d) => {
        return type === 'json' ? d.rows : d;
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

export { buildSqlUrl };
export default carto;
