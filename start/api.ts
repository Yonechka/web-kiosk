import Route from '@ioc:Adonis/Core/Route'
import AccessClient from 'App/Models/AccessClient';
import SettlementHistory from 'App/Models/SettlementHistory';
import PingStatus from 'App/Models/PingStatus';
import Hash from '@ioc:Adonis/Core/Hash';
import axios from 'axios';

import _groupBy from 'lodash.groupby';
import { DateTime } from 'luxon';
// import { features } from 'Config/project';
// import {features } from '../resources/vue/config/features.js';
import { remodelFeatures } from '../utils';
import type { RemodelFeatures } from '../utils';
import { featuresDev, featuresProd } from 'Config/features';
import { basicAuth } from '../utils';
import Env from '@ioc:Adonis/Core/Env';

Route.group(() => {
    Route.get('/departure', 'AppsController.departure');
    Route.get('/destination', 'AppsController.destination');
    Route.get('/schedule', 'AppsController.schedule');
    Route.get('/seat', 'AppsController.seat');
    Route.get('/user_check', 'AppsController.userCheck');
    Route.post('/booking', 'AppsController.booking');
    Route.get('/price_total', 'AppsController.priceTotal');
    Route.get('/voucher_check', 'AppsController.voucherCheck');
    Route.get('/booking_detail', 'AppsController.bookingDetail');
    Route.post('/update_booking', 'AppsController.updateBooking');
    Route.get('/cancel_booking', 'AppsController.cancelBooking');
    Route.get('/check_payment_status', 'AppsController.checkPaymentStatus');
    Route.post('/change_payment', 'AppsController.changePayment');
    Route.get('/list_payment', 'AppsController.listPayment');
    Route.post('/boarding', 'AppsController.boarding');
    Route.get('/boarding', 'AppsController.detailBoarding');
    Route.post('/setpaid', 'AppsController.setPaid');
    Route.get('/print_info', 'AppsController.printInfo');
    Route.get('/tnc', 'AppsController.tnc');
    Route.get('/resend-eticket', 'AppsController.resendEticket');

    /* Member */
    Route.get('/member', 'AppsController.memberDetail');
    Route.get('/member-type', 'AppsController.memberType');
    Route.post('/member', 'AppsController.memberRegister');
}).middleware('auth').prefix('/api');


interface RemodeledAllOperator {
  operator: string,
  features: RemodelFeatures[] 
}

Route.get('/api/ads', () => {
  return {
    "status": "OK",
    "results": {
      "list": [
        {
          "id": 31,
          "source": "https://dev.new.tvic.asmat.app/uploads/content/1720408426_WhatsApp Image 2024-07-08 at 10.10.36 AM.jpeg",
          "source_type": "image",
          "duration": "1",
          "typecontent_name": null,
          "operator_name": "Jackal Holidays",
          "created_at": "2024-07-08 03:13:46"
        },
        {
          "id": 30,
          "source": "https://dev.new.tvic.asmat.app/uploads/content/1720408394_WhatsApp Image 2024-07-08 at 10.10.35 AM.jpeg",
          "source_type": "image",
          "duration": "1",
          "typecontent_name": null,
          "operator_name": "Jackal Holidays",
          "created_at": "2024-07-08 03:13:14"
        },
        // {
        //   "id": 31,
        //   "source": "https://dev.new.tvic.asmat.app/uploads/content/1720408426_WhatsApp Image 2024-07-08 at 10.10.36 AM.jpeg",
        //   "source_type": "image",
        //   "duration": "1",
        //   "typecontent_name": null,
        //   "operator_name": "Jackal Holidays",
        //   "created_at": "2024-07-08 03:13:46"
        // },
        // {
        //   "id": 30,
        //   "source": "https://dev.new.tvic.asmat.app/uploads/content/1720408394_WhatsApp Image 2024-07-08 at 10.10.35 AM.jpeg",
        //   "source_type": "image",
        //   "duration": "1",
        //   "typecontent_name": null,
        //   "operator_name": "Jackal Holidays",
        //   "created_at": "2024-07-08 03:13:14"
        // },
      ]
    }
  }
});

