export default function toGeojson(districts) {
  return {
    type: 'FeatureCollection',
    features: districts.map((district) => {
      const borocd = district.get('borocd');

      return {
        geometry: district.get('geometry'),
        properties: district,
      };
    }),
  };
}
