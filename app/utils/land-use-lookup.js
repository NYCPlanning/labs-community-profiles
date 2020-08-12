const LandUseLookup = (code) => {
  switch (code) {
    case 1:
      return {
        color: '#f4f455',
        description: '1 & 2 Family',
        community_profiles_percent_field: 'pct_lot_area_res_1_2_family_bldg',
      };
    case 2:
      return {
        color: '#f7d496',
        description: 'Multifamily Walk-up',
        community_profiles_percent_field: 'pct_lot_area_res_multifamily_walkup',
      };
    case 3:
      return {
        color: '#FF9900',
        description: 'Multifamily Elevator',
        community_profiles_percent_field: 'pct_lot_area_res_multifamily_elevator',
      };
    case 4:
      return {
        color: '#f7cabf',
        description: 'Mixed Res. & Commercial',
        community_profiles_percent_field: 'pct_lot_area_mixed_use',
      };
    case 5:
      return {
        color: '#ea6661',
        description: 'Commercial & Office',
        community_profiles_percent_field: 'pct_lot_area_commercial_office',
      };
    case 6:
      return {
        color: '#d36ff4',
        description: 'Industrial & Manufacturing',
        community_profiles_percent_field: 'pct_lot_area_industrial_manufacturing',
      };
    case 7:
      return {
        color: '#dac0e8',
        description: 'Transportation & Utility',
        community_profiles_percent_field: 'pct_lot_area_transportation_utility',
      };
    case 8:
      return {
        color: '#5CA2D1',
        description: 'Public Facilities & Institutions',
        community_profiles_percent_field: 'pct_lot_area_public_facility_institution',
      };
    case 9:
      return {
        color: '#8ece7c',
        description: 'Open Space & Outdoor Recreation',
        community_profiles_percent_field: 'pct_lot_area_open_space',
      };
    case 10:
      return {
        color: '#bab8b6',
        description: 'Parking Facilities',
        community_profiles_percent_field: 'pct_lot_area_parking',
      };
    case 11:
      return {
        color: '#5f5f60',
        description: 'Vacant Land',
        community_profiles_percent_field: 'pct_lot_area_vacant',
      };
    case 12:
      return {
        color: '#5f5f60',
        description: 'Other',
        community_profiles_percent_field: 'pct_lot_area_other_no_data',
      };
    default:
      return {
        color: '#5f5f60',
        description: 'Other',
        community_profiles_percent_field: 'pct_lot_area_other_no_data',
      };
  }
};

export default LandUseLookup;
