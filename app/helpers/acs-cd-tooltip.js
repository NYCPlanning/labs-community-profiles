import { helper } from '@ember/component/helper';
import { tooltipText } from '../tooltips/tooltip-text';

export function buildTooltip(data) {
  const {
    cd_short_title,
  } = data[0];

  const communityDistrictTooltip = tooltipText.acs.communityDistrict(cd_short_title);

  return communityDistrictTooltip;
}

export default helper(buildTooltip);
