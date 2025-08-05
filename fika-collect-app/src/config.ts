const development = 'https://fika-collect-api-env-develop-fikadigital.vercel.app';
const production = 'https://app.fikadigital.org';

const BASE_URL = __DEV__ ? development : production;
export { BASE_URL };