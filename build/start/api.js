"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const AccessClient_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AccessClient"));
const SettlementHistory_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SettlementHistory"));
const PingStatus_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PingStatus"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const axios_1 = __importDefault(require("axios"));
const lodash_groupby_1 = __importDefault(require("lodash.groupby"));
const luxon_1 = require("luxon");
const utils_1 = require("../utils");
const features_1 = global[Symbol.for('ioc.use')]("Config/features");
const utils_2 = require("../utils");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
Route_1.default.group(() => {
    Route_1.default.get('/departure', 'AppsController.departure');
    Route_1.default.get('/destination', 'AppsController.destination');
    Route_1.default.get('/schedule', 'AppsController.schedule');
    Route_1.default.get('/seat', 'AppsController.seat');
    Route_1.default.get('/user_check', 'AppsController.userCheck');
    Route_1.default.post('/booking', 'AppsController.booking');
    Route_1.default.get('/price_total', 'AppsController.priceTotal');
    Route_1.default.get('/voucher_check', 'AppsController.voucherCheck');
    Route_1.default.get('/booking_detail', 'AppsController.bookingDetail');
    Route_1.default.post('/update_booking', 'AppsController.updateBooking');
    Route_1.default.get('/cancel_booking', 'AppsController.cancelBooking');
    Route_1.default.get('/check_payment_status', 'AppsController.checkPaymentStatus');
    Route_1.default.post('/change_payment', 'AppsController.changePayment');
    Route_1.default.get('/list_payment', 'AppsController.listPayment');
    Route_1.default.post('/boarding', 'AppsController.boarding');
    Route_1.default.get('/boarding', 'AppsController.detailBoarding');
    Route_1.default.post('/setpaid', 'AppsController.setPaid');
    Route_1.default.get('/print_info', 'AppsController.printInfo');
    Route_1.default.get('/tnc', 'AppsController.tnc');
    Route_1.default.get('/resend-eticket', 'AppsController.resendEticket');
    Route_1.default.get('/member', 'AppsController.memberDetail');
    Route_1.default.get('/member-type', 'AppsController.memberType');
    Route_1.default.post('/member', 'AppsController.memberRegister');
}).middleware('auth').prefix('/api');
Route_1.default.get('/api/ads', () => {
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
            ]
        }
    };
});
Route_1.default.get('/daytrans/api/ads', () => {
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
    };
});
Route_1.default.get('/api/features', ({ request, response }) => {
    const query = request.qs();
    if (!(0, utils_2.basicAuth)(request.headers()))
        return response.unauthorized({
            status: 'Error',
            message: 'Unauthenticated',
            data: null
        });
    const features = Env_1.default.get('NODE_ENV') === 'production' ? features_1.featuresProd : features_1.featuresDev;
    if (!query.operator) {
        const remodeled = [];
        for (const property in features) {
            remodeled.push({
                operator: property,
                features: (0, utils_1.remodelFeatures)(features[property])
            });
        }
        return {
            status: 'OK',
            data: remodeled
        };
    }
    ;
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
        data: (0, utils_1.remodelFeatures)(featuresByOperator)
    };
});
Route_1.default.get('/test-api', 'AppsController.testApi');
Route_1.default.get('/build-check', 'AppsController.buildCheck');
Route_1.default.post('/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('/api/settlement-history', async ({ request, response }) => {
    try {
        const { kiosk_id, message } = request.body();
        const settlementHistory = new SettlementHistory_1.default();
        settlementHistory.kiosk_id = kiosk_id;
        settlementHistory.message = message;
        settlementHistory.createdAt = luxon_1.DateTime.now();
        settlementHistory.updatedAt = luxon_1.DateTime.now();
        await settlementHistory.save();
        return { status: 'OK' };
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ status: 'error', error });
    }
});
Route_1.default.get('/api/settlement-history', async ({ response }) => {
    try {
        const settlementHistory = await SettlementHistory_1.default.all();
        return {
            status: 'OK',
            data: settlementHistory
        };
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ status: 'error', error });
    }
});
Route_1.default.post('jackal/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('daytrans/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('baraya/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('btm/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('aragon/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('connex/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('kruzz/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('raputri/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.post('preview/api/token', async ({ auth, request, response }) => {
    const data = request.body();
    const accessClient = await AccessClient_1.default
        .query()
        .where('client_id', data.client_id)
        .firstOrFail();
    if (!(await Hash_1.default.verify(accessClient.client_secret, data.client_secret))) {
        return response.unauthorized('Invalid Credentials');
    }
    const token = await auth.use('api').generate(accessClient, {
        name: 'token_access',
    });
    return token;
});
Route_1.default.put('/api/ping-status', async ({ request }) => {
    try {
        const { client_id, outlet } = request.body();
        const dataOutlet = await PingStatus_1.default
            .updateOrCreate({ client_id, outlet }, { updated_at: luxon_1.DateTime.now() });
        const lastActive = dataOutlet.created_at.toRelative();
        return { success: true, data: dataOutlet, lastActive };
    }
    catch (error) {
        throw new Error(error);
    }
});
Route_1.default.get('/api/ping-status', async ({ request }) => {
    try {
        const dataOutlet = await PingStatus_1.default.all();
        const dataOutletRemodel = dataOutlet.map((outlet) => {
            return { ...outlet.$attributes, last_active: outlet.updated_at.toRelative() };
        });
        const dataOutletGrouped = (0, lodash_groupby_1.default)(dataOutletRemodel, 'client_id');
        return dataOutlet ? { data: dataOutletRemodel, dataOutletGrouped } : 'empty';
    }
    catch (error) {
        throw new Error(error);
    }
});
Route_1.default.get('/api/print-test', async ({ request }) => {
    try {
        const { token, url } = request.qs();
        const result = (await axios_1.default.get(url, {
            params: { ...request.qs() },
            headers: { 'Authorization': `bearer ${token}` }
        }))?.data ?? null;
        return result;
    }
    catch (error) {
        console.log('error print', error?.response?.data);
        throw new Error(error?.response.data?.message ?? 'Fetch API error!');
    }
});
Route_1.default.get('/api/print-data-dummy', async ({ request, response }) => {
    const { authorization } = request.headers();
    const token = 'bearer someRandomString';
    if (authorization !== token)
        response.unauthorized({
            status: 'Error',
            message: 'Unauthenticated',
            data: null
        });
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
    };
});
//# sourceMappingURL=api.js.map