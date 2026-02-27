const development = 'http:/localhost:3000/api/v1';
//const development = 'https://staging.fikadigital.org/api/v1/';
const production = 'https://app.fikadigital.org/api/v1';

const BASE_URL = __DEV__ ? development : production;

console.log('Using API base URL:', BASE_URL);

export { BASE_URL };
