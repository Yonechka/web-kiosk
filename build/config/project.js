"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.features = exports.clientCredentials = exports.endpoint = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.endpoint = {
    asmat: {
        protocolSubdomain: Env_1.default.get('API_PROTOCOL_SUBDOMAIN'),
        domainName: Env_1.default.get('API_DOMAIN_NAME'),
        paymentApi: Env_1.default.get('PAYMENT_BASE_API_ENDPOINT'),
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
    asmatNew: {
        protocolSubdomain: Env_1.default.get('API_PROTOCOL_SUBDOMAIN'),
        domainName: Env_1.default.get('API_DOMAIN_NAME'),
        paymentApi: Env_1.default.get('PAYMENT_BASE_API_ENDPOINT'),
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
};
exports.clientCredentials = {
    'daytrans': {
        '25': {
            outlet_id: 'DAYTRANS_DPU',
            name: 'Daytrans Dipatiukur',
            client_id: 'KIOSK_DPU',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070',
        },
        '71': {
            outlet_id: 'DAYTRANS_DPU',
            name: 'Daytrans Pasteur',
            client_id: 'KIOSK_PST',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        '17': {
            outlet_id: 'DAYTRANS_CHP',
            name: 'Daytrans Cihampelas',
            client_id: 'KIOSK_CHP',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        '91': {
            outlet_id: 'DAYTRANS_TBT',
            name: 'Daytrans Tebet',
            client_id: 'KIOSK_TBT',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        '36': {
            outlet_id: 'DAYTRANS_GRG',
            name: 'Daytrans Grogol',
            client_id: 'KIOSK_GRG',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        }
    },
    'jackal': {
        'DU': {
            outlet_id: 'JACKAL_DU',
            name: 'Jackal Dipatiukur 1',
            client_id: 'KIOSK_DU_02',
            client_secret: 'KIOSK_DU_02_TBK_YANG_SELALUBERJAYA20!@#'
        },
        'DU2': {
            outlet_id: 'JACKAL_DU_2',
            name: 'Jackal Dipatiukur 2',
            client_id: 'KIOSK_DU_03',
            client_secret: 'KIOSK_DU_03_TBK_YANG_SELALUBERJAYA20!@#'
        },
        'DPU': {
            outlet_id: 'JACKAL_DPU',
            name: 'Jackal Dipatiukur Pusat',
            client_id: 'KIOSK_DPU_01',
            client_secret: 'KIOSK_DPU_01_TBK_YANG_SELALUBERJAYA20!@#'
        },
        'PST': {
            outlet_id: 'JACKAL_PST',
            name: 'Jackal Pasteur 1',
            client_id: 'KIOSK_PST_01',
            client_secret: 'KIOSK_PST_01_TBK_YANG_SELALUBERJAYA20!@#'
        },
        'TEST': {
            outlet_id: 'TEST',
            name: 'TEST',
            client_id: 'KIOSK',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        }
    },
    'jackalx': {
        'DU': {
            outlet_id: 'JACKAL_DU',
            name: 'Jackal Dipatiukur 1',
            client_id: 'KIOSK_DU_02',
            client_secret: 'KIOSK_DU_02_TBK_YANG_SELALUBERJAYA20!@#'
        },
        'DU2': {
            outlet_id: 'JACKAL_DU_2',
            name: 'Jackal Dipatiukur 2',
            client_id: 'KIOSK_DU_03',
            client_secret: 'KIOSK_DU_03_TBK_YANG_SELALUBERJAYA20!@#'
        },
        'DPU': {
            outlet_id: 'JACKAL_DPU',
            name: 'Jackal Dipatiukur Pusat',
            client_id: 'KIOSK_DPU_01',
            client_secret: 'KIOSK_DPU_01_TBK_YANG_SELALUBERJAYA20!@#'
        },
        'PST': {
            outlet_id: 'JACKAL_PST',
            name: 'Jackal Pasteur 1',
            client_id: 'KIOSK_PST_01',
            client_secret: 'KIOSK_PST_01_TBK_YANG_SELALUBERJAYA20!@#'
        },
        'TEST': {
            outlet_id: 'TEST',
            name: 'TEST',
            client_id: 'KIOSK',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        }
    },
    'baraya': {
        'BBB': {
            outlet_id: 'BARAYA_BBB',
            name: 'Baraya Buah Batu',
            client_id: 'KIOSK_BBB',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070',
        },
        'BSP1': {
            outlet_id: 'BARAYA_BSP',
            name: 'Baraya Surapati 1',
            client_id: 'KIOSK_BSP1',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070',
        },
        'BSP2': {
            outlet_id: 'BARAYA_BSP2',
            name: 'Baraya Surapati 2',
            client_id: 'KIOSK_BSP2',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070',
        },
        'BOS2': {
            outlet_id: 'BARAYA_BOS2',
            name: 'Baraya Pasteur 2',
            client_id: 'KIOSK_BOS2',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070',
        },
    },
    'btm': {
        'SRG': {
            outlet_id: 'BTM_SRG',
            name: 'BTM Serang',
            client_id: 'KIOSK_SRG',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'PST': {
            outlet_id: 'BTM_PST',
            name: 'BTM Pasteur',
            client_id: 'KIOSK_PST',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'JATINANGOR': {
            outlet_id: 'BTM_JATINANGOR',
            name: 'BTM Jatinangor',
            client_id: 'KIOSK_JATINANGOR',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'TEST': {
            outlet_id: 'TEST',
            name: 'TEST',
            client_id: 'test123',
            client_secret: 'test123'
        }
    },
    'aragon': {
        'ARP': {
            outlet_id: 'ARAGON_ARP',
            name: 'Aragon Pasteur',
            client_id: 'KIOSK_ARP',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'BDU': {
            outlet_id: 'ARAGON_BDU',
            name: 'Aragon Dipatiukur',
            client_id: 'KIOSK_BDU',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        }
    },
    'kruzz': {
        'TMS': {
            outlet_id: 'KRUZZ_TMS',
            name: 'KRUZZ Taman Sari',
            client_id: 'KIOSK_TMS',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'SAD': {
            outlet_id: 'KRUZZ_SAD',
            name: 'KRUZZ Sadang',
            client_id: 'KIOSK_SAD',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'PCR': {
            outlet_id: 'KRUZZ_PCR',
            name: 'KRUZZ Pancoran',
            client_id: 'KIOSK_PCR',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'BKPWK': {
            outlet_id: 'KRUZZ_BKPWK',
            name: 'KRUZZ Burgerking Purwakarta',
            client_id: 'KIOSK_BKPWK',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'TPZ': {
            outlet_id: 'KRUZZ_TPZ',
            name: 'KRUZZ Pasteur',
            client_id: 'KIOSK_TPZ',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        },
        'CMH': {
            outlet_id: 'KRUZZ_CMH',
            name: 'KRUZZ Cimahi',
            client_id: 'KIOSK_CMH',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        }
    },
    'asmat': {
        'BBB': {
            outlet_id: 'ASMAT_BBB',
            name: 'Asmat Buahbatu',
            client_id: 'KIOSK_BBB',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070',
        },
    },
    'connex': {
        'MCAF': {
            outlet_id: 'CONNEX_MCAF',
            name: 'Connex Markas Cafe Cirebon',
            client_id: 'KIOSK_MCAF',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        }
    },
    'raputri': {
        'PST': {
            outlet_id: 'RAPUTRI_PST',
            name: 'Raputri Pasteur',
            client_id: 'KIOSK_PST',
            client_secret: '55ff27a79d804e7ba625860a1a7550cf38cfb859c1905fdc4ebf8d67c6c3c070'
        }
    }
};
exports.features = {
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
//# sourceMappingURL=project.js.map