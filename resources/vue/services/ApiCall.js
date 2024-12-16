import axios from 'axios';
import endpoint from "../config/endpointCollections";
import { useStore } from "../store/Store";

const requestToken = () => {
  return new Promise((resolve, reject) => {
    const clientId = document.querySelector('[name=clientId]').content;
    const clientSecret = document.querySelector('[name=clientSecret]').content;
    
    axios({
      method: 'post',
      url: 'api/token',
      data: {
        client_id: clientId,
        client_secret: clientSecret
      }
    })
    .then((response) => {
      localStorage.setItem('access_token', response.data.token);
      const store = useStore();
      store.token = response.data.token;
      resolve(response.data.token);
      console.log(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

const ApiCall = async ({ action, token = null,  params = {}, auth = null }) => {
  // function getCurrentURLParams() {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const params = {};
  
  //   for (const [key, value] of urlParams.entries()) {
  //     params[key] = value;
  //   }
  
  //   return params;
  // };
  // const departurePool = getCurrentURLParams();
  // params.asal_kode = departurePool.asal_kode
  const departureCode = localStorage.getItem('departureCode');
  params.asal_kode = departureCode;
  return new Promise ((resolve, reject) => {
    axios({
      method: endpoint[action].method,
      url: endpoint[action].url,
      auth,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: params,
      data: params,
      timeout: 60000
    })
    .then((response) => {
      resolve(response.data);
    })
    .catch( async (error) => {
      if (error.response?.status === 401) {
        console.log('401', error);
        const newToken = await requestToken();
        resolve(await ApiCall({ action, token: newToken, params }));
      } else { 
        console.log('another', error);
        reject({status: "ERR", msg: error.message})
      }
    });
  })
  
}

export default ApiCall;