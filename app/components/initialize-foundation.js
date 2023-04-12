import Component from '@ember/component';

export default Component.extend({
  didRender() {
    $(this.element).foundation(); // eslint-disable-line ember-best-practices/no-global-jquery
  },
});
