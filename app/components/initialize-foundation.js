import Component from '@ember/component';

export default Component.extend({
  didRender() {
    $(this.element).foundation();
  },
});
