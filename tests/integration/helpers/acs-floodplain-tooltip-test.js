
import { moduleForComponent, test } from 'ember-qunit';
import { buildTooltip } from '../../../helpers/acs-floodplain-tooltip';

moduleForComponent('acs-floodplain-tooltip', 'helper:acs-floodplain-tooltip', {
  integration: true,
});

test('returns tooltip correctly', function(assert) {
  const data = [{
    cd_short_title: 'Manhattan CD 2',
  }];

  const tooltip = buildTooltip(data);

  assert.equal(tooltip, 'American Community Survey (ACS) 2014-2018 5-Year Estimates for floodplain area within Manhattan CD 2, approximated by aggregating data from blocks and block-groups.');
});
