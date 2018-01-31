import { isBlank } from '@ember/utils';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { Promise } from 'rsvp';
import { task, timeout } from 'ember-concurrency';

const DEBOUNCE_MS = 250;

export default Component.extend({
  store: service(),
  searchTerms: '',
  placeholder: 'Search',
  options: computed('model', 'addresses', function() {
    const districts = this.get('model');
    const addressesPromise = this.get('addresses');
    const stream = A();
    return addressesPromise.then(addresses => {
      stream
        .pushObjects(districts.toArray())
        .pushObjects(addresses.toArray());

      return stream;
    });
  }),
  addresses: computed('searchTerms', function() {
    const terms = this.get('searchTerms') || {};

    return this.get('store').query('address', terms)
      .then(addresses => {
        return addresses;
      });
  }),
  debounceTerms: task(function* (terms) {
    if (isBlank(terms)) { return []; }

    yield timeout(DEBOUNCE_MS);
    yield this.set('searchTerms', terms);
  }).restartable(),
  actions: {
    handleSearch(terms, dropdownState) {
      if (dropdownState.resultsCount <= 1) {
        this.get('debounceTerms').perform(terms);
      }
    },
  },
});

