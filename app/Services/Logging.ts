import Env from '@ioc:Adonis/Core/Env';
import { supabase } from "./Supabase";
import { clientCredentials } from 'Config/project';

const logging = async ({ action, params, response, status, identifier, departureCode }) => {
  if (Env.get('NODE_ENV') != 'production') return;
  await supabase
    .from('logs')
    .insert({
      kiosk_id: clientCredentials?.[identifier as string]?.[departureCode]?.outlet_id,
      outlet_kiosk: clientCredentials?.[identifier as string]?.[departureCode]?.name,
      params,
      response,
      action,
      status
    });
}

export default logging;