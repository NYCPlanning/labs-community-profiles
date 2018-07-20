import ScrollTo from 'ember-scroll-to/components/scroll-to';

export default ScrollTo.extend({
  // ----- Events -----
  scroll: Em.on('click', function(evt) { // eslint-disable-line
    evt.stopPropagation();
    evt.preventDefault();

    this
      .get('scroller')
      .scrollVertical(this.get('jQueryElement'), {
        duration: this.get('duration'),
        offset: this.get('offset'),
        easing: this.get('easing'),
        complete: () => Em.run(this, this.sendAction, 'afterScroll', this.get('href'), evt), // eslint-disable-line
      });
  }),
});
