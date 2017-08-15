import Ember from 'ember';

export default Ember.Mixin.create({
  metrics: Ember.inject.service(),
  actions: {
    didTransition() {
      this._super(...arguments);
      this._trackPage();
    },
  },
  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('routeName', 'unknown');

      Ember.get(this, 'metrics').trackPage({ page, title });
    });
  },
});
