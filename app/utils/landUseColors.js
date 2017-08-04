const landUseColors = (code) => {
  switch (code) {
    case 1:
      return '#f4f455';
    case 2:
      return '#f7d496';
    case 3:
      return '#FF9900';
    case 4:
      return '#f7cabf';
    case 5:
      return '#ea6661';
    case 6:
      return '#d36ff4';
    case 7:
      return '#dac0e8';
    case 8:
      return '#5CA2D1';
    case 9:
      return '#8ece7c';
    case 10:
      return '#bab8b6';
    case 11:
      return '#5f5f60';
    default:
      return null;
  }
};

export default landUseColors;
