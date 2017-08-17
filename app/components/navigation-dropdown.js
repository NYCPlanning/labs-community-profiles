import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  searchTerms: '',
  options: Ember.computed('model', 'addresses', function() {
    const districts = this.get('model');
    const addressesPromise = this.get('addresses');
    const stream = Ember.A();
    return addressesPromise.then(addresses=> {
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
  actions: {
    handleSearch(terms, dropdownState) {
      if (dropdownState.resultsCount <= 1) {
        this.set('searchTerms', terms);
      }
    },
  },
});
