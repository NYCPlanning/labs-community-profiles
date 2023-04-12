import { isBlank } from '@ember/utils';
import { A } from '@ember/array';
import { computed, get, action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { defaultMatcher } from 'ember-power-select/utils/group-utils';

const DEBOUNCE_MS = 200;

export default class extends Component{
  @service() store;
  searchTerms= '';
  placeholder= 'Search';

  @computed('model', 'addresses', 'searchTerms')
  get options() {
    const districts = this.get('model');
    const addressesPromise = this.get('addresses');
    const stream = A();
    return addressesPromise.then((addresses) => {
      stream
        .pushObjects(districts.toArray())
        .pushObjects(addresses.toArray());

      return stream;
    });
  }

  @computed('searchTerms')
  get addresses () {
    const terms = this.get('searchTerms') || {};

    return this.get('store').query('address', terms);
  }

  @(task(
    function* (terms) {
    if (isBlank(terms)) { return []; }

    yield timeout(DEBOUNCE_MS);
    yield this.set('searchTerms', terms);

    return null;
  }).restartable())
  debounceTerms;

  matcher(value, searchTerm) {
    if (get(value, 'constructor.modelName') === 'address') {
      return true;
    }

    return defaultMatcher(get(value, 'name'), searchTerm);
  }

  @action
  handleSearch(terms) {
      this.get('debounceTerms').perform(terms);
  }
};
