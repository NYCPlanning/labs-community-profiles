const BuildingTypeLookup = (code) => {
  switch (code) {
    case 1:
      return {
        color: '#FCF6B5',
        description: 'Bungalow',
      };
    case 2:
      return {
        color: '#FCF6B5',
        description: 'Detached Homes',
      };
    case 3:
      return {
        color: '#FCF6B5',
        description: 'Semi Detached Homes',
      };
    case 4:
      return {
        color: '#FEEA89',
        description: 'Attached',
      };
    case 5:
      return {
        color: '#f8ce5e',
        description: 'Campus Complex',
      };
    case 6:
      return {
        color: '#FFC50D',
        description: 'Multi Family Buildings',
      };
    case 7:
      return {
        color: '#F79868',
        description: 'Mixed Use Buildings',
      };
    case 8:
      return {
        color: '#E83433',
        description: 'Commercial Only',
      };
    case 9:
      return {
        color: '#A8CFE8',
        description: 'Community Facility',
      };
    case 10:
      return {
        color: '#C4A0D8',
        description: 'Manufacturing',
      };
    default:
      return {
        color: '#E1E1E1',
        description: 'Other',
      };
  }
};

export default BuildingTypeLookup;
