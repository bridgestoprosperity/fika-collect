const development = 'https://staging.fikadigital.org/api/v1';
const production = 'https://app.fikadigital.org/api/v1';

const BASE_URL = __DEV__ ? development : production;
export { BASE_URL };