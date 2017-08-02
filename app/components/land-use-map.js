import Ember from 'ember';

export default Ember.Component.extend({
  geomStyle: {
    fill: false,
    color: '#000',
    weight: 2,
    dashArray: "8 5",
    opacity: 0.6,
  },
  mapState: Ember.inject.service(),
});
