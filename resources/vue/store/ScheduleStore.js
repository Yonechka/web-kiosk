import { defineStore, storeToRefs } from "pinia";
import { useStore } from "./Store";
import { dataGrouping, addIsSelectedProperty, formattingNumberHuman, formattingDateYMD } from "../utils";

import ApiCall from '../services/ApiCall';
import ApiCallBooking from '../services/ApiCallBooking';
import md5 from 'md5';
import Features from "../config/features";

export const useScheduleStore = defineStore('ScheduleStore', {
  state: () => {
    return {
        departurePools: [],
        destinationPools: [],
        date: new Date(),
        dateReturn: null,
        departureTime: [],
        departureTimeReturn: [],
        customerInfo: {},
        registeredCustomer: null,
        isRoundedTrip: false,
        seats: {
          seats_layout: [],
          isTimePassed: false
        },
        seatsReturn: {
          seats_layout: [],
          isTimePassed: false,
        },
        ads: [],
        appliedVoucher: null,
        voucherData: null,
        bookingInfo: {},
        updateBookingInfo: {
          passengers: []
        },
        otpNewAsmat: null,
        priceTotalNewAsmat: null,
        detailBoarding: null,
        dummyBookingCode: 'BJH230707AV5CW',
        changePaymentInfo: null,
        printInfo: null,
        paymentChannelList: null,
        selectedVirtualAccount: null
    }
  },
  getters: {
    token: () => {
      const store = useStore();
      return store.token;
    },
    departureDate: (state) => {
      return formattingDateYMD(state.date);
    },
    departureDateReturn: (state) => {
      return state.dateReturn ? formattingDateYMD(state.dateReturn) : null;
    },
    groupedDeparturePools        : (state) => dataGrouping(state.departurePools, 'city'),
    groupedDestinationPools      : (state) => dataGrouping(state.destinationPools, 'destination_city'),
    selectedDeparturePool        : (state) => state.departurePools.find(pool => pool.isSelected),
    selectedDestinationPool      : (state) => state.destinationPools.find(pool => pool.isSelected),
    selectedDepartureTime        : (state) => state.departureTime.find(time => time.isSelected),
    selectedDepartureTimeReturn  : (state) => state.departureTimeReturn.find(time => time.isSelected),
    selectedSeats                : (state) => {
      const selected = state.seats.seats_layout.filter(seat => seat.isSelected);
      
      selected.forEach((item, index) => {
        item.passenger_name = `Nama Penumpang ${index+1}`;
        item.isShow = false;
      });
      return selected;
    },
    selectedSeatsReturn      : (state) => {
      const selected = state.seatsReturn.seats_layout.filter(seat => seat.isSelected);

      selected.forEach((item, index) => {
        item.passenger_name = `Nama Penumpang ${index+1}`;
        item.isShow = false;
      });
      return selected;
    },

    discountDeductionNominal(state) {
      if (!(state.appliedVoucher && state.voucherData?.deduction_nominal)) return 0;

      /* Freepass */
      if (parseInt(state.voucherData.total) == 0) {
        return state.selectedDepartureTime?.total_ticket_price; 
      }

      /* Flat price */
      if (parseInt(state.voucherData.isFlatPrice)) {
        return state.selectedDepartureTime?.total_ticket_price - parseInt(state.voucherData.deduction_nominal);
      }

      /* Regular deduction */
      return parseInt(state.voucherData.deduction_nominal);
      
    },
    totalTicketPrice (state) {
      if (state.appliedVoucher && state.voucherData?.deduction_nominal) {
        
        return this.selectedSeats.length * state.selectedDepartureTime?.total_ticket_price - this.discountDeductionNominal;
      }
      return this.selectedSeats.length * state.selectedDepartureTime?.total_ticket_price
    },
    insuranceTotalNewAsmat(state) {
      if (state.priceTotalNewAsmat) {
        return state.priceTotalNewAsmat.insurance_rates
      }
      return null;
    },
    virtualAccountPayment(state) {
      if (!state.paymentChannelList) return null;
      return state.paymentChannelList.filter((item) => item.group == 'Virtual Account')
    },
    totalTicketPriceNewAsmat(state) {
      if (state.priceTotalNewAsmat) {
        return state.priceTotalNewAsmat.total_price
      }
      return null;
    },
    subTotalTicketNewAsmat() {
      if (this.selectedSeats) {
        return this.selectedSeats.length > 0 ? this.selectedSeats.reduce((curr, item) => item.total_price + curr, 0) : null
      }
      return null;
    },
    subTotalTicketNewAsmatReturn() {
      if (this.selectedSeatsReturn) {
        return this.selectedSeatsReturn.length > 0 ? this.selectedSeatsReturn.reduce((curr, item) => item.total_price + curr, 0) : null
      }
      return null;
    },
    updateBookingSeats (state) {
      const passengers_info = [];
      state.updateBookingInfo.passengers.forEach(item => {
        passengers_info.push({
          ticket: item.ticket_no,
          name: item.passenger_name.charAt(0).toUpperCase() + item.passenger_name.slice(1).toLowerCase(),
          seat_no: item.seat_no,
          hashed_qrcode: item.qr_code,
          isShow: false,
          isInfant: false,
          infant: {
            birthDate: null,
            birthDateFormatted: 'Masukkan Tanggal',
            name: 'Masukkan Nama',
            isShowName: false,
            isShowBirthDate: false,
          }
        })
      });
      return passengers_info;
    },
    updateBookingSeatsReturn(state) {
      if (!state.isRoundedTrip) return [];
      const passengers_info = [];
      state.updateBookingInfo.passengers_return.forEach(item => {
        passengers_info.push({
          ticket: item.ticket_no,
          name: item.passenger_name.charAt(0).toUpperCase() + item.passenger_name.slice(1).toLowerCase(),
          seat_no: item.seat_no,
          hashed_qrcode: item.qr_code,
          isShow: false,
          isInfant: false,
          infant: {
            birthDate: null,
            birthDateFormatted: 'Masukkan Tanggal',
            name: 'Masukkan Nama',
            isShowName: false,
            isShowBirthDate: false,
          }
        })
      });
      return passengers_info;
    }
  },
  actions: {
    async getDeparture() {
      try {
        const result =  await ApiCall({ action: 'departure', token: this.token });
        const store = useStore();

        const { departureCode } = storeToRefs(store);
        addIsSelectedProperty(result.data, false);

        const selectedIndex = result.data.findIndex((item) => item.pool_code == departureCode.value);
        result.data[selectedIndex].isSelected = true;
        
        this.departurePools = result.data;
      } catch (error) {
        throw error
      }
    },

    async getDestination(params) {
      try {
        const result = await ApiCall({ action: 'destination', token: this.token, params });
        console.log('this is getDestination result', result);
        addIsSelectedProperty(result.data);
        this.destinationPools = result.data;
      } catch (error) {
        throw error
      }
    },

    async getSchedule(params, returnSchedule = false) {
      returnSchedule ? this.departureTimeReturn = [] : this.departureTime = []; //dynamically
      const result = await ApiCall({ action: 'schedule', token: this.token, params });
      console.log('this is getSchedule result', result);
      addIsSelectedProperty(result.data, false);

      result.data.forEach(item => {
        if (item.promo) {
          item.total_ticket_price = item.ticket_price - item.promo.nominal;
        } else {
          item.total_ticket_price = item.ticket_price;
        }

        if (item.total_ticket_price >= 1000) {
          const formattedTotalTicketPrice = formattingNumberHuman(item.total_ticket_price);
          item.formattedTotalTicketPrice = formattedTotalTicketPrice;

          const formattedTicketPrice = formattingNumberHuman(item.ticket_price);
          item.formattedTicketPrice = formattedTicketPrice;
        } else {
          item.formattedTotalTicketPrice = item.total_ticket_price
          item.formattedTicketPrice = item.ticket_price
        }
      });
      returnSchedule ? this.departureTimeReturn = result.data : this.departureTime = result.data;
      
    },

    async getSeat(params, returnSeat = false) {
      try {
        this.seats.isTimePassed = false;
        const result = await ApiCall({ action: 'seat', token: this.token, params });
        if (
          result.status == 'ERROR' &&
          result.data.message == 'Tanggal dan Jam Berangkat tidak boleh kurang dari tanggal sekarang'
        ) {
          this.seats.isTimePassed = true;
          return
        }
        
        console.log('this is getSeat result', result);
        addIsSelectedProperty(result.data.seats_layout, false);
        returnSeat ? this.seatsReturn = result.data?.returnSeat : this.seats = result.data;  
      } catch (error) {
        console.log('on error get seat', error)
      }
      
    },

    async getListPayment() {
      const result = await ApiCall({ action: 'listPayment', token: this.token });
      if (result?.status == 'OK' && result?.data) {
        this.paymentChannelList = result.data;
      }
      return result;
    },

    async bookingTicket() {
      const passangersName = [];

      const customerName = (this.registeredCustomer?.name && this.registeredCustomer?.name != '') ? this.registeredCustomer?.name : 'Penumpang';
      const customerEmail = (this.registeredCustomer?.email && this.registeredCustomer?.email != '') ? this.registeredCustomer?.email  : 'info@tiketux.com';

      for (let i = 1; i <= this.selectedSeats.length; i++) {
        const defaultName = (this.registeredCustomer?.name && this.registeredCustomer?.name != '') ? this.registeredCustomer?.name : 'Nama Penumpang';
        passangersName.push(defaultName);
      }

      const seatsNo = [];
      this.selectedSeats.forEach(item => {
        seatsNo.push(item.label);
      });

      const clientId = document.querySelector('[name=clientId]').content;
      const params = {
        departure_id          : this.selectedDeparturePool.pool_code,
        destination_id        : this.selectedDestinationPool.destination_id,
        departure_date        : this.departureDate,
        departure_time        : this.selectedDepartureTime.departure_time,
        schedule_code         : this.selectedDepartureTime.code,
        customer_name         : customerName,
        customer_address      : 'Kiosk',
        customer_phone_no     : this.customerInfo.PhoneNo,
        customer_email        : customerEmail,
        passengers_name       : passangersName.toString(),
        seats_no              : seatsNo.toString(),
        sales_channel         : 'WHITELABEL_WEB',
        channel               : 'qrissp',
        payment               : 'qrissp',
        ticket_price          : null,
        is_round_trip         : 0,
        is_insurance          : Features[clientId].isInsurance ? 1 : 0,
        voucher               : this.appliedVoucher,
        return_date           : null,
        return_schedule_code  : null,
        return_ticket_price   : null,
        return_voucher        : null,
        description           : `KIOSK_${clientId ?? ''}`,
      }

      if (this.isRoundedTrip) {
        const passengersNameReturn = [];

        for (let i = 1; i <= this.selectedSeatsReturn.length; i++) {
          const defaultName = this.registeredCustomer?.name ?? 'Nama Penumpang';
          passengersNameReturn.push(defaultName);
        }
  
        const seatsNoReturn = [];
        this.selectedSeatsReturn.forEach(item => {
          seatsNoReturn.push(item.label);
        });
        params.departure_id_return = this.selectedDestinationPool.destination_id;
        params.destination_id_return = this.selectedDeparturePool.pool_code;
        params.departure_date_return = this.departureDateReturn;
        params.departure_time_return = this.selectedDepartureTimeReturn.departure_time;
        params.schedule_code_return = this.selectedDepartureTimeReturn.code;
        params.passengers_name_return = passengersNameReturn.toString();
        params.seats_no_return = seatsNoReturn.toString();

        

        
      }

      const result = await ApiCallBooking({ token: this.token, params });
      if (result?.status === 'OK') {
        console.log('this is params bookingTicket', params);
        console.log('this is bookingTicket result', result);
        this.bookingInfo = result.data;
        return { success: true };
      } else {
        console.log('this is params bookingTicket', params);
        console.log('this is bookingTicket result', result);
        return { success: false, message: result?.data?.message || result?.data?.tiketux?.pesan };
      }
      
    },

    async getPriceTotal(params) {
      const result = await ApiCall({ action: 'priceTotal', token: this.token, params });
      console.log('getPriceTotal result', result);
      if (result.status === 'OK') {
        this.priceTotalNewAsmat = result.data;
        return { success: true };
      } else {
        return { success: false }
      }
    },

    async voucherCheck(params) {
      try {
        const result = await ApiCall({ action: 'voucherCheck', token: this.token, params });
        console.log('voucherCheck result', result);
        if (result.status === 'OK') {
          this.voucherData = result.data;
          return { success: true };
        } else {
          return { success: false };
        }
      } catch (error) {
        console.log('onError voucherCheck', error);
        return { success: false }; 
      }
    },

    async userCheck(params) {
      const result = await ApiCall({ action: 'userCheck', token: this.token, params });
      if (result?.status === 'BERHASIL' || result?.status === 'OK') {
        console.log('this is checkUser result', result);
        if (
          result?.data?.user === 'LAMA' ||
          result?.data?.name
        ){
          this.registeredCustomer = result.data?.data ?? result?.data
        };
        return { success: true };
      } else {
        console.log('this is checkUser result', result);
        return { success: false };
      }
    },

    async checkPaymentStatus() {
      // const bookingCodeHash = md5(`bhinneka_BJH230707AV5CW_tunggalikap7`);
      const bookingCodeHash = md5(`bhinneka_${this.bookingInfo.booking_code}_tunggalikap7`);
      const params = {
        booking_code: bookingCodeHash,
        booking_code_raw: this.bookingInfo.booking_code
      };
      
      const result = await ApiCall({ action: 'checkPaymentStatus', token: this.token, params });
      console.log('this is checkPaymentStatus result', result);
      if (result.data.status === 'BELUM BAYAR' || result.data.status === 'BOOKED') {
        console.log('belum');
        return false;
      }

      if (result.data.status === 'LUNAS' || result.data.status === 'PAID') {
        console.log('lunas');
        return true;
      }

      console.log('result booking status is', result.data.status)
      return false;
      // return true;
    },

    async getDetailBooking() {
      // const bookingCodeHash = md5(`bhinneka_BJH230707AV5CW_tunggalikap7`);
      const bookingCodeHash = md5(`bhinneka_${this.bookingInfo.booking_code}_tunggalikap7`);
      const params = {
        booking_code: bookingCodeHash,
        booking_code_raw: this.bookingInfo.booking_code
      };
      
      const result = await ApiCall({ action: 'bookingDetail', token: this.token, params });
      console.log('this is getDetailBooking result', result);
      if (result.data.status === 'BELUM BAYAR' || result.data.status === 'BOOKED') {
        this.updateBookingInfo = result.data;
        console.log('belum');
        return false;
      }

      if (result.data.status === 'LUNAS' || result.data.status === 'PAID') {
        this.updateBookingInfo = result.data;
        console.log('lunas');
        return true;
      }

      console.log('result booking status is', result.data.status)
      return false;
    },

    async detailBooking(bookingCode) {
      try {
        const params = {
          booking_code_raw: bookingCode
        };
        const result = await ApiCall({ action: 'bookingDetail', token: this.token, params });
        console.log({ result })
        return result.data;  
      } catch (error) {
        throw new Error(error);
      }
    },

    async cancelBooking(params) {
      const result = await ApiCall({ action: 'cancelBooking', token: this.token, params });
      console.log('this is cancelBooking result', result);
      if (result.status === 'OK') {
        return { success: true };
      } else {
        return { success: false, message: result?.data?.message };
      }
    },

    async updateBooking(params) {
      const result = await ApiCall({ action: 'updateBooking', token: this.token, params });
      if (result.status === 'OK') {
        console.log('this is updateBooking', result)
        this.otpNewAsmat = result?.data?.results?.otp || ''
        return { success: true };
      } else {
        return { success: false, message: result?.data?.pesan };
      }
    },

    async detailBoardingAction(params, isNewAsmat = false) {
      const result = await ApiCall({ action: 'detailBoarding', token: this.token, params });
      if (!isNewAsmat) {
        if (result.status === 'OK') {
          this.detailBoarding = result.data;
          return { success: true }
        } else {
          return { success: false, message: result.data }
        }
      } else {
        if (result.status == 'OK') {
          if (result.data.message === null) {
            this.detailBoarding = result.data;
            return { success: true }
          } else {
            return { success: false, message: result.data }
          }
          
        } else {
          return { success: false, message: result.data }
        }
      }
    }, 

    async boarding(params) {
      const result = await ApiCall({ action: 'boarding', token: this.token, params });
      console.log('this is boarding result', result);
      if (result?.status === 'OK') {
        return { success: true };
      } else {
        return { success: false, message: result?.data?.message };
      }
    },

    async changePayment(params) {
      // const listPayment = await this.getListPayment();
      // console.log('this is listPayment', listPayment);
      params.admin_fee = 0;
      params.booking_code = this.bookingInfo.booking_code;
      
      console.log('this is params', params)
      const result = await ApiCall({ action: 'changePayment', token: this.token, params });
      console.log('this is changePayment result', result);
      if (result.status === 'OK') {
        this.changePaymentInfo = result.data;
        return { success: true };
      } else {
        return { success: false, message: result?.data?.pesan ?? '-' };
      }
    },

    async setpaid(params) {
      const result = await ApiCall({ action: 'setpaid', token: this.token, params });
      if (result?.status === 'OK') {
        console.log('setpaid success', result);
        return { success: true };
      } else {
        console.log('setpaid failed', result);
        return { success: false};
      }
    },

    async printInfoAction(params) {
      const result = await ApiCall({ action: 'printInfo', token: this.token, params });
      console.log('this is printInfo',  result);
      if (result?.status === 'OK') {
        this.printInfo = result?.data;
        return { success: true }
      } else {
        return { success: false, message: result?.data?.message }
      }
    },

    async tnc() {
      const result = await ApiCall({ action: 'tnc', token: this.token });
      console.log('this is tnc result', result);
      if (result.status === 'OK') {
        return { success: true, data: result.data.result.snk }
      } else {
        return { success: false, result: null }
      }
    },

    async resendEticket(params) {
      const result = await ApiCall({ action: 'resendEticket', token: this.token, params });
      console.log('this is resend Eticket', result);
      if (result.status === 'OK') {
        return { success: true }
      } else {
        return { success: false, message: result.data.pesan }
      }
    },

    /* Other */
    pingStatusPut(params) {
      ApiCall({ action: 'pingStatusPut', params })
    },

    async getAds({ operator, kiosk }) {
      try {
        const result = await ApiCall({
          action: 'getAds',
          auth: {
            username: 'admttx@gmail.com',
            password: 'admTTX123'
          },
          params: {
            operator,
            kiosk,
          }
        });
        return result;
      } catch (error) {
        console.log('ads on error', error);
        throw new Error(error);
      }
    },

    async pingAds(params) {
      const result = await ApiCall({
        action: 'pingAds', 
        auth: {
          username: 'admttx@gmail.com',
          password: 'admTTX123'
        },
        params
      });
      console.log('pingAds', await result);
    }
  }
})