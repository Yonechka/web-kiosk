import Env from '@ioc:Adonis/Core/Env';
const mode = Env.get('NODE_ENV');
const customDomain = {
  'kruzz': mode === 'production' ? Env.get('API_DOMAIN_NAME') : Env.get('API_DOMAIN_NAME_TIKETUX'),
  'raputri': mode === 'production' ? Env.get('API_DOMAIN_NAME') : Env.get('API_DOMAIN_NAME_TIKETUX'),
  'jackal': mode === 'production' ? Env.get('API_DOMAIN_NAME') : Env.get('')
};

export default customDomain;