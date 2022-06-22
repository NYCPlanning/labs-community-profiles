import { helper } from '@ember/component/helper';
import { tooltipText } from '../tooltips/tooltip-text';

export function buildTooltip(data) {
  const {
    puma,
    cd_short_title,
    shared_puma,
    shared_puma_cd,
  } = data[0];

  const pumaTooltip = tooltipText.acs.puma(puma);
  const cdApproximation = tooltipText.acs.cdApproximation(cd_short_title);
  const cdApproximationShared = tooltipText.acs.cdApproximationShared(cd_short_title, shared_puma_cd);

  const concatenatedCdApproximation = shared_puma ? cdApproximationShared : cdApproximation;
  return pumaTooltip.concat(concatenatedCdApproximation);
}

export default helper(buildTooltip);
