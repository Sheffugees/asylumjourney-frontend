export default () => {
  return function (items, stage) {
    const filtered = [];
    angular.forEach(items, item => {
      angular.forEach(item._embedded.stages, itemStage => {
        if (itemStage.id === stage) {
          filtered.push(item);
        }
      });
    });

    return filtered;
  };
};
