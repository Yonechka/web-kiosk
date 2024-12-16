const locale = {
  en: {
    selectLanguage: 'Select Language',
    errorState: {
      cta: 'Retry',
      message: 'Check Your Internet Connection'
    },
    noInternet: {
      title: 'No Internet Connection',
      description: 'Check your internet connection and try again. If you still having a problem, please call our employee',
      retryCta: 'Retry'
    },
    keyboard: {
      validation: {
        email: 'Email is Invalid!',
        nameMin: 'Name At Least 3 Character!',
        nameNotValid: 'Name Is Invalid!',
        formCannotBeEmpty: 'Form Cannot Be Empty!'
      }
    },
    idle: {
      buttonReservation: 'Booking Ticket',
      buttonSendEticket: 'Send E-Ticket',
      buttonPrintTicket: 'Print Ticket',
      buttonMemberCheck: 'Member Check'
    },
    theNavbar: {
      schedule: 'Schedule',
      reservation: 'Reservation',
      payment: 'Payment',
      complete: 'Complete',
      toast: 'Please Complete The Reservation First!',
      /* Member */
      member: {
        labelCheck: 'Member Check',
        labelDetail: 'Member Detail'
      }
    },
    schedule: {
      departurePool: 'Departure Pool',
      change: 'CHANGE',
      changeLocation: 'Change Location',
      changeDate: 'Change Date',
      onError: 'Error Occured',
      destinationPool: {
        whereToGo: 'Where To Go?',
        selectDestination: 'Select Destination',
        seeLocation: 'See Location',
      }, 
      dates: {
        selectDepartureDate: 'Select Departure Date',
        roundedTrip: 'Rounded Trip?',
        selectReturnDate: 'Select Return Date',
        selectDepartureDateReturn: 'Select Departure Date Return',
        today: 'Today',
        tomorrow: 'Tomorrow',
        whenToGo: 'When To Go?',
        whenToGoReturn: 'Return Date',
        byDate: 'By Date'
      },
      times: {
        selectDepartureTime: 'Select Departure Time',
        seat: 'Seat | Seats',
        totalPrice: 'Total Price',
        fillPhoneNumb: 'Continue',
        selectDepartureReturnTime: 'Select Return Time',
        pleaseSelectReturnDate: 'Please select return date',
        btnSelectReturnDate: 'Select return date',
        departure: 'Departure',
        departureReturn: 'Departure Return',
        changeSeat: 'Change Seat',
        changeTime: 'Change Time',
        leaveSoon: 'Leave Soon',
        scheduleNotAvailable: 'Schedule Not Available',
        availableSeat: ({ named }) => `<strong class="text-[#1F2937]">${named('totalSeats')}</strong> Seats Available`,
        assets: {
          tagDeparture: '/images/tag-departure-en.svg'
        }
      },
      seats: {
        selectSeats: 'Select Seat',
        booked: 'Booked',
        available: 'Available',
        selected: 'Selected',
        transportationType: 'Transportation Type',
        front: 'Front',
        continue: 'Continue',
        selectDepartureSeat: 'Select Departure Seat',
        selectDepartureSeatReturn: 'Select Departure Seat Return',
        timePassed: 'Departure Has Been Missed!',
        totalPrice: 'Total Price',
        chooseOther: 'Choose Other Departure Time'
      }   
    },
    reservation: {
      toast: {
        bookingFailed: 'Booking Failed!'
      },
      card: {
        totalPrice: 'Total Price',
        include: 'Include',
        travelInsurance: 'Travel Insurance',
        change: 'Change'
      },
      form: {
        reservationInformation: 'Reservation Information',
        enterPhoneNo: 'Enter Phone Number',
        continue: 'Continue'
      },
      voucher: {
        deduction: 'Discount',
        hadVoucher: 'Got Voucher?',
        useVoucher: 'Use Voucher',
        enterPhoneNo: '*Enter Phone Number First',
        changeVoucher: 'Change Voucher',
        success: 'Success',
        processing: 'Processing',
        invalidVoucher: 'Voucher code not found / invalid',
        enterVoucherCode: 'Enter Voucher Code',
        scanVoucher: 'Please Scan Your Voucher Below'
      }
    },
    tripCard:  {
      seatPrice: 'Seat Price',
      deduction: 'Discount',
      totalSeats: 'Total Seat | Total Seats',
      seats: 'Seat | Seats',
      include: 'Include',
      travelInsurance: 'Travel Insurance',
      detailCustomer: 'Customer Detail',
      phoneNo: 'Phone Number',
      changeLocation: 'Change',
      change: 'Change',
      hide: 'Hide',
      show: 'Show'
    },
    priceDetailCard: {
      travelInsurance: 'Travel Insurance',
      priceDetails: 'Price Details',
      seat: 'Seat',
      deduction: 'Discount',
      totalPrice: 'Total Price',
      other: 'Other',
      include: 'Include'
    },
    payment: {
      waitingPayment: 'Waiting For Payment',
      bookingCode: 'Booking Code',
      qrisScan: 'Scan QRIS below <br> to complete payment',
      remainingTime: 'Payment Remaining Time',
      howToPay: 'How To Pay',
      checkStatus: 'Check Payment Status',
      orUse: 'Or Use',
      paymentSuccessful: 'Payment Successful',
      countDownInfo: 'The screen will continue automatically in',
      buttonComplete: 'Complete Personal Data',
      cancel: {
        message: 'Do you want to cancel the reservation?',
        yes: 'Yes',
        no: 'No'
      },
      back: 'Back',
      modal: {
        paymentNotConfirmed: 'Payment Not Confirmed',
        paymentFailed: 'Payment Failed',
        errorOccured: 'Error Occured',
        failedCancel: 'Cancel Booking Failed!',
        edcNotSupported: 'Platform Not Supported EDC',
        edcFail: 'Error Occured, Please Try Again'
      }
    },
    completed: {
      toastInvalidForm: 'Please Fill All The Form Before Printing Ticket!',
      fillForm: 'Fill Form',
      phoneNo: 'Phone Number',
      customerName: 'Customer Name',
      customerNamePlaceHolder: 'Enter Your Name',
      customerIsPassenger: 'Customer is passenger',
      customerEmail: 'Customer Email',
      customerEmailPlaceHolder: 'Enter Your Email',
      infantNamePlaceHolder: 'Enter Child Name',
      enterDate: 'Enter Date',
      infantBirthDatePlaceHolder: 'Enter Birth Date',
      imWithInfant: 'Im With Infant',
      childName: 'Child Name',
      passengers: 'Passengers',
      passengersRoundTrip: 'Passengers',
      passengersRoundTripReturn: 'Passengers Return',
      seat: 'Seat',
      passengerNamePlaceHolder: 'Enter Passenger Name',
      printTicket: 'Print Ticket',
      invalidForm: {
        customerName: 'Customer Name Cannot Be Empty!',
        passengerName: 'Passenger Name Cannot Be Empty!',
        infantName: 'Infant Name Cannot Be Empty!',
        infantBirthDate: 'Infant Birth Date Cannot Be Empty!!'
      }
    },
    thanks: {
      customerName: 'Customer Name',
      customerEmail: 'Customer Email',
      bookingCode: 'Booking Code',
      otp: 'OTP',
      detailPassengers: 'Passenger Detail',
      detailCustomer: 'Customer Detail',
      important: 'Important',
      passengerName: 'Name',
      ticket: 'Ticket',
      seat: 'Seat',
      child: 'Child',
      customerInfo: 'Ensure that passenger have boarded at the departure point no later than 20 minutes before departure.',
      ctaTnc: 'Read More',
      takeTicket: 'Grab Ticket Below',
      processing: 'Processing',
      reprintTicket: 'Reprint Ticket',
      done: 'Done'
    },
    boarding: {
      scanBarcode: 'Please Scan <br> Ticket Below',
      back: 'Back',
      confirmAsk: 'Confirm Boarding?',
      ctaNo: 'Cancel',
      ctaYes: 'Boarding',
      customerDetail: 'Customer Detail',
      passengersDetail: 'Passenger Detail | Passengers Detail',
      name: 'Name',
      phoneNo: 'Phone No',
      bookingCode: 'Booking Code',
      ticket: 'Ticket',
      seatNo: 'Seat',
      seat: '',
      seatDisplay: 'Seat',
      enjoyYourTrip: 'Enjoy Your Trip!',
      thanks: 'Thank you <br> for choosing us',
      selfBoarding: 'Self-boarding, no need to print a receipt',
      toast: {
        boardingFail: 'Boarding Failed!',
        onError: 'Error Occured',
        boardingSuccess: 'Boarding Success!'
      }
    },
    sendEticket: {
      sendEticket: 'Send E-Ticket',
      send: 'Send',
      back: 'Back',
      inputPlaceHolder: 'Enter Email',
      toast: {
        sendFailed: 'Send E-Ticket Failed!',
        sendSuccess: 'Send E-Ticket Success!',
        onError: 'Error Occured'
      }
    },
    ticket: {
      passenger: 'PASSENGER',
      withInfant: 'WITH INFANT',
      childName: 'CHILD NAME :',
      roundedTripLabel: 'DEPARTURE',
      roundedTripLabelReturn: 'RETURN',
      departureDateLabel: 'DATE: ',
      seat: 'SEAT',
      jackal: {
        complaint: 'COMPLAINT SERVICE',
        service: 'SHIPPING AND RENT',
        bus: 'TOUR BUS ALSO AVAILABLE'
      },
      daytrans: {
        thanks: 'Thank You For Using Daytrans!'
      },
      baraya: {
        thanks: 'Thank You For Using Baraya!'
      },
      btm: {
        thanks: 'Thank You For Using BTM!'
      },
      aragon: {
        thanks: 'Thank You For Using ARAGON!'
      },
      kruzz: {
        thanks: 'Thank You For Using KRUZZ!'
      },
      connex: {
        thanks: 'Thank You For Using CONNEX!'
      },
      raputri: {
        thanks: 'Thank You For Using RAPUTRI!'
      },
    },
    directPrintTicket: {
      printTicket: 'Print Ticket',
      findTicket: '*You can find QRCODE on E-Ticket or Baraya Travel application',
      bookingCode: 'Booking Code',
      otpCode: 'OTP Code',
      enterBookingCode: 'Enter Booking Code',
      enterOtpCode: 'Enter OTP Code',
      confirmAsk: 'Print Ticket?',
      ctaNo: 'Cancel',
      ctaYes: 'Print',
      toast: {
        printFail: 'Print Faild!',
        onError: 'Error Occured',
        printSuccess: 'Print Success!'
      }
    }
  },
  id: {
    selectLanguage: 'Pilih Bahasa',
    errorState: {
      cta: 'Coba Lagi',
      message: 'PERIKSA JARINGAN INTERNET ANDA'
    },
    noInternet: {
      title: 'Koneksi internet terputus',
      description: 'Periksa kembali koneksi internet Anda dan coba lagi. Jika masih mengalami masalah, hubungi bantuan teknisi.',
      retryCta: 'Muat Ulang'
    },
    keyboard: {
      validation: {
        email: 'Format Email Salah!',
        nameMin: 'Nama Minimal Tiga Huruf!',
        nameNotValid: 'Format Nama Tidak Valid!',
        formCannotBeEmpty: 'Form Tidak Boleh Kosong!'
      }
    },
    idle: {
      buttonReservation: 'Pesan Tiket',
      buttonSendEticket: 'Kirim E-Ticket',
      buttonPrintTicket: 'Cetak Tiket',
      buttonMemberCheck: 'Cek Member'
    },
    theNavbar: {
      schedule: 'Jadwal',
      reservation: 'Pemesanan',
      payment: 'Pembayaran',
      complete: 'Selesai',
      toast: 'Harap Selesaikan Reservasi Terlebih Dahulu!',
      /* Member */
      member: {
        labelCheck: 'Cek Member',
        labelDetail: 'Detail Member'
      }
    },
    schedule: {
      departurePool: 'Asal Keberangkatan',
      change: 'UBAH',
      changeLocation: 'Ubah Lokasi',
      changeDate: 'Ubah Tanggal',
      onError: 'Terjadi Kesalahan',
      destinationPool: {
        whereToGo: 'Tujuan Kemana?',
        selectDestination: 'Pilih Tujuan',
        seeLocation: 'Lihat Lokasi',
      },
      dates: {
        selectDepartureDate: 'Pilih Jadwal Keberangkatan',
        roundedTrip: 'Pulang Pergi?',
        selectReturnDate: 'Pilih Tanggal Pulang',
        selectDepartureDateReturn: 'Pilih Jadwal Keberangkatan Pulang',
        today: 'Hari Ini',
        tomorrow: 'Hari Esok',
        whenToGo: 'Kapan Berangkat?',
        whenToGoReturn: 'Tanggal Pulang',
        byDate: 'Berdasarkan Tanggal'
      },
      times: {
        selectDepartureTime: 'Pilih Jam Berangkat',
        seat: 'Kursi | Kursi',
        totalPrice: 'Total Harga',
        fillPhoneNumb: 'Isi No. Telepon',
        selectDepartureReturnTime: 'Pilih Jam Pulang',
        pleaseSelectReturnDate: 'Silakan pilih tanggal pulang',
        btnSelectReturnDate: 'Pilih tanggal pulang',
        departure: 'Pergi',
        departureReturn: 'Pulang',
        changeSeat: 'Ubah Kursi',
        changeTime: 'Ubah Jam',
        leaveSoon: 'Segera Pergi',
        scheduleNotAvailable: 'Jadwal Tidak Tersedia',
        availableSeat: ({ named }) => `Sisa <strong class="text-[#1F2937]">${named('totalSeats')}</strong> Kursi`,
        assets: {
          tagDeparture: '/images/tag-departure.svg'
        }
      },
      seats: {
        selectSeats: 'Pilih Posisi Duduk',
        booked: 'Terisi',
        available: 'Tersedia',
        selected: 'Dipilih',
        transportationType: 'Tipe Kendaraan',
        front: 'Depan',
        continue: 'Lanjutkan',
        selectDepartureSeat: 'Pilih Kursi Pergi',
        selectDepartureSeatReturn: 'Pilih Kursi Pulang',
        timePassed: 'Jam Keberangkatan Sudah Terlewat!',
        totalPrice: 'Total Harga',
        chooseOther: 'Pilih Jam Keberangkatan lain'
      }
    },
    reservation: {
      toast: {
        bookingFailed: 'Booking Gagal!'
      },
      card: {
        totalPrice: 'Total Harga',
        include: 'Sudah Termasuk',
        travelInsurance: 'Asuransi Perjalanan',
        change: 'Ganti'
      },
      form: {
        reservationInformation: 'Informasi Pemesanan',
        enterPhoneNo: 'Masukkan Nomor Telepon',
        continue: 'Lanjutkan'
      },
      voucher: {
        deduction: 'Voucher Potongan',
        hadVoucher: 'Punya Voucher?',
        useVoucher: 'Gunakan Voucher',
        enterPhoneNo: '*Masukkan nomor pemesan terlebih dahulu',
        changeVoucher: 'Ubah Voucher',
        success: 'Sukses',
        processing: 'Memproses',
        invalidVoucher: 'Kode Voucher Tidak Ditemukan / Tidak Valid',
        enterVoucherCode: 'Masukkan Kode Voucher',
        scanVoucher: 'Silakan scan kode voucher Anda di bawah ini'
      }
    },
    tripCard:  {
      seatPrice: 'Seat Price',
      deduction: 'Potongan',
      totalSeats: 'Total Kursi',
      seats: 'Kursi',
      include: 'Sudah Termasuk',
      travelInsurance: 'Asuransi Perjalanan',
      detailCustomer: 'Detail Pemesan',
      phoneNo: 'Nomor Telepon',
      changeLocation: 'Ganti',
      change: 'Ubah',
      hide: 'Sembunyikan',
      show: 'Tampilkan'
    },
    priceDetailCard: {
      travelInsurance: 'Asuransi Perjalanan',
      priceDetails: 'Detail Harga',
      seat: 'Kursi',
      deduction: 'Voucher Potongan',
      totalPrice: 'Total Harga',
      other: 'Lainnya',
      include: 'Sudah Termasuk'
    },
    payment: {
      waitingPayment: 'Menunggu Pembayaran',
      bookingCode: 'Kode Booking',
      qrisScan: 'Scan QRIS dibawah <br> untuk melakukan pembayaran',
      remainingTime: 'Sisa Waktu Pembayaran',
      howToPay: 'Cara Pembayaran',
      checkStatus: 'Cek Status Bayar',
      orUse: 'Atau Gunakan',
      paymentSuccessful: 'Pembayaran Berhasil',
      countDownInfo: 'Screen akan lanjut otomatis dalam waktu',
      buttonComplete: 'Lengkapi Identitas',
      cancel: {
        message: 'Apakah anda ingin membatalkan booking?',
        yes: 'Ya',
        no: 'Tidak'
      },
      back: 'Kembali',
      modal: {
        paymentNotConfirmed: 'Pembayaran Belum Terkonfirmasi',
        paymentFailed: 'Pembayaran Gagal',
        errorOccured: 'Terjadi Kesalahan',
        failedCancel: 'Cancel Booking Gagal',
        edcNotSupported: 'Platform Tidak Mendukung EDC',
        edcFail: 'Terjadi Kesalahan Silahkan Coba Lagi'
      }
    },
    completed: {
      toastInvalidForm: 'Harap isi semua form sebelum print Ticket!',
      fillForm: 'Isi Identitas',
      phoneNo: 'Nomor Telepon',
      customerName: 'Nama Pemesan',
      customerNamePlaceHolder: 'Masukkan Nama',
      customerIsPassenger: 'Pemesan adalah penumpang',
      customerEmail: 'Email Pemesan',
      customerEmailPlaceHolder: 'Masukkan Email',
      infantBirthDatePlaceHolder: 'Masukkan Tanggal',
      infantNamePlaceHolder: 'Masukkan Nama',
      enterDate: 'Tanggal Lahir',
      imWithInfant: 'Saya Membawa Bayi',
      childName: 'Nama Anak',
      passengers: 'Penumpang',
      passengersRoundTrip: 'Penumpang Pergi',
      passengersRoundTripReturn: 'Penumpang Pulang',
      seat: 'Kursi',
      passengerNamePlaceHolder: 'Nama Penumpang',
      printTicket: 'Cetak Tiket',
      invalidForm: {
        customerName: 'Form Nama Tidak Boleh Kosong!',
        passengerName: 'Form Nama Penumpang Tidak Boleh Kosong!',
        infantName: 'Form Nama Bayi Tidak Boleh Kosong!',
        infantBirthDate: 'Form Tanggal Lahir Bayi Tidak Boleh Kosong!'
      }
    },
    thanks: {
      customerName: 'Nama Pemesan',
      customerEmail: 'Email Pemesan',
      bookingCode: 'Kode Booking',
      otp: 'Kode OTP',
      detailPassengers: 'Detail Penumpang',
      detailCustomer: 'Detail Pemesan',
      important: 'Info Penting',
      passengerName: 'Nama',
      ticket: 'Kode Tiket',
      seat: 'Kursi',
      child: 'Bayi',
      customerInfo: 'Pastikan penumpang sudah melakukan boarding di point keberangkatan paling lambat 20 menit sebelum keberangkatan',
      ctaTnc: 'Baca Lebih Detail',
      takeTicket: 'Ambil Tiket Di Bawah Ini',
      processing: 'Memproses',
      reprintTicket: 'Cetak Ulang Tiket',
      done: 'Selesai'
    },
    boarding: {
      scanBarcode: 'Silahkan scan barcode <br> anda di bawah ini',
      back: 'Kembali',
      confirmAsk: 'Konfirmasi Boarding?',
      ctaNo: 'Tidak',
      ctaYes: 'Konfirmasi',
      customerDetail: 'Detail Pemesan',
      passengersDetail: 'Detail Penumpang',
      name: 'Nama',
      phoneNo: 'Nomor Telepon',
      bookingCode: 'Kode Booking',
      ticket: 'Nomor Tiket',
      seatNo: 'Posisi Duduk',
      seat: 'Kursi',
      seatDisplay: 'Kursi',
      enjoyYourTrip: 'Hati-Hati Di Jalan',
      thanks: 'Terimakasih telah <br> mempercayai kami',
      selfBoarding: 'Boarding Mandiri Tidak Perlu Mencetak Struk',
      toast: {
        boardingFail: 'Boarding Gagal!',
        onError: 'Terjadi Kesalahan',
        boardingSuccess: 'Boarding Berhasil!'
      }
    },
    sendEticket: {
      sendEticket: 'Kirim E-Tiket',
      send: 'Kirim',
      back: 'Kembali',
      inputPlaceHolder: 'Masukkan Email',
      toast: {
        sendFailed: 'Kirim E-Ticket Gagal',
        sendSuccess: 'Kirim E-Ticket Berhasil',
        onError: 'Terjadi Kesalahan'
      }
    },
    ticket: {
      passenger: 'PENUMPANG',
      withInfant: 'PENUMPANG BERSAMA BAYI',
      childName: 'BAYI :',
      roundedTripLabel: 'PERGI',
      roundedTripLabelReturn: 'PULANG',
      departureDateLabel: 'TANGGAL: ',
      seat: 'KURSI',
      jackal: {
        complaint: 'LAYANAN PENGADUAN:',
        service: 'MELAYANI PAKET DAN SEWA',
        bus: 'BUS PARIWISATA'
      },
      daytrans: {
        thanks: 'Terima Kasih Telah Menggunakan Daytrans!'
      },
      baraya: {
        thanks: 'Terima Kasih Telah Menggunakan Baraya!'
      },
      btm: {
        thanks: 'Terima Kasih Telah Menggunakan BTM!'
      },
      aragon: {
        thanks: 'Terima Kasih Telah Menggunakan ARAGON!'
      },
      kruzz: {
        thanks: 'Terima Kasih Telah Menggunakan KRUZZ!'
      },
      connex: {
        thanks: 'Terima Kasih Telah Menggunakan CONNEX!'
      },
      raputri: {
        thanks: 'Terima Kasih Telah Menggunakan Raputri!'
      },
    },
    directPrintTicket: {
      printTicket: 'Cetak Tiket',
      findTicket: '*QRCODE dapat dilihat di email tiket atau aplikasi Baraya Travel',
      bookingCode: 'Kode Booking',
      otpCode: 'Kode OTP',
      enterBookingCode: 'Masukkan Kode Booking',
      enterOtpCode: 'Masukkan Kode OTP',
      confirmAsk: 'Cetak Tiket?',
      ctaNo: 'Batal',
      ctaYes: 'Cetak',
      toast: {
        printFail: 'Cetak Gagal!',
        onError: 'Terjadi Kesalahan',
        printSuccess: 'Cetak Berhasil!'
      }
    }
  }
};

export default locale;