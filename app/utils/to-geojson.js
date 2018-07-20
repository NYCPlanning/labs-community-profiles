export default function toGeojson(districts) {
  return {
    type: 'FeatureCollection',
    features: districts.map(district => ({
      geometry: district.get('geometry'),
      properties: district,
    })),
  };
}
