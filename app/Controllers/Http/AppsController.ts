// import fetch from 'node-fetch';
import { ApiCall, ApiCallSetPaid } from '../../Services/ApiCall';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import axios from "axios";
export default class AppsController {
    public async departure({ request }: HttpContextContract) {
      const params = request.qs();
      return ApiCall({ action: 'departure', params });
    }

    public async destination({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({  action: 'destination', params });
    }

    public async schedule({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({  action: 'schedule', params }); 
    }

    public async seat({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({  action: 'seat', params }); 
    }

    public async booking({ request }: HttpContextContract) {
      const params = request.body();
      return await ApiCall({ action: 'booking', params });
    }

    public async priceTotal({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'priceTotal', params });
    }

    public async voucherCheck({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'voucherCheck', params }); 
    }

    public async userCheck({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'userCheck', params });
    }

    public async bookingDetail({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'bookingDetail', params });
    }

    public async cancelBooking({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'cancelBooking', params });
    }

    public async checkPaymentStatus({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'checkPaymentStatus', params });
    }

    public async updateBooking({ request }: HttpContextContract) {
      const params = request.body();
      return await ApiCall({ action: 'updateBooking', params });
    }

    public async detailBoarding({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'detailBoarding', params });
    }

    public async boarding({ request }: HttpContextContract) {
      const params = request.body();
      return await ApiCall({ action: 'boarding', params });
    }

    public async changePayment({ request }: HttpContextContract) {
      const params = request.body();
      return await ApiCall({ action: 'changePayment', params });
    }

    public async listPayment({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'listPayment', params });
    }

    public async setPaid({ request }: HttpContextContract) {
      const params = request.body();
      return await ApiCallSetPaid({ params });
    }

    public async printInfo({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'printInfo', params });
    }

    public async tnc({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'tnc', params });
    }

    public async resendEticket({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'resendEticket', params });
    }

    public async memberDetail({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'memberDetail', params });
    }

    public async memberType({ request }: HttpContextContract) {
      const params = request.qs();
      return await ApiCall({ action: 'memberType', params })
    }

    public async memberRegister({ request }: HttpContextContract) {
      const params = request.body();
      return await ApiCall({ action: 'memberRegister', params })
    }

    public buildCheck() {
      return { version: 'v.2.99' };      
    }

    public async testApi({ request }) {
      const token = request.qs().token;
      const response = await axios.get('https://jackal.asmat.app/api/v2/whitelabel/cabang.php', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
}
