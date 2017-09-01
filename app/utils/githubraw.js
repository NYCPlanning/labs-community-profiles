import fetch from 'fetch'; // eslint-disable-line

export default function githubraw(id, borocd) {
  const URL = `https://raw.githubusercontent.com/NYCPlanning/labs-community-data/master/data/${id}/${borocd}.json`;

  return fetch(URL)
    .then(data => data.json());
}
