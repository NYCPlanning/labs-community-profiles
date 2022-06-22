
import { moduleForComponent, test } from 'ember-qunit';
import { buildTooltip } from '../../../helpers/acs-floodplain-tooltip';

moduleForComponent('acs-floodplain-tooltip', 'helper:acs-floodplain-tooltip', {
  integration: true,
});

test('returns tooltip correctly', function(assert) {
  const data = [{
    puma: 444,
    cd_short_title: 'Manhattan CD 2',
  }];

  const tooltip = buildTooltip(data);

  assert.equal(tooltip, 'American Community Survey (ACS) 2013-2017 5-year estimates for floodplain area within PUMA 444, which is an approximation of Manhattan CD 2.');
});
