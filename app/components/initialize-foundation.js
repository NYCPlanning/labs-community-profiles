import Ember from 'ember';

export default Ember.Component.extend({
  didRender: function() {
    $(this.element).foundation();
  },
});
