import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  'tooltip-text': '',
  mouse: null,
  style: computed('mouse', function() {
    const mouse = this.get('mouse');
    return htmlSafe(`top: ${mouse.y}px; 
                                  left: ${mouse.x - 20}px;`);
  }),
});
