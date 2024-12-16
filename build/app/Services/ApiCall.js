"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCallSetPaid = exports.ApiCall = void 0;
const axios_1 = __importDefault(require("axios"));
const HttpContext_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HttpContext"));
const Config_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Config"));
const project_1 = global[Symbol.for('ioc.use')]("Config/project");
const utils_1 = require("../../utils");
const customDomain_1 = __importDefault(global[Symbol.for('ioc.use')]("Config/customDomain"));
const customSubdomain_1 = __importDefault(global[Symbol.for('ioc.use')]("Config/customSubdomain"));
const customIdentifier_1 = __importDefault(global[Symbol.for('ioc.use')]("Config/customIdentifier"));
const Logging_1 = __importDefault(require("./Logging"));
const Telegram_1 = require("./Telegram");
const refreshToken = async (endpoint, departurePool, urlIdentifier) => {
    console.log({ endpoint });
    const credential = project_1.clientCredentials[urlIdentifier][departurePool];
    let subdomain = endpoint.protocolSubdomain;
    if (customSubdomain_1.default[urlIdentifier])
        subdomain = customSubdomain_1.default[urlIdentifier];
    let baseURL;
    if (customDomain_1.default[urlIdentifier]) {
        baseURL = `${subdomain}${urlIdentifier}${customDomain_1.default[urlIdentifier]}${endpoint.trailing}`;
    }
    else {
        baseURL = `${subdomain}${urlIdentifier}${endpoint.domainName}${endpoint.trailing}`;
    }
    const response = await (0, axios_1.default)({
        method: 'post',
        baseURL,
        url: endpoint.collections.requestToken.url,
        data: {
            grant_type: 'client_credentials',
            client_id: credential.client_id,
            client_secret: credential.client_secret
        }
    });
    console.log('new token', response.data);
    return response.data;
};
const ApiCall = async ({ action, params = null }, loop = 0) => {
    const ctx = HttpContext_1.default.get();
    if (loop >= 3)
        throw new Error('Loop Detected! commonly happen because authentication');
    const ASMAT_NEW = 'asmatNew';
    const version = ASMAT_NEW;
    let urlIdentifier = await ctx?.auth?.user?.url_identifier;
    if (customIdentifier_1.default[urlIdentifier])
        urlIdentifier = customIdentifier_1.default[urlIdentifier];
    try {
        const endpoint = Config_1.default.get(`project.endpoint.${version}`);
        let subdomain = endpoint.protocolSubdomain;
        if (customSubdomain_1.default[urlIdentifier])
            subdomain = customSubdomain_1.default[urlIdentifier];
        let remodeledParams = null;
        if (params !== null)
            remodeledParams = utils_1.remodel[version].params[action](params);
        let baseURL;
        if (customDomain_1.default[urlIdentifier]) {
            baseURL = `${subdomain}${urlIdentifier}${customDomain_1.default[urlIdentifier]}${endpoint.trailing}`;
        }
        else {
            baseURL = `${subdomain}${urlIdentifier}${endpoint.domainName}${endpoint.trailing}`;
        }
        const response = await (0, axios_1.default)({
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
        (0, Logging_1.default)({
            action,
            params,
            response: response?.data,
            identifier: urlIdentifier,
            departureCode: params?.asal_kode,
            status: 'success'
        });
        const remodeledResponse = utils_1.remodel[version]?.response[action](response.data);
        const remodeledResponseStatus = utils_1.remodel[version]?.response.status(response.data);
        return {
            status: remodeledResponseStatus,
            data: remodeledResponse
        };
    }
    catch (error) {
        (0, Logging_1.default)({
            action,
            params,
            response: error?.response?.data ? { ...error?.response?.data } : { error: error?.message },
            identifier: urlIdentifier,
            departureCode: params?.asal_kode,
            status: 'error'
        });
        (0, Telegram_1.sendAlert)('error', {
            action,
            params,
            response: error?.response?.data ? { ...error?.response?.data } : { error: error?.message },
            identifier: urlIdentifier,
            departureCode: params?.asal_kode,
            status: 'error'
        });
        if (error.response?.status === 401) {
            const newToken = await refreshToken(project_1.endpoint[version], params.asal_kode, urlIdentifier);
            const newTokenRemodel = utils_1.remodel[version]?.response.token(newToken);
            ctx?.session.put('API_TOKEN', newTokenRemodel);
            return await ApiCall({ action, params }, loop + 1);
        }
        return error;
    }
};
exports.ApiCall = ApiCall;
const ApiCallSetPaid = async ({ params = null }, loop = 0) => {
    console.log('params setPaid', params);
    if (loop >= 3)
        throw new Error('Loop Detected! commonly happen because authentication');
    const ctx = HttpContext_1.default.get();
    const ASMAT_NEW = 'asmatNew';
    const version = ASMAT_NEW;
    const urlIdentifier = await ctx?.auth?.user?.url_identifier;
    const baseURL = Config_1.default.get(`project.endpoint.${version}.paymentApi`);
    try {
        const response = await (0, axios_1.default)({
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
    }
    catch (error) {
        console.log('setpaid response error', error);
        (0, Logging_1.default)({
            action: 'setPaid',
            params,
            response: error?.response?.data ? { ...error?.response?.data } : { error: error?.message },
            identifier: urlIdentifier,
            departureCode: params?.asal_kode,
            status: 'error'
        });
        (0, Telegram_1.sendAlert)('setPaid', {
            action: 'setPaid',
            params,
            response: error?.response?.data ? { ...error?.response?.data } : { error: error?.message },
            identifier: urlIdentifier,
            departureCode: params?.asal_kode,
            status: 'error'
        });
        if (error.response?.status === 401) {
            const newToken = await refreshToken(project_1.endpoint[version], params.asal_kode, urlIdentifier);
            const newTokenRemodel = utils_1.remodel[version]?.response.token(newToken);
            ctx?.session.put('API_TOKEN', newTokenRemodel);
            return await ApiCallSetPaid({ params }, loop + 1);
        }
        return error;
    }
};
exports.ApiCallSetPaid = ApiCallSetPaid;
//# sourceMappingURL=ApiCall.js.map