export default () => {
  return function (text) {
    return text ? String(text).replace(/(<([^>]+)>)/ig, '') : '';
  };
};
