/**
 * Constants.
 */

/**
 * Set apiUrl based on window location so always uses correct api.
 */
const getApiUrl = () => {
  const stagingUrl = 'https://asylum-journey-staging.herokuapp.com/';
  const productionUrl = 'https://asylum-journey-dev.herokuapp.com/';
  return window.location && window.location.hostname === 'asylumjourney.org.uk' ? productionUrl : stagingUrl; // eslint-disable-line
}

export const apiUrl = getApiUrl();
export const stagingUrl = 'aj-staging.firebaseapp.com';