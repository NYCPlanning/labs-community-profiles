import Ember from 'ember';
import Scroller from 'ember-scroll-to/services/scroller';

export default Scroller.extend({
  scrollable: Ember.computed(function() {
    return Ember.$('#page-content');
  })
});