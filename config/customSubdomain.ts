import Env from '@ioc:Adonis/Core/Env';
const mode = Env.get('NODE_ENV');
const customSubdomain = {
  'jackal': mode === 'production' ? 'https://stg.' : 'https://dev.',
  'jackalx': mode === 'production' ? 'https://stg.' : 'https://dev.'
};

export default customSubdomain;