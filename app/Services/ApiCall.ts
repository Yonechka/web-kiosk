import axios from "axios";
import HttpContext from '@ioc:Adonis/Core/HttpContext';
import Config from '@ioc:Adonis/Core/Config';
import { endpoint, clientCredentials } from 'Config/project';
import { remodel } from '../../utils';
import customDomain from "Config/customDomain";
import customSubdomain from "Config/customSubdomain";
import customIdentifier from "Config/customIdentifier";
import logging from "./Logging";
import { sendAlert } from "./Telegram";


/* Request New Token */
const refreshToken = async (endpoint, departurePool, urlIdentifier) => {
  console.log({ endpoint })
  const credential = clientCredentials[urlIdentifier][departurePool];
  let subdomain = endpoint.protocolSubdomain;
  if (customSubdomain[urlIdentifier]) subdomain = customSubdomain[urlIdentifier];
  
  let baseURL;
  if (customDomain[urlIdentifier as string]) {
    baseURL = `${subdomain}${urlIdentifier}${customDomain[urlIdentifier as string]}${endpoint.trailing}`
  } else {
    baseURL = `${subdomain}${urlIdentifier}${endpoint.domainName}${endpoint.trailing}`
  }

  const response = await axios({
    method: 'post',
    baseURL,
    url: endpoint.collections.requestToken.url,
    data: {
      grant_type: 'client_credentials',
      client_id: credential.client_id,
      client_secret: credential.client_secret
    }
  });
  console.log('new token', response.data)
  return response.data;
}

/* Fetching API */
interface ApiCallParams {
  action: string,
  params?: any,
}
interface ApiCallSetpaidParams {
  params?: any,
}

const ApiCall = async ({ action, params = null }: ApiCallParams, loop = 0) => {
  const ctx = HttpContext.get(); /* Get HttpContext */
  if (loop >= 3)  throw new Error('Loop Detected! commonly happen because authentication')

  /* Get version endpoint by authorized credential */
  const ASMAT_NEW = 'asmatNew'; // hardcoded asmat version because now all operator use new asmat
  const version: any = ASMAT_NEW;
  let urlIdentifier: any = await ctx?.auth?.user?.url_identifier;

  if (customIdentifier[urlIdentifier]) urlIdentifier = customIdentifier[urlIdentifier];
  try {
    /* Get Config object by version */
    const endpoint = Config.get(`project.endpoint.${version}`);
    let subdomain = endpoint.protocolSubdomain;
    if (customSubdomain[urlIdentifier]) subdomain = customSubdomain[urlIdentifier];
    /* Re-model the params */
    let remodeledParams = null;
    if (params !== null) remodeledParams = remodel[version].params[action](params);

    /* Fetching */
    let baseURL;
    if (customDomain[urlIdentifier as string]) {
      baseURL = `${subdomain}${urlIdentifier}${customDomain[urlIdentifier as string]}${endpoint.trailing}`
    } else {
      baseURL = `${subdomain}${urlIdentifier}${endpoint.domainName}${endpoint.trailing}`
    }
    
    const response = await axios({
      method: endpoint.collections[action].method,
      timeout: 60000,
      baseURL,
      url: endpoint.collections[action].url,
      data: remodeledParams,
      params: remodeledParams,
      headers: {
        'Authorization': `Bearer ${ctx?.session.get('API_TOKEN')}`,
        'Content-Type': 'application/json'
      },
    });

    logging({
      action,
      params,
      response: response?.data,
      identifier: urlIdentifier,
      departureCode: params?.asal_kode,
      status: 'success'
    });
    

    /* Re-model the response then return it */
    const remodeledResponse = remodel[version]?.response[action](response.data);
    const remodeledResponseStatus = remodel[version]?.response.status(response.data);
    return {
      status: remodeledResponseStatus,
      data: remodeledResponse
    };  

  } catch (error) {

    logging({
      action,
      params,
      response: error?.response?.data ? { ...error?.response?.data } : { error: error?.message },
      identifier: urlIdentifier,
      departureCode: params?.asal_kode,
      status: 'error'
    });

    sendAlert('error', {
      action,
      params,
      response: error?.response?.data ? { ...error?.response?.data } : { error: error?.message },
      identifier: urlIdentifier,
      departureCode: params?.asal_kode,
      status: 'error'
    });

    if (error.response?.status === 401) { /* Execute refreshToken then put new token to session */
      const newToken = await refreshToken(endpoint[version], params.asal_kode, urlIdentifier);
      const newTokenRemodel = remodel[version]?.response.token(newToken);
      ctx?.session.put('API_TOKEN', newTokenRemodel);
      return await ApiCall({ action, params }, loop + 1);
    }
    
    return error;
  }
}

const ApiCallSetPaid = async ({  params = null }: ApiCallSetpaidParams, loop = 0) => {
  console.log('params setPaid', params);
  if (loop >= 3)  throw new Error('Loop Detected! commonly happen because authentication');

  const ctx = HttpContext.get(); /* Get HttpContext */

  /* Get version endpoint by authorized credential */
  const ASMAT_NEW = 'asmatNew'; // hardcoded asmat version because now all operator use new asmat
  const version: any = ASMAT_NEW;
  const urlIdentifier = await ctx?.auth?.user?.url_identifier;
  const baseURL = Config.get(`project.endpoint.${version}.paymentApi`);
  try {

    /* Fetching */
    const response = await axios({
      method: 'post',
      baseURL,
      url: '/callback/bcaedc',
      data: params,
      headers: {
        'Authorization': `Bearer ${ctx?.session.get('API_TOKEN')}`,
        'Content-Type': 'application/json'
      },
    });
    return { ...response.data, baseURL };  
  } catch (error) {
    console.log('setpaid response error', error);
    logging({
      action: 'setPaid',
      params,
      response: error?.response?.data ? { ...error?.response?.data } : { error: error?.message },
      identifier: urlIdentifier,
      departureCode: params?.asal_kode,
      status: 'error'
    });

    sendAlert('setPaid', {
      action: 'setPaid',
      params,
      response: error?.response?.data ? { ...error?.response?.data } : { error: error?.message },
      identifier: urlIdentifier,
      departureCode: params?.asal_kode,
      status: 'error'
    });
    if (error.response?.status === 401) { /* Execute refreshToken then put new token to session */
      const newToken = await refreshToken(endpoint[version], params.asal_kode, urlIdentifier);
      const newTokenRemodel = remodel[version]?.response.token(newToken);
      ctx?.session.put('API_TOKEN', newTokenRemodel);
      return await ApiCallSetPaid({ params }, loop + 1)
    }
    return error;
  }
}

export { ApiCall, ApiCallSetPaid };