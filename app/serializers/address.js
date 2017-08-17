import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    return this._super(store,
      primaryModelClass,
      payload.features.map((feature, index) => {
        const thisFeature = feature;
        thisFeature.properties.geometry = feature.geometry;
        thisFeature.properties.geometryType = payload.type;
        thisFeature.properties.id = index;
        return thisFeature.properties;
      }),
      id,
      requestType);
  },
});
