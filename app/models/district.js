import DS from 'ember-data';

export default DS.Model.extend({
  borocd: DS.attr('string'),
  the_geom: DS.attr('string'),
});
