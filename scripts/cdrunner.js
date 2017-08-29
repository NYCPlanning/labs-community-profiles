const fs = require('fs');
const fetch = require('node-fetch'); // eslint-disable-line
const model = require('./floodplain_chart');
const borocds = require('./borocds');

let i = 0;

const modelname = model.name;
const outputPath = `../public/data/${modelname}`;

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

const cartoUser = 'cpp';
const cartoDomain = 'cartoprod.capitalplanning.nyc';

const buildSqlUrl = (cleanedQuery, type = 'json') => { // eslint-disable-line
  return `https://${cartoDomain}/user/${cartoUser}/api/v2/sql?q=${cleanedQuery}&format=${type}`;
};

function getCDData(borocd) {
  const sql = model.sql(borocd);
  const cleanedQuery = sql.replace('\n', '');
  const url = buildSqlUrl(cleanedQuery);

  console.log(`fetching data for borocd ${borocd}...`);  // eslint-disable-line
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      console.log(`Error: Could not get data for ${borocd}`) // eslint-disable-line
      return {};
    })
    .then(function(json) {
      console.log(`Received! Writing JSON to ${outputPath}/${borocd}.json`);  // eslint-disable-line
      const data = json.rows;
      fs.writeFileSync(`${outputPath}/${borocd}.json`, JSON.stringify(data));
      if (i < borocds.length - 1) {
        i += 1;
        getCDData(borocds[i]);
      }
    });
}

getCDData(borocds[i]);
