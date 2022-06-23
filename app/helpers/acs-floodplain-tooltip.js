import { helper } from '@ember/component/helper';
import tooltipText from '../tooltips/tooltip-text';

export function buildTooltip(data) {
  const {
    puma,
    cd_short_title,
  } = data[0];

  const acsFloodplain = tooltipText.acs.acsFloodplain(puma);
  const cdApproximation = tooltipText.acs.cdApproximation(cd_short_title);

  return acsFloodplain.concat(cdApproximation);
}

export default helper(buildTooltip);
