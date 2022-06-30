import DS from 'ember-data';

const mapzenSearchAPI = 'https://geosearch.planninglabs.nyc/v2/autocomplete?focus.point.lat=40.7259&focus.point.lon=-73.9805&limit=5&text=';

export default DS.JSONAPIAdapter.extend({
  keyForAttribute(key) {
    return key;
  },
  buildURL(modelName, id, snapshot, requestType, query) {
    const url = `${mapzenSearchAPI}${query}`;
    return url;
  },
});
