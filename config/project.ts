import Env from '@ioc:Adonis/Core/Env';

export interface Feature {
  edc: string[],
  isInsurance: boolean,
  isBoarding: boolean,
  isVoucher: boolean,
  isPrintTicket: boolean,
  isChangeDeparturePool: boolean,
}
interface Features {
  [key: string]: Feature,
  'JACKAL_HOLIDAYS': Feature,
  'DAYTRANS': Feature,
  'BARAYA': Feature,
  'BTM': Feature,
  'ARAGON': Feature,
}

export const endpoint = {
  /* Asmat Endpoint Collections */
  asmat: {
    protocolSubdomain: Env.get('API_PROTOCOL_SUBDOMAIN'),
    domainName: Env.get('API_DOMAIN_NAME'),
    paymentApi: Env.get('PAYMENT_BASE_API_ENDPOINT'),
    trailing: 'api/v2/whitelabel',
    collections: {
      requestToken: {
        url: '/client_token.php',
        method: 'post',
      },
      departure: {
        url: '/cabang.php',
        method: 'get',
      },
      destination: {
        url: '/jurusan.php',
        method: 'get',
      },
      schedule: {
        url: '/jadwal.php',
        method: 'get',
      },
      seat: {
        url: '/kursi.php',
        method: 'get',
      },
      listPayment: {
        url: '/payment/list.channel.php',
        method: 'get',
      },
      bookingDetail: {
        url: '/reservasi/booking_detail.php',
        method: 'get',
      },
      userCheck: {
        url: '/penumpang/cek.php',
        method: 'get',
      },
      voucherCheck: {
        url: '/cek_voucher.php',
        method: 'get'
      },
      booking: {
        url: '/reservasi/booking.php',
        method: 'post',
      },
      cancelBooking: {
        url: '/reservasi/batal.php',
        method: 'post',
      },
      updateBooking: {
        url: '/reservasi/update_booking.php',
        method: 'post',
      },
      changePayment: {
        url: '/payment/new.payment.php',
        method: 'post',
      },
      detailBoarding: {
        url: '/reservasi/detailpenumpangboarding.php',
        method: 'get',
      },
      boarding: {
        url: '/reservasi/boarding.php',
        method: 'post',
      },
      printInfo: {
        url: '/reservasi/cetak_tiket.php',
        method: 'get',
      },
      tnc: {
        url: '/terms/2022.php',
        method: 'get'
      },
      resendEticket: {
        url: '/reservasi/resend_tiket.php',
        method: 'get'
      }
    },
  },

  /* Another Collections Goes Here */
  asmatNew: {
    protocolSubdomain: Env.get('API_PROTOCOL_SUBDOMAIN'),
    domainName: Env.get('API_DOMAIN_NAME'),
    paymentApi: Env.get('PAYMENT_BASE_API_ENDPOINT'),
    trailing: 'api-whitelabel',
    collections: {
      requestToken: {
        url: '/client_token.php',
        method: 'post'
      },
      departure: {
        url: '/outletasal',
        method: 'get'
      },
      destination: {
        url: '/outlettujuan',
        method: 'get'
      },
      schedule: {
        url: '/keberangkatan',
        method: 'get',
      },
      seat: {
        url: '/kursi',
        method: 'get',
      },
      priceTotal: {
        url: '/reservasi/hitungtotal',
        method: 'get',
      },
      voucherCheck: {
        url: '/reservasi/cekpotongan',
        method: 'get'
      },
      userCheck: {
        url: '/customer/detail',
        method: 'get',
      },
      listPayment: {
        url: '/payment/channel',
        method: 'get',
      },
      booking: {
        url: '/reservasi/booking',
        method: 'post'
      },
      cancelBooking: {
        url: '/reservasi/batal',
        method: 'post',
      },
      checkPaymentStatus: {
        url: '/payment/cek',
        method: 'get',
      },
      bookingDetail: {
        url: '/reservasi/detail',
        method: 'get'
      },
      updateBooking: {
        url: '/reservasi/updatepenumpang',
        method: 'post'
      },
      changePayment: {
        url: '/payment/ubah',
        method: 'post',
      },
      printInfo: {
        url: '/reservasi/cetak',
        method: 'get',
      },
      detailBoarding: {
        url: '/reservasi/detailboarding',
        method: 'get',
      },
      boarding: {
        url: '/reservasi/boarding',
        method: 'post',
      },
      tnc: {
        url: '/sk',
        method: 'get'
      },

      /* Member */
      memberRegister: {
        url: '/member/registrasi',
        method: 'post'
      },
      memberDetail: {
        url: '/customer/detail',
        method: 'get'
      },
      memberType: {
        url: '/member/jenis',
        method: 'get'
      },
      resendEticket: {
        url: '/reservasi/etiket/resend',
        method: 'get'
      }
    }
  }
}

export const clientCredentials = {
  'baraya': {
    'BBB': {
      outlet_id: 'BARAYA_BBB',
      name: 'Baraya Buah Batu',
      client_id: 'test123',
      client_secret: 'test123',
    },
  },
  'asmat': {
    'BBB': {
      outlet_id: 'ASMAT_BBB',
      name: 'Asmat Buahbatu',
      client_id: 'test123',
      client_secret: 'test123',
    },
  },

}

export const features: Features = {
  'JACKAL_HOLIDAYS': {
    edc: ['DU', 'DU2'],
    isInsurance: false,
    isBoarding: true,
    isVoucher: false,
    isPrintTicket: false,
    isChangeDeparturePool: false
  },
  'DAYTRANS': {
    edc: ['25', '91', '36', '17', '71'],
    isInsurance: true,
    isBoarding: true,
    isVoucher: true,
    isPrintTicket: false,
    isChangeDeparturePool: false
  },
  'BARAYA': {
    edc: [],
    isInsurance: false,
    isBoarding: true,
    isVoucher: true,
    isPrintTicket: true,
    isChangeDeparturePool: true
  },
  'BTM': {
    edc: [],
    isInsurance: false,
    isBoarding: true,
    isVoucher: true,
    isPrintTicket: false,
    isChangeDeparturePool: false
  },
  'ARAGON': {
    edc: [],
    isInsurance: false,
    isBoarding: true,
    isVoucher: true,
    isPrintTicket: false,
    isChangeDeparturePool: false
  },
};

// export const clientCredentials = {
//   DPU: {
//     client_id: 'KIOSK_DPU_01',
//     client_secret: 'KIOSK_DPU_01_TBK_YANG_SELALUBERJAYA20!@#'
//   },
//   DU: {
//     client_id: 'KIOSK_DU_02',
//     client_secret: 'KIOSK_DU_02_TBK_YANG_SELALUBERJAYA20!@#'
//   },
//   DPUC: {
//     client_id: 'KIOSK_DPUC_01',
//     client_secret: 'KIOSK_DPUC_01_TBK_YANG_SELALUBERJAYA20!@#'
//   },
//   PST: {
//     client_id: 'KIOSK_PST_01',
//     client_secret: 'KIOSK_PST_01_TBK_YANG_SELALUBERJAYA20!@#'
//   },
//   '33': { // Gading GDG
//     client_id: 'KIOSK',
//     client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
//   },
//   '25': { //Dipatiukur DPU
//     client_id: 'KIOSK_DPU',
//     client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
//   },
//   '71': {  //Pasteur PST
//     client_id: 'KIOSK_PST',
//     client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
//   },
//   '17': { //Cihampelas CHP
//     client_id: 'KIOSK_CHP',
//     client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
//   },
//   '91': { // Tebet TBT
//     client_id: 'KIOSK_TBT',
//     client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
//   },
//   '36': { // Grogol GRG
//     client_id: 'KIOSK_GRG',
//     client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
//   },
// }