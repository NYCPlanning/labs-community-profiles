
import { moduleForComponent, test } from 'ember-qunit';
import { buildTooltip } from '../../../helpers/acs-puma-cd-tooltip';

moduleForComponent('acs-puma-cd-tooltip', 'helper:acs-puma-cd-tooltip', {
  integration: true,
});

// Replace this with your real tests.
test('returns tooltip correctly', function(assert) {
  const data = [{
    puma: 444,
    cd_short_title: 'Manhattan CD 2',
    shared_puma: true,
    shared_puma_cd: 'Manhattan CD 3',
  }];

  const tooltip = buildTooltip(data);

  assert.equal(tooltip, 'American Community Survey 2014-2018 5-Year Estimates for PUMA 444, which is an approximation of both Manhattan CD 2 and Manhattan CD 3.');
});
