import Component from '@ember/component';

export default Component.extend({
  // @argument
  warning: true,

  // @argument
  open: true,

  // @argument
  dismissible: true,

  actions: {
    handleSiteMessageToggle() {
      this.set('open', !this.get('open'));
    }
  },
})
