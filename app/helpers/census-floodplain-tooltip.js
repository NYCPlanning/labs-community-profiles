import { helper } from '@ember/component/helper';
import tooltipText from '../tooltips/tooltip-text';

export function buildTooltip(data) {
  const {
    cd_short_title,
  } = data[0];

  return tooltipText.census.censusFloodplain(cd_short_title);
}

export default helper(buildTooltip);
