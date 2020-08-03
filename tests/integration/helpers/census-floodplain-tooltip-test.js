
import { moduleForComponent, test } from 'ember-qunit';
import { buildTooltip } from '../../../helpers/census-floodplain-tooltip';

moduleForComponent('census-floodplain-tooltip', 'helper:census-floodplain-tooltip', {
  integration: true,
});

// Replace this with your real tests.
test('returns tooltip correctly', function(assert) {
  const data = [{
    cd_short_title: 'Manhattan CD 2',
  }];

  const tooltip = buildTooltip(data);

  assert.equal(tooltip, '2010 Census population counts for floodplain area within Manhattan CD 2.');
});
