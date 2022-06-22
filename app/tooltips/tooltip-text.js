export const tooltipText = {
  acs: {
    communityDistrict(cd_short_title) {
      return `American Community Survey 2014-2018 5-Year Estimates for ${cd_short_title}, approximated by aggregating data from blocks and block-groups.`;
    },
    acsFloodplain(cd_short_title) {
      return `American Community Survey (ACS) 2014-2018 5-Year Estimates for floodplain area within ${cd_short_title}, approximated by aggregating data from blocks and block-groups.`;
    },
  },
  census: {
    censusFloodplain(cd_short_title) {
      return `2010 Census population counts for floodplain area within ${cd_short_title}.`;
    },
  },
};
