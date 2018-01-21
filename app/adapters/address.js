import DS from 'ember-data';

<<<<<<< HEAD
const mapzenSearchAPI = 'https://search.mapzen.com/v1/autocomplete?focus.point.lat=40.7259&focus.point.lon=-73.9805&limit=5&api_key=mapzen-YuCycbW&text=';
=======
const mapzenSearchAPI = 'https://search.mapzen.com/v1/autocomplete?focus.point.lat=40.7259&focus.point.lon=-73.9805&limit=5&api_key=mapzen-y89dXNc&text=';
>>>>>>> 6320bb8698c9fdb266a734ab34f4df383e79ae97

export default DS.JSONAPIAdapter.extend({
  keyForAttribute(key) {
    return key;
  },
  buildURL(modelName, id, snapshot, requestType, query) {
    const url = `${mapzenSearchAPI}${query}, New York, NY`;
    return url;
  },
});