Route.get('/daytrans/api/ads', () => {
  const data = [
    { 
      id: 1,
      outlet_code: 'DPU',
      img_url: '/images/ads/adsFullScreenDummy.png',
      start_date: '2024-06-26',
      expired_date: '2024-06-26',
      description: '',
      data: {
        departure_id: '25',
        destination_id: '9',
        departure_date: '2024-06-30',
        id_product: '2671'
      }
    },
    {
      id: 2,
      outlet_code: 'DPU',
      img_url: '/images/ads/adsFullScreenDummy_2.png',
      start_date: '2024-06-26',
      expired_date: '2024-06-26',
      description: '',
      data: {
        departure_id: '25',
        destination_id: '9',
        departure_date: '2024-06-30',
        id_product: null
      }
    }
  ];

  return {
    data,
    status: 'OK'
  }
});

Route.get('/api/features', ({ request, response }) => {
  const query = request.qs();
  // const basicAuth = request.headers()?.authorization;
  
  if (!basicAuth(request.headers())) return response.unauthorized({
    status: 'Error',
    message: 'Unauthenticated',
    data: null
  });
  const features = Env.get('NODE_ENV') === 'production' ? featuresProd : featuresDev;
  // return features;
  if (!query.operator) {
    const remodeled: RemodeledAllOperator[] = [];
    for (const property in features) {
      remodeled.push({
        operator: property,
        features: remodelFeatures(features[property])
      });
    }
    return {
      status: 'OK',
      data: remodeled
    }
  };

  const featuresByOperator = features[query.operator] || null;
  if (!featuresByOperator) {
    return response.notFound({
      status: 'Error',
      message: `Operator ${query.operator} Tidak ditemukan!`,
      data: null
    });
  }

  return {
    status: 'OK',
    data: remodelFeatures(featuresByOperator)
  };
});

