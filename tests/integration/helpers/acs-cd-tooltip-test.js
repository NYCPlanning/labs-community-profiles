
import { moduleForComponent, test } from 'ember-qunit';
import { buildTooltip } from '../../../helpers/acs-cd-tooltip';

moduleForComponent('acs-cd-tooltip', 'helper:acs-cd-tooltip', {
  integration: true,
});

// Replace this with your real tests.
test('returns tooltip correctly', function(assert) {
  const data = [{
    cd_short_title: 'Manhattan CD 2',
  }];

  const tooltip = buildTooltip(data);

  assert.equal(tooltip, 'American Community Survey 2014-2018 5-Year Estimates for Manhattan CD 2, approximated by aggregating data from blocks and block-groups.');
});
