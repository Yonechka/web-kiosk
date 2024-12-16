const adsEndpoint = document.querySelector('[name=adsEndpoint]')?.content ?? null;

const endpoint =  {
    requestToken: {
      url: '/api/token',
      method: 'post',
    },
    departure: {
      url: '/api/departure',
      method: 'get',
    },
    destination: {
      url: '/api/destination',
      method: 'get',
    },
    schedule: {
      url: '/api/schedule',
      method: 'get',
    },
    seat: {
      url: '/api/seat',
      method: 'get',
    },
    listPayment: {
      url: '/api/list_payment',
      method: 'get',
    },
    changePayment: {
      url: '/api/change_payment',
      method: 'post',
    },
    bookingDetail: {
      url: '/api/booking_detail',
      method: 'get',
    },
    booking: {
      url: '/api/booking',
      method: 'post',
    },
    priceTotal: {
      url: '/api/price_total',
      method: 'get',
    },
    voucherCheck: {
      url: '/api/voucher_check',
      method: 'get',
    },
    userCheck: {
      url: '/api/user_check',
      method: 'get',
    },
    cancelBooking: {
      url: '/api/cancel_booking',
      method: 'get',
    },
    checkPaymentStatus: {
      url: '/api/check_payment_status',
      method: 'get',
    },
    updateBooking: {
      url: '/api/update_booking',
      method: 'post',
    },
    detailBoarding: {
      url: '/api/boarding',
      method: 'get',
    },
    boarding: {
      url: '/api/boarding',
      method: 'post',
    },
    setpaid: {
      url: '/api/setpaid',
      method: 'post',
    },
    printInfo: {
      url: '/api/print_info',
      method: 'get',
    },
    tnc: {
      url: '/api/tnc',
      method: 'get',
    },
    resendEticket: {
      url: '/api/resend-eticket',
      method: 'get',
    },

    /* Member */
    memberRegister: {
      url: '/api/member',
      method: 'post'
    },
    memberDetail: {
      url: '/api/member',
      method: 'get'
    },
    memberType: {
      url: '/api/member-type',
      method: 'get'
    },

    /* Other */
    pingStatusPut: {
      url: '/api/ping-status',
      method: 'put'
    },

    getAds: {
      url: adsEndpoint + '/api/kiosk-content',
      method: 'get'
    },

    pingAds: {
      url: adsEndpoint + '/api/kiosk-content/active',
      method: 'post'
    }
};



export default endpoint;