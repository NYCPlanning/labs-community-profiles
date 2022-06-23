const tooltipText = {
  acs: {
    puma(puma) {
      return `American Community Survey 2014-2018 5-Year Estimates for PUMA ${puma}, `;
    },
    cdApproximation(cd_short_title) {
      return `which is an approximation of ${cd_short_title}.`;
    },
    cdApproximationShared(cd_short_title, shared_puma_cd) {
      return `which is an approximation of both ${cd_short_title} and ${shared_puma_cd}.`;
    },
    acsFloodplain(puma) {
      return `American Community Survey (ACS) 2013-2017 5-year estimates for floodplain area within PUMA ${puma}, `; // which is an approximation of ${cd_short_title}
    },
  },
  census: {
    censusFloodplain(cd_short_title) {
      return `2010 Census population counts for floodplain area within ${cd_short_title}.`;
    },
  },
};

export default tooltipText;