Route.get('/test-api', 'AppsController.testApi');
Route.get('/build-check', 'AppsController.buildCheck');
Route.post('/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

/* Settlement */

Route.post('/api/settlement-history', async ({ request, response }) => {
  try {
    const { kiosk_id, message } = request.body();
    const settlementHistory = new SettlementHistory();

    settlementHistory.kiosk_id = kiosk_id;
    settlementHistory.message = message;
    settlementHistory.createdAt = DateTime.now()
    settlementHistory.updatedAt = DateTime.now()

    await settlementHistory.save();

    return { status: 'OK' }
  } catch (error) {
    console.log(error)
    return response.status(500).send({ status: 'error', error })
  }
});

Route.get('/api/settlement-history', async ({ response }) => {
  try {
    const settlementHistory = await SettlementHistory.all();
    
    return {
      status: 'OK',
      data: settlementHistory
    }
  } catch (error) {
    console.log(error)
    return response.status(500).send({ status: 'error', error })
  }
});

/* Token Request */
Route.post('jackal/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

Route.post('daytrans/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

Route.post('baraya/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

Route.post('btm/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

Route.post('aragon/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

Route.post('connex/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

Route.post('kruzz/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

Route.post('raputri/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  
  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

Route.post('preview/api/token', async ({ auth, request, response }) => {
  const data = request.body();

  const accessClient: any = await AccessClient
    .query()
    .where('client_id', data.client_id)
    .firstOrFail();
  
  if (!(await Hash.verify(accessClient.client_secret, data.client_secret))) {
    return response.unauthorized('Invalid Credentials');
  }

  const token = await auth.use('api').generate(accessClient ,{
    name: 'token_access',
  });

  return token;
});

/* Ping Status */
Route.put('/api/ping-status', async ({ request }) => {
  try {
    const { client_id, outlet } = request.body();
    const dataOutlet = await PingStatus
      .updateOrCreate({ client_id, outlet }, { updated_at: DateTime.now() });

    const lastActive =  dataOutlet.created_at.toRelative();

    return { success: true, data: dataOutlet, lastActive };
  } catch (error) {
    throw new Error(error);
  }
});

Route.get('/api/ping-status', async ({ request }) => {
  // const { client_id, outlet } = request.qs();
  try {
    const dataOutlet = await PingStatus.all();
    const dataOutletRemodel = dataOutlet.map((outlet) => {
      return { ...outlet.$attributes, last_active: outlet.updated_at.toRelative() };
    });
    const dataOutletGrouped = _groupBy(dataOutletRemodel, 'client_id')

    return dataOutlet ? { data: dataOutletRemodel, dataOutletGrouped } : 'empty';
  } catch (error) {
    throw new Error(error)
  }
  
});

/* Test Print */
Route.get('/api/print-test', async ({ request }) => {
  try {
    const { token, url } = request.qs();
    const result = (
      await axios.get(url,
        {
          params: { ...request.qs() },
          headers: { 'Authorization': `bearer ${token}`}
        }
      )
    )?.data ?? null;
    return result;
  } catch (error) {
    console.log('error print', error?.response?.data)
    throw new Error(error?.response.data?.message ?? 'Fetch API error!' );
  }
});

/* Dummy api print */
Route.get('/api/print-data-dummy', async ({ request, response }) => {
  const { authorization } = request.headers();
  const token = 'bearer someRandomString';
  if (authorization !== token) response.unauthorized({
    status: 'Error',
    message: 'Unauthenticated',
    data: null
  })
  const data = [
    {
      "type": "text",
      "value": "CONNEX",
      "style": {
          "fontWeight": "700",
          "textAlign": "center",
          "fontSize": "16px",
          "marginLeft": "-7px",
          "fontFamily": "Poppins"
      }
    },
    {
        "type": "text",
        "value": "CALL CENTER & WHATSAPP",
        "style": {
            "fontSize": "8px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "08170 888 666",
        "style": {
            "fontWeight": "700",
            "textAlign": "center",
            "fontSize": "16px",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "www.connex.co.id",
        "style": {
            "fontSize": "8px",
            "textAlign": "center",
            "paddingBottom": "6px",
            "borderBottom": "2px dashed black",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "TCNX2409051SN5",
        "style": {
            "fontSize": "16px",
            "textAlign": "center",
            "paddingTop": "6px",
            "fontWeight": "700",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "qrCode",
        "value": "TCNX2409051SN5",
        "height": 120,
        "width": 120,
        "position": "center",
        "style": {
            "margin": "10 20px 20 20px",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "PENUMPANG",
        "style": {
            "fontSize": "8px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "Ari Said Maulana",
        "style": {
            "fontSize": "12px",
            "paddingRight": "3px",
            "fontWeight": "600",
            "textAlign": "center",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "TANGGAL: ",
        "style": {
            "fontSize": "8px",
            "marginTop": "8px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "Kamis, 5 Sep 2024",
        "style": {
            "fontSize": "12px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "MCAF-PND-18:00",
        "style": {
            "fontSize": "8px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "PICK UP:",
        "style": {
            "fontSize": "10px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "CIREBON",
        "style": {
            "fontSize": "12px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "MARKAS CAFE",
        "style": {
            "fontSize": "8px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "18:00",
        "style": {
            "fontSize": "12px",
            "textAlign": "center",
            "marginBottom": "8px",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "KURSI",
        "style": {
            "fontSize": "10px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "4",
        "style": {
            "fontSize": "35px",
            "textAlign": "center",
            "fontWeight": "700",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "DROP OFF:",
        "style": {
            "fontSize": "10px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "SEMARANG",
        "style": {
            "fontSize": "12px",
            "textAlign": "center",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "PANDANARAN",
        "style": {
            "fontSize": "8px",
            "textAlign": "center",
            "marginBottom": "4px",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "160.000",
        "style": {
            "fontSize": "16px",
            "textAlign": "center",
            "marginBottom": "8px",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "2024-09-05 09:54:00",
        "style": {
            "fontSize": "8px",
            "textAlign": "center",
            "paddingBottom": "6px",
            "marginBottom": "6px",
            "borderBottom": "2px dashed black",
            "fontWeight": "600",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    },
    {
        "type": "text",
        "value": "Terima Kasih Telah Menggunakan CONNEX!",
        "style": {
            "fontSize": "8px",
            "textAlign": "center",
            "fontWeight": "600",
            "paddingBottom": "80px",
            "marginLeft": "-7px",
            "fontFamily": "Poppins"
        }
    }
  ];
  return {
    tiketux: { result: data } 
  }
});