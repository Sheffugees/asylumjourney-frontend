export default () => {
  return string => string ? decodeHtmlEntity(stripHTML(string)) : '';
};

const stripHTML = string => {
  return String(string).replace(/(<([^>]+)>)/ig, '')
}

const decodeHtmlEntity = string => {
  return string.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
};
