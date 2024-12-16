"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiCall_1 = require("../../Services/ApiCall");
const axios_1 = __importDefault(require("axios"));
class AppsController {
    async departure({ request }) {
        const params = request.qs();
        return (0, ApiCall_1.ApiCall)({ action: 'departure', params });
    }
    async destination({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'destination', params });
    }
    async schedule({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'schedule', params });
    }
    async seat({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'seat', params });
    }
    async booking({ request }) {
        const params = request.body();
        return await (0, ApiCall_1.ApiCall)({ action: 'booking', params });
    }
    async priceTotal({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'priceTotal', params });
    }
    async voucherCheck({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'voucherCheck', params });
    }
    async userCheck({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'userCheck', params });
    }
    async bookingDetail({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'bookingDetail', params });
    }
    async cancelBooking({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'cancelBooking', params });
    }
    async checkPaymentStatus({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'checkPaymentStatus', params });
    }
    async updateBooking({ request }) {
        const params = request.body();
        return await (0, ApiCall_1.ApiCall)({ action: 'updateBooking', params });
    }
    async detailBoarding({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'detailBoarding', params });
    }
    async boarding({ request }) {
        const params = request.body();
        return await (0, ApiCall_1.ApiCall)({ action: 'boarding', params });
    }
    async changePayment({ request }) {
        const params = request.body();
        return await (0, ApiCall_1.ApiCall)({ action: 'changePayment', params });
    }
    async listPayment({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'listPayment', params });
    }
    async setPaid({ request }) {
        const params = request.body();
        return await (0, ApiCall_1.ApiCallSetPaid)({ params });
    }
    async printInfo({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'printInfo', params });
    }
    async tnc({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'tnc', params });
    }
    async resendEticket({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'resendEticket', params });
    }
    async memberDetail({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'memberDetail', params });
    }
    async memberType({ request }) {
        const params = request.qs();
        return await (0, ApiCall_1.ApiCall)({ action: 'memberType', params });
    }
    async memberRegister({ request }) {
        const params = request.body();
        return await (0, ApiCall_1.ApiCall)({ action: 'memberRegister', params });
    }
    buildCheck() {
        return { version: 'v.2.99' };
    }
    async testApi({ request }) {
        const token = request.qs().token;
        const response = await axios_1.default.get('https://jackal.asmat.app/api/v2/whitelabel/cabang.php', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
}
exports.default = AppsController;
//# sourceMappingURL=AppsController.js.map