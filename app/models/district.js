import DS from 'ember-data';

export default DS.Model.extend({
  borocd: DS.attr('string'),
  geometry: DS.attr(),
});
