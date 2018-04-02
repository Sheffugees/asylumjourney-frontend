export default function serviceDetails() {
  return {
    template: require('./serviceDetails.html'),
    scope: {
      service: '=id'
    },
  };
}
