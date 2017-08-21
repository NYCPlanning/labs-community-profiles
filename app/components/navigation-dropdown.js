import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const DEBOUNCE_MS = 250;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  searchTerms: '',
  placeholder: 'Search',
  options: Ember.computed('model', 'addresses', function() {
    const districts = this.get('model');
    const addressesPromise = this.get('addresses');
    const stream = Ember.A();
    return addressesPromise.then(addresses => {
      const districtAddresses =
        addresses.filter(addy => addy.get('locality') === 'New York');

      stream
        .pushObjects(districts.toArray())
        .pushObjects(districtAddresses.toArray());

      return stream;
    });
  }),
  addresses: Ember.computed('searchTerms', function() {
    const terms = this.get('searchTerms') || {};

    return this.get('store').query('address', terms)
      .then(addresses => {
        return addresses;
      });
  }),
  debounceTerms: task(function* (terms) {
    if (Ember.isBlank(terms)) { return []; }

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

