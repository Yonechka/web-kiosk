import type { Feature } from "Config/features";
import memberRemodel from "./remodel/member";

export const remodel = {
  /* Re-model Asmat Version */
  asmat: {
    /* Asmat Params Re-model Colllections*/
    params: {
      departure(payload) {
        return payload;
      },
      destination(payload) {
        if (payload === null) return null;
        
        return {
          asal: payload.destination
        };
      },
      schedule(payload) {
        if (payload === null) return null;
        return {
          id_jurusan: payload.destination_id,
          tgl_berangkat: payload.departure_date,
        };
      },
      seat(payload) {
        return {
          kode_jadwal: payload.schedule_code,
          tgl_berangkat: payload.departure_date
        }
      },
      voucherCheck({
        departure_date, product_id, phone_no, code
      }) {
        return {
          kode_jadwal: product_id,
          tgl_berangkat: departure_date,
          no_telp: phone_no,
          kode_voucher: code
        }
      },
      booking(payload) {
        console.log('params booking jackal', payload);
        return {
          tgl_berangkat: payload.departure_date,
          kode_jadwal: payload.schedule_code,
          nama_pemesan: payload.customer_name,
          alamat_pemesan: payload.customer_address,
          telp_pemesan: payload.customer_phone_no,
          email_pemesan: payload.customer_email,
          keterangan: payload.description,
          nama_penumpang: payload.passengers_name,
          nomor_kursi: payload.seats_no,
          sales_channel: payload.sales_channel,
          channel: payload.channel,
          payment: payload.payment,
          harga_tiket: payload.ticket_price,
          is_pp: payload.is_round_trip,
          voucher: payload.voucher,
          tgl_berangkat_pulang: payload.return_date,
          nomor_kursi_pulang: payload.return_schedule_code,
          harga_tiket_pulang: payload.return_ticket_price,
          voucher_pulang: payload.return_voucher,
        }
      },
      userCheck(payload) {
        return {
          no_hp: payload.phone_number
        }
      },
      bookingDetail(payload) {
        return {
          kode_booking: payload.booking_code
        }
      },
      cancelBooking(payload) {
        return {
          kode_booking: payload.booking_code
        }
      },
      updateBooking(payload) {
        return {
          kode_booking: payload.booking_code,
          nama_pemesan: payload.customer_name,
          email_penumpang: payload.customer_email,
          nama_penumpang: payload.passengers_name
        }
      },
      detailBoarding(payload) {
        return {
          no_tiket: payload.noTicket,
          cabang_asal_device: payload.departureCode
        }
      },
      boarding(payload) {
        return {
          no_tiket: payload.noTicket,
          cabang_asal_device: payload.departureCode
        }
      },
      changePayment(payload) {
        return {
          kode_booking: payload.booking_code,
          ...payload
        };
      },
      listPayment(payload) {
        return payload;
      },      
      printInfo({ booking_code, print_all_ticket, otp }) {
        return {
          kodebooking: booking_code,
          cetaksemuatiket: print_all_ticket,
          otp
        }
      },
      tnc(payload) {
        return payload;
      },
      resendEticket(payload) {
        return payload;
      }
    },

    /* Asmat Response Re-model Colllections*/
    response: {
      status(payload) {
        return payload.whitelabel.status
      },
      token(payload) {
        return payload.whitelabel.result.access_token
      },
      departure(payload) {
        const remodeled = payload.whitelabel.result.map(({
          kode_cabang: pool_code,
          nama_cabang: pool_name,
          alamat_cabang: pool_address,
          alamat_cabang_lengkap: pool_full_address,
          kota: city,
          ...rest
        }) => ({
          pool_code,
          pool_name,
          pool_address,
          pool_full_address,
          city,
          ...rest
        }));

        return remodeled;
      },
      destination(payload) {
        const remodeled = payload.whitelabel.result.map(({
          id_jurusan: destination_id,
          kode_jurusan: destination_code,
          cabang_asal: departure_pool,
          kota_asal: departure_city,
          cabang_tujuan: destination_pool,
          kota_tujuan: destination_city,
          harga_tiket: ticket_price,
          harga_tiket_min: min_ticket_price,
          harga_tiket_max: max_ticket_price,
          img_kota_asal: departure_city_image,
          img_kota_tujuan: destination_city_image,
          ...rest
        }) => ({
          destination_id,
          destination_code,
          departure_pool,
          departure_city,
          destination_pool,
          destination_city,
          ticket_price,
          min_ticket_price,
          max_ticket_price,
          departure_city_image,
          destination_city_image,
          ...rest
        }));
        return remodeled;
      },
      schedule(payload) {
        if (!payload.whitelabel.results.jadwal) return [];
        const remodeled = payload.whitelabel.results.jadwal.map(({
          kode: code,
          layanan: service,
          list_transit: list_transit,
          jam_berangkat: departure_time,
          layout_kursi: layout_seat,
          jumlah_kursi: seat_total,
          jumlah_booking: booking_total,
          sisa_kursi: available_seat,
          harga_tiket: ticket_price,
          ...rest
        }) => ({
          code,
          service,
          list_transit,
          departure_time,
          layout_seat,
          seat_total,
          booking_total,
          available_seat,
          ticket_price,
          ...rest
        }));

        remodeled.forEach(item => {
          item.list_transit[0].forEach(item => {
            item.outlet_pickup_name = item.nama_outlet_pickup
            delete item.nama_outlet_pickup
          });
          
          if (item.promo) {
            item.promo.promo_name = item.promo.nama_promo;
            item.promo.promo_code = item.promo.kode_promo;
            delete item.promo.nama_promo;
            delete item.promo.kode_promo;
          }
        });
        
        return remodeled;
      },
      seat(payload) {
        const { 
          baris: row,
          kolom: col,
          kapasitas: capacity,
          isjemput: isPickup,
          jemputminfree: pickupMinFree,
          jemputbiayadalamarea: pickupFeeinsideArea,
          jemputmindalamarea: pickupMinInsideArea,
          jemputbiayaluararea: pickupFeeOutsideArea,
          jemputminluararea: pickupMinOutsideArea,
          isantar: isDropoff,
          antarminfree: dropoffMinFree,
          antarbiayadalamarea: dropoffFeeInsideArea,
          antarmindalamarea: dropoffMinInsideArea,
          antarbiayaluararea: dropoffFeeOutsideArea,
          antarminluararea: dropoffMinOutsideArea,
          peta_layout: seats_layout,
          no_manifest: manifest_no,
          kode_kendaraan: vehicle_code,
          no_polisi: license_plate,
          kode_driver: driver_code,
          nama_driver: driver_name,
        } = payload.whitelabel.result;

        const remodel = {
          row,
          col,
          capacity,
          isPickup,
          pickupMinFree,
          pickupFeeinsideArea,
          pickupMinInsideArea,
          pickupFeeOutsideArea,
          pickupMinOutsideArea,
          isDropoff,
          dropoffMinFree,
          dropoffFeeInsideArea,
          dropoffMinInsideArea,
          dropoffFeeOutsideArea,
          dropoffMinOutsideArea,
          seats_layout,
          manifest_no,
          vehicle_code,
          license_plate,
          driver_code,
          driver_name
        };

        const seatsLayoutRemodel = remodel.seats_layout.map(({
          notiket: ticket_no,
          namapenumpang: passanger_name,
          tglberangkat: departure_date,
          kodejadwal: schedule_code,
          kodebooking: booking_code,
          iscetaktiket: isPrintTicket,
          jenispembayaran: payment_method,
          ...rest
        }) => ({
          ticket_no,
          passanger_name,
          departure_date,
          schedule_code,
          booking_code,
          isPrintTicket,
          payment_method,
          ...rest
        }));
        seatsLayoutRemodel.forEach(item => {
          if (item.promo) {
            item.promo.promo_name = item.promo.nama_promo;
            item.promo.promo_code = item.promo.kode_promo;
            delete item.promo.nama_promo;
            delete item.promo.kode_promo;
          }
        });

        remodel.seats_layout = seatsLayoutRemodel;
        return remodel;
      },
      userCheck(payload) {
        let remodeled = {
          user: payload.whitelabel.result.pelanggan,
          data: {
            name: payload.whitelabel.result.data.nama,
            email: payload.whitelabel.result.data.email,
            address: payload.whitelabel.result.data.alamat,
            id_member: payload.whitelabel.result.data.id_member,
            passenger_type: payload.whitelabel.result.data.jenis_penumpang,
          }
        };
        return remodeled;
      },
      voucherCheck(payload) {
        if (payload.whitelabel.status !== 'OK') return payload;

        const {
          keterangan,
          nominal,
          total,
          ishargatetap,
          namavoucher
        } = payload.whitelabel.result;
  
        return {
          description: keterangan,
          deduction_nominal: nominal,
          total,
          isFlatPrice: ishargatetap,
          voucherName: namavoucher
        }
      },
      booking(payload) {
        console.log('booking result', payload);
        // return payload.whitelabel;
        const data = payload.whitelabel.results;
        const remodeled = {
          departure_date       : data.tgl_berangkat,
          booking_code         : data.kode_booking,
          ticket_no            : data.no_tiket,
          price                : data.harga,
          discount_voucher     : data.discount_voucher,
          discount_promo       : data.discount_promo,
          discount_off         : data.discount_potongan,
          admin_fee            : data.admin_fee,
          total_price          : data.total_harga,
          payment_due_date     : data.batas_pembayaran,
          message              : payload.whitelabel.pesan,
          status               : data.status,
          payment_status       : data.payment_status,
          voucher_code         : data.kode_voucher,
          ticket_status        : data.status_tiket
        }
        return remodeled;
      },
      listPayment(payload) {
        const remodel = payload.whitelabel.result;
        return remodel;
      },
      bookingDetail(payload) {
        // return payload.whitelabel.result
        const data = payload.whitelabel.result;
        const remodeled = {
          booking_code                  : data.kode_booking,
          customer_name                 : data.nama_pemesan,
          customer_email                : data.email_pemesan,
          customer_phone_no             : data.telp_pemesan,
          order_time                    : data.waktu_pesan,
          payment_type                  : data.jenis_pembayaran,
          departure_id                  : data.id_asal,
          departure_code                : data.kode_asal,
          departure                     : data.asal,
          departure_name                : data.nama_asal,
          destination_id                : data.id_tujuan,
          destination_code              : data.kode_tujuan,
          destination                   : data.tujuan,
          destination_name              : data.nama_tujuan,
          destination_date              : data.tgl_berangkat,
          destination_date_formatted    : data.tgl_berangkat_formatted,
          destination_time              : data.jam_berangkat,
          payment_book                  : data.pembayaran_book,
          payment_code                  : data.kode_payment,
          terms                         : data.terms,
          web_manual                    : data.web_manual,
          due_date_payment              : data.batas_pembayaran,
          due_date_payment_formatted    : data.batas_pembayaran_formatted,
          otp                           : data.otp,
          qrcode                        : data.qrcode,
          qrcode_hash                   : data.qrcode_hash,
          total                         : data.total,
          payment                       : data.payment,
          passengers                    : data.penumpang,
          admin_fee                     : data.admin_fee,
          sales_channel                 : data.sales_channel,
          payment_url                   : data.payment_url,
          vehicle_code                  : data.kode_kendaraan,
          driver_code                   : data.kode_sopir,
          status                        : data.status,
          departure_pool_address        : data.alamat_outlet_asal,
          departure_pool_lat_lon        : data.lat_lon_asal,
          destination_pool_address      : data.alamat_outlet_tujuan,
          destination_pool_lat_lon      : data.lat_lon_tujuan,
          mutation_terms                : data.term_and_condition_mutasi,
          route_id                      : data.id_jurusan,
          schedule_code                 : data.kode_jadwal
        };
        const passengersRemodel = remodeled.passengers.map(({
          notiket: ticket_no,
          nama_penumpang: passenger_name,
          is_bayi: is_infant,
          umur_bayi: infant_age,
          nomor_kursi: seat_no,
          kode_jadwal: schedule_code,
          asal: departure,
          tujuan: destination,
          tgl_berangkat: destination_date,
          tgl_berangkat_formatted: destination_date_formatted,
          min_tgl_mutasi: mutation_date_min,
          min_tgl_mutasi_formatted: mutation_date_min_formatted,
          max_tgl_mutasi: mutation_date_max,
          max_tgl_mutasi_formatted: mutation_date_max_formatted,
          jam_berangkat: departure_time,
          is_mutasi: is_mutation,
          status_mutasi: mutation_status,
          ...rest
        }) => ({
          ticket_no,
          passenger_name,
          is_infant,
          infant_age,
          seat_no,
          schedule_code,
          departure,
          destination,
          destination_date,
          destination_date_formatted,
          mutation_date_min,
          mutation_date_min_formatted,
          mutation_date_max,
          mutation_date_max_formatted,
          departure_time,
          is_mutation,
          mutation_status,
          ...rest
        }));
        remodeled.passengers = passengersRemodel;
        return remodeled;
      },
      cancelBooking(payload) {
        const remodeled = {
          status: payload.whitelabel.status,
          message: payload.whitelabel.pesan
        };
        return remodeled;
        // return payload.whitelabel;
      },
      updateBooking(payload) {
        // return payload;
        const { results, status, pesan } = payload.whitelabel;
        const remodeled = {
          results: {
            booking_code: results.kodebooking,
            otp: results.otp
          },
          status,
          message: pesan,
        };
        return remodeled;
      },
      detailBoarding(payload) {
        // return payload.whitelabel;
        if (payload.whitelabel.status != 'OK') {
          return { message: payload.whitelabel.pesan }
        }
        const {
          kode_jadwal,
          kode_booking,
          jam_berangkat,
          no_tiket,
          no_kursi,
          harga_tiket,
          diskon,
          total,
          otp_used,
          zona,
          alamat_antar,
          penumpang,
          pemesanan,
          cso_cetak,
          asal,
          tujuan,
          tgl_berangkat,
          kode_kendaraan,
          no_polisi,
          nama_driver,
        } = payload.whitelabel.result;

        const remodeled = {
          message           : payload.whitelabel.pesan,
          shcedule_code     : kode_jadwal,
          booking_code      : kode_booking,
          departure_time    : jam_berangkat,
          ticket_no         : no_tiket,
          seat_no           : no_kursi,
          ticket_price      : harga_tiket,
          discount          : diskon,
          total,
          otp_used,
          zona,
          drop_off_address  : alamat_antar,
          passengers: {
            name            : penumpang.nama,
            phone_no        : penumpang.no_telepon,
            type_code       : penumpang.kode_jenis,
            type            : penumpang.jenis,
            member_id       : penumpang.id_member,
            is_boarding     : penumpang.is_boarding  
          },
          orderInfo: {
            status          : pemesanan.status,
            order_time      : pemesanan.waktu_pesan,
            customer_cso    : pemesanan.cso_pemesan,
            payment_time    : pemesanan.waktu_bayar 
          },
          print_cso         : cso_cetak,
          departure         : asal,
          destination       : tujuan,
          departure_date    : tgl_berangkat,
          vehicle_code      : kode_kendaraan,
          license           : no_polisi,
          driver_name       : nama_driver,
        };

        return remodeled;
      },
      boarding(payload) {
        if (payload.whitelabel.status != 'OK') {
          return { message: payload.whitelabel.pesan }
        }
        return payload.whitelabel;
      },
      changePayment(payload) {
        return payload.whitelabel;
      },
      
      /* Not Remodeled Yet */
      printInfo(payload) {
        // return payload.whitelabel;
        if (payload.whitelabel.status != 'OK') {
          return { message: payload.whitelabel.pesan };
        }

        const remodeled = payload.whitelabel.result.map(({
          perusahaan_alamat: company_address,
          perusahaan_nama: company_name,
          perusahaan_telp: company_phone_no,
          perusahaan_website: company_website,
          catatan_tiket: ticket_note,
          qr_code2: qr_code,
          no_tiket: ticket_no,
          tgl_berangkat: departure_date,
          jam_berangkat: departure_time,
          kode_jadwal: schedule_code,
          nama_penumpang: passenger_name,
          is_with_infant: is_with_infant,
          nama_infant: infant_name,
          nomor_kursi: seat_no,
          harga_tiket: ticket_price,
          diskon_promo: promo_discount,
          diskon_voucher: voucher_discount,
          total_bayar: total_payment,
          nama_promo: promo_name,
          kode_voucher: voucher_code,
          waktu_transaksi: transaction_time,
          cso: cso,
          jenis_pembayaran: payment_type,
          asal: departure,
          tujuan: destination,
          nama_cabang_tujuan: destination_pool_name,
          via: via
        }) => ({
          company_name,
          company_address,
          company_phone_no,
          company_website,
          ticket_note,
          qr_code,
          ticket_no,
          departure_date,
          departure_time,
          schedule_code,
          passenger_name,
          is_with_infant,
          infant_name,
          seat_no,
          ticket_price,
          promo_discount,
          voucher_discount,
          total_payment,
          promo_name,
          voucher_code,
          transaction_time,
          cso,
          payment_type,
          departure,
          destination,
          destination_pool_name,
          via
        }));

        return remodeled;
      },
      tnc(payload) {
        return payload.whitelabel
      },
      resendEticket(payload) {
        return payload.whitelabel;
      }
    }
  },


  /* Another Version of Re-model goes here */
  asmatNew: {
    params: {
      departure(payload) {
        return payload
      },
      destination(payload) {
        if (payload === null) return null;
        
        return {
          outletasal: payload.destination
        };
      },
      schedule(payload) {
        if (payload === null) return null;
        return {
          outletasal: payload.departure_id,
          outlettujuan: payload.destination_id,
          tglberangkat: payload.departure_date,
        };
      },
      seat(payload) {
        const params: any = {
          tglberangkat: payload.departure_date,
          idproduk: payload.schedule_code,
          outletasal: payload.departure_id,
          outlettujuan: payload.destination_id,
          ispp: payload.is_round_trip
        };

        if (payload?.departure_date_return) {
          params.tglberangkatpp = payload.departure_date_return;
          params.idprodukpp = payload.schedule_code_return;
          params.outletasalpp = payload.departure_id_return;
          params.outlettujuanpp = payload.destination_id_return;
        }

        return params;
      },
      userCheck(payload) {
        return {
          telp: payload.phone_number
        }
      },
      booking(payload) {
        const params: any = {
          tglberangkat: payload.departure_date,
          tglberangkatinduk: payload.departure_date,
          idproduk: payload.schedule_code,
          idoutletpickup: payload.departure_id,
          idoutletdropoff: payload.destination_id,
          jamberangkat: payload.departure_time,
          telppemesan: payload.customer_phone_no,
          namapemesan: payload.customer_name,
          alamatpemesan: payload.customer_address,
          emailpemesan: payload.customer_email,
          keterangan: payload.description,
          namapenumpang: payload.passengers_name,
          nomorkursi: payload.seats_no,
          payment: payload.payment,
          adminfee: null,
          saleschannel: payload.sales_channel,
          isasuransi: payload.is_insurance,
          kodepotongan: payload.voucher
        }

        if (payload?.departure_date_return) {
          params.tglberangkatpp = payload.departure_date_return;
          params.tbgberangkatindukpp = payload.departure_date_return;
          params.idprodukpp = payload.schedule_code_return;
          params.idoutletpickuppp = payload.departure_id_return;
          params.idoutletdropoffpp = payload.destination_id_return;
          params.jamberangkatpp = payload.departure_time_return;
          params.namapenumpangpp = payload.passengers_name_return;
          params.nomorkursipp = payload.seats_no_return;

        }
        
        console.log('this is params booking', params)
        return params
      },
      priceTotal({
        departure_date, product_id, departure_outlet, destination_outlet, seats, is_insurance, voucher_code,
        departure_date_return, product_id_return, departure_outlet_return, destination_outlet_return, seats_return,
      }) {
        //tglberangkatpp
        //idprodukpp
        //idoutletpickuppp
        //idoutletdropoffpp
        //nomorkursipp
        const params: any = {
          tglberangkat: departure_date,
          idproduk: product_id,
          idoutletpickup: departure_outlet,
          idoutletdropoff: destination_outlet,
          nomorkursi: seats,
          isasuransi: is_insurance,
          kodevoucher: voucher_code,
        };
        departure_date_return ? params.tglberangkatpp = departure_date_return : '';
        product_id_return ? params.idprodukpp = product_id_return : '';
        departure_outlet_return ? params.idoutletpickuppp = departure_outlet_return : '';
        destination_outlet_return ? params.idoutletdropoffpp = destination_outlet_return : '';
        seats_return ? params.nomorkursipp = seats_return : '';
        return params;
      },
      voucherCheck({
        departure_date, departure_time, product_id, departure_outlet, destination_outlet, seats, phone_no, code, isRoundTrip = 0
      }) {
        return {
          tglberangkat: departure_date,
          jamberangkat: departure_time,
          idproduk: product_id,
          outletasal: departure_outlet,
          outlettujuan: destination_outlet,
          nomorkursi: seats,
          telp: phone_no,
          kode: code,
          ispp: isRoundTrip
        }
      },
      cancelBooking(payload) {
        return {
          kodebooking: payload.booking_code,
          alasan: 'kiosk'
        }
      },
      checkPaymentStatus(payload) {
        return {
          kodebooking: payload.booking_code_raw,
        }
      },
      bookingDetail(payload) {
        return {
          kodebooking: payload.booking_code_raw
        }
      },
      listPayment(payload) {
        return payload;
      }, 
      updateBooking(payload) {
        return {
          kode_booking: payload.booking_code,
          nama_pemesan: payload.customer_name,
          email_penumpang: payload.customer_email,
          nama_penumpang: payload.passengers_name,
        }
      },
      printInfo({ booking_code, otp }) {
        return {
          kodebooking: booking_code,
          otp
        }
      },
      detailBoarding(payload) {
        return {
          nomortiket: payload.noTicket,
        }
      },
      boarding(payload) {
        return {
          nomortiket: payload.noTicket,
        }
      },
      tnc(payload) {
        return payload;
      },
      changePayment(payload) {
        return {
          kodebooking: payload.booking_code,
          deskripsi: 'kiosk',
          adminfee: payload.admin_fee,
          payment: payload.payment
        };
      },
      resendEticket(payload) {
        return payload;
      },

      ...memberRemodel.newAsmat.params
    },
    response: {
      status(payload) {
        return payload.tiketux.status
      },
      token(payload) {
        return payload.tiketux.result.access_token
      },
      departure(payload) {
        // return payload.tiketux.result.outlet
        const remodeled = payload.tiketux.result.outlet.map(({
          id: pool_code,
          nama: pool_name,
          alamat: pool_address,
          alamat: pool_full_address,
          kota: city,
          ...rest
        }) => ({
          pool_code,
          pool_name,
          pool_address,
          pool_full_address,
          city,
          ...rest
        }));

        return remodeled;
      },
      destination(payload) {
        const remodeled = payload.tiketux.result.outlet.map(({
          id: destination_id,
          id: destination_code,
          nama: destination_pool,
          kota: destination_city,
          min_tarif: ticket_price,
          min_tarif: min_ticket_price,
          max_tarif: max_ticket_price,
          img: destination_city_image,
          ...rest
        }) => ({
          destination_id,
          destination_code,
          destination_pool,
          destination_city,
          ticket_price,
          min_ticket_price,
          max_ticket_price,
          destination_city_image,
          ...rest
        }));
        return remodeled;
      },
      schedule(payload) {
        // return payload;
        if (!payload.tiketux.result.produk) return [];
        const remodeled = payload.tiketux.result.produk.map(({
          id_produk: code,
          nama_layanan: service,
          list_transit: list_transit,
          jam_berangkat: departure_time,
          // layout_kursi: layout_seat,
          jumlah_kursi: seat_total,
          kursi_terisi: booking_total,
          sisa_kursi: available_seat,
          tarif: ticket_price,
          range_tarif: ticket_price_range,
          range_tarif_disc: ticket_price_disc_range,
          tgl_berangkat: departure_date,
          ...rest
        }) => ({
          code,
          service,
          list_transit,
          departure_time,
          // layout_seat,
          seat_total,
          booking_total,
          available_seat,
          ticket_price,
          ticket_price_range,
          ticket_price_disc_range,
          departure_date,
          ...rest
        }));

        remodeled.forEach(item => {
          item.list_transit.forEach(item => {
            item.outlet_pickup_name = item.nama;
            delete item.nama;
          });
          
          if (item.promo.length > 0) {
            item.promo = {
              promo_name: item.promo[0].nama_promo,
              promo_code: item.promo[0].kode_promo,
              nominal: item.promo[0].nominal
            }
          } else {
            delete item.promo
          }
        });
        
        return remodeled;
      },
      seat(payload) {
        console.log('seats', payload);
        // return payload;
        if (payload.tiketux.status == 'ERROR') {
          return { result: null, status: 'ERROR', message: payload.tiketux.pesan }
        }
        const {
          totalpenumpang, totalkuota, baris, kolom, kapasitas, tipe_kendaraan,
          petalayout_pp, totalpenumpang_pp, totalkuota_pp, baris_pp, kolom_pp, kapasitas_pp
        } = payload.tiketux.result;
        const remodeled = {
          passanger_total: totalpenumpang,
          quotatotal: totalkuota,
          row: baris,
          col: kolom,
          capacity: kapasitas,
          vehicle: tipe_kendaraan ?? null
        }


        const seatsLayout = Object.entries(payload.tiketux.result.petalayout).map(([key, value]) => {
          const [row, col] = key.split('_');
          return { ...value, row: parseInt(row), col: parseInt(col) };
        });

        const seatsLayoutRemodel = seatsLayout.map(({
          notiket: ticket_no,
          tglberangkat: departure_date,
          nama: passanger_name,
          idproduk: schedule_code,
          kodebooking: booking_code,
          iscetaktiket: isPrintTicket,
          jenispembayaran: payment_method,
          kodepromo: promo_code,
          namapromo: promo_name,
          hargatiket: price,
          totalbayar: total_price,
          ...rest
        }) => ({
          ticket_no,
          departure_date,
          passanger_name,
          schedule_code,
          booking_code,
          isPrintTicket,
          payment_method,
          promo_code,
          promo_name,
          price,
          total_price,
          ...rest
        }));

        /* Roundtrip Handler */
        let remodeledReturn = {};
        let seatsLayoutReturn: any = [];
        let seatsLayoutReturnRemodel: any = [];
        if (petalayout_pp) {
          remodeledReturn = {
            passanger_total: totalpenumpang_pp,
            quotatotal: totalkuota_pp,
            row: baris_pp,
            col: kolom_pp,
            capacity: kapasitas_pp,
            vehicle: tipe_kendaraan ?? null
          }
          seatsLayoutReturn = Object.entries(petalayout_pp).map(([key, value]) => {
            const [row, col] = key.split('_');
            return { ...value, row: parseInt(row), col: parseInt(col) };
          });

          seatsLayoutReturnRemodel = seatsLayoutReturn.map(({
            notiket: ticket_no,
            tglberangkat: departure_date,
            nama: passanger_name,
            idproduk: schedule_code,
            kodebooking: booking_code,
            iscetaktiket: isPrintTicket,
            jenispembayaran: payment_method,
            kodepromo: promo_code,
            namapromo: promo_name,
            hargatiket: price,
            totalbayar: total_price,
            ...rest
          }) => ({
            ticket_no,
            departure_date,
            passanger_name,
            schedule_code,
            booking_code,
            isPrintTicket,
            payment_method,
            promo_code,
            promo_name,
            price,
            total_price,
            ...rest
          }));
        }

        return { ...remodeled, seats_layout: seatsLayoutRemodel, returnSeat: { ...remodeledReturn, seats_layout: seatsLayoutReturnRemodel }  }
      },
      userCheck(payload) {
        const { nama: name, email } = payload.tiketux.result;
        let remodeled = {
          name,
          email
        };
        return remodeled;
      },
      booking(payload) {
        console.log('booking result', payload);
        if (payload.tiketux.status === 'ERROR') return payload
        const data = payload.tiketux.result;
        // return data;
        const remodeled = {
          departure_date       : data.tglBerangkat,
          booking_code         : data.kodeBooking,
          ticket_no            : data.noTiket,
          price                : data.harga,
          discount_voucher     : data.discountVoucher,
          discount_promo       : data.discountPromo,
          discount_off         : data.discountPotongan,
          admin_fee            : data.adminFee,
          total_price          : data.totalHarga,
          payment_due_date     : data.batasPembayaran,
          message              : payload.tiketux.pesan,
          status               : payload.tiketux.status,
          payment_status       : { client_data: { ...data.paymentData }  },
        }
        return remodeled;
      },
      voucherCheck(payload) {
        if (payload.tiketux.status !== 'OK') return payload;

        const {
          kode_potongan,
          jenis_potongan,
          nilai_potongan,
          total_bayar,
          tipe_potongan,
          IsPromo,
          IsGabungPromo,
          PrioritasDiskon
        } = payload.tiketux.result;
  
        return {
          deduction_code: kode_potongan,
          deduction: jenis_potongan,
          deduction_nominal: nilai_potongan,
          price_total: total_bayar,
          deduction_type: tipe_potongan,
          isPromo: IsPromo,
          isCombinedPromo: IsGabungPromo,
          priorityDiscount: PrioritasDiskon
        }
      },
      priceTotal(payload) {
        if (payload.tiketux.result === null) {
          const { status, pesan } = payload.tiketux
          return { status, message: pesan }
        }

        const { list_kursi, jumlah_tiket, total_harga_tiket, subtotal, biaya_addon_asuransi, total_bayar } = payload.tiketux.result;
        
        const remodeledSeats = list_kursi.map(({
          nomor_kursi: seats_no,
          harga_tiket: ticket_price,
          biaya_addon_asuransi: insurance_rates,
          ...rest
        }) => ({
          seats_no,
          ticket_price,
          insurance_rates,
          ...rest
        }));

        const remodeled = {
          seats: remodeledSeats,
          total_ticket: jumlah_tiket,
          total_ticket_price: total_harga_tiket,
          subtotal,
          insurance_rates: biaya_addon_asuransi,
          total_price: total_bayar,
        }

        return remodeled;
      },
      cancelBooking(payload) {
        const remodeled = {
          status: payload.tiketux.status,
          message: payload.tiketux.pesan
        };
        return remodeled;
        // return payload.whitelabel;
      },
      checkPaymentStatus(payload) {
      
        if (payload.tiketux.status != 'OK') return payload;
        return payload.tiketux.result;
      },
      bookingDetail(payload) {
        if (payload.tiketux.status == 'ERROR') return payload;

        const data = payload.tiketux.result;

        const {
          nama_pemesan,
          kota_asal_pergi,
          kota_tujuan_pergi,
          tgl_berangkat_pergi,
          jam_berangkat_pergi,
          total_bayar,
          telp_pemesan,
          total_discount
        } = data;

        const { alamat_outlet_asal, alamat_outlet_tujuan } = data.detail_tiket[0];

        const remodeled: any = {
          booking_code                  : data.kode_booking,
          otp                           : data.otp,
          status                        : data.status,
          passengers                    : data.detail_tiket.map(item => ({ ...item.penumpang })),
          customer_name: nama_pemesan,
          phone_no: telp_pemesan,
          departure_city: kota_asal_pergi,
          destination_city: kota_tujuan_pergi,
          outlet_departure_address: alamat_outlet_asal,
          outlet_destination_address: alamat_outlet_tujuan,
          departure_date: tgl_berangkat_pergi,
          departure_time: jam_berangkat_pergi,
          total_discount,
          total_price: total_bayar,
        };
        
        const passengersRemodel = remodeled.passengers.map(({
          no_tiket: ticket_no,
          nama: passenger_name,
          no_kursi: seat_no,
          qr_content: qr_code,
          ...rest
        }) => ({
          ticket_no,
          passenger_name,
          seat_no,
          qr_code,
          ...rest
        }));
        remodeled.passengers = passengersRemodel;

        if (data?.detail_tiket_pp) {
          const passengersReturn = data.detail_tiket_pp.map(item => ({ ...item.penumpang }));
          const passengersReturnRemodel = passengersReturn.map(({
            no_tiket: ticket_no,
            nama: passenger_name,
            no_kursi: seat_no,
            qr_content: qr_code,
            ...rest
          }) => ({
            ticket_no,
            passenger_name,
            seat_no,
            qr_code,
            ...rest
          }));
          remodeled.passengers_return = passengersReturnRemodel;
        }

        return remodeled;
      },
      listPayment(payload) {
        const remodel = payload.tiketux.result;
        return remodel;
      },
      updateBooking(payload) {
        console.log('updateBooking Response', payload)
        // return payload;
        const { result, status, pesan } = payload.tiketux;
       
        const remodeled = {
          results: {
            booking_code: result.kodebooking,
            otp: result.otp,
          },
          status,
          message: pesan,
        };
        return remodeled;
      },
      printInfo(payload) {
        console.log('printInfo response', payload.tiketux.result.tiket);
        // return payload.whitelabel;
        if (payload.tiketux.status != 'OK') {
          return { message: payload.tiketux.pesan };
        }
        const data = payload.tiketux.result;
        const remodeled = data.tiket.map(({
          // perusahaan_alamat: company_address,
          // perusahaan_nama: company_name,
          // perusahaan_telp: company_phone_no,
          // perusahaan_website: company_website,
          // catatan_tiket: ticket_note,
          nomor_tiket: qr_code,
          nomor_tiket: ticket_no,
          tgl_berangkat: departure_date,
          jam_berangkat: departure_time,
          kode_jadwal: schedule_code,
          nama_penumpang: passenger_name,
          // is_with_infant: is_with_infant,
          // nama_infant: infant_name,
          nomor_kursi: seat_no,
          harga: ticket_price,
          discount_promo: promo_discount,
          discount_voucher: voucher_discount,
          harga_total: total_payment,
          kode_promo: promo_name,
          kode_voucher: voucher_code,
          waktu_pesan: transaction_time,
          // cso: cso,
          jenis_pembayaran: payment_type,
          outlet_asal: departure_pool_name,
          outlet_tujuan: destination_pool_name,
          kota_asal: departure,
          kota_tujuan: destination,
          via: via
        }) => ({
          // company_name,
          // company_address,
          // company_phone_no,
          // company_website,
          // ticket_note,
          qr_code,
          ticket_no,
          departure_date,
          departure_time,
          schedule_code,
          passenger_name,
          // is_with_infant,
          // infant_name,
          seat_no,
          ticket_price,
          promo_discount,
          voucher_discount,
          total_payment,
          promo_name,
          voucher_code,
          transaction_time,
          // cso,
          payment_type,
          departure,
          destination,
          departure_pool_name,
          destination_pool_name,
          via
        }));

        remodeled.forEach(item => {
          item.company_name = data.nama_perusahaan;
          item.company_address = data.alamat_perusahaan;
          item.company_phone_no = data.telp_perusahaan;
          item.company_website = data.website_perusahaan;
          item.ticket_note = null;
          item.with_infant = false;
          item.infant_name = null;
          item.cso = null;
        });

        return remodeled;
      },
      detailBoarding(payload) {
        // return payload.whitelabel;
        if (payload.tiketux.status != 'OK') {
          return { message: payload.tiketux.pesan }
        }
        const {
          kode_jadwal,
          kode_booking,
          jam_berangkat,
          nomor_tiket,
          nomor_kursi,
          harga_tiket,
          discount,
          total_bayar,
          is_boarding,
          nama_penumpang,
          cso_cetak_tiket,
          outlet_pickup,
          outlet_dropoff,
          tgl_berangkat,
        } = payload.tiketux.result.tiket;

        const remodeled = {
          message           : payload.tiketux.pesan,
          shcedule_code     : kode_jadwal,
          booking_code      : kode_booking,
          departure_time    : jam_berangkat,
          ticket_no         : nomor_tiket,
          seat_no           : nomor_kursi,
          ticket_price      : harga_tiket,
          discount          : discount,
          total             : total_bayar,
          passengers: {
            name            : nama_penumpang,
            is_boarding  
          },
          print_cso         : cso_cetak_tiket,
          departure         : outlet_pickup,
          destination       : outlet_dropoff,
          departure_date    : tgl_berangkat,
        };

        return remodeled;
      },
      boarding(payload) {
        if (payload.tiketux.status != 'OK') {
          return { message: payload.whitelabel.pesan }
        }
        return payload.tiketux;
      },
      tnc(payload) {
        const result = payload.tiketux.result;
        return {
          result: {
            snk: result
          }
        }
      },
      changePayment(payload) {
        if (payload?.tiketux.status == 'ERROR') return payload.tiketux;
        const remodeled = payload.tiketux.result;
        return {
          results: { ...remodeled, payment_status: { payment_id: remodeled.paymentId } }
        }
      },

      resendEticket(payload) {
        return payload.tiketux;
      },

      ...memberRemodel.newAsmat.response
    }
  }
}

interface RemodelFeaturesItems {
  title: string,
  description: string,
  isActive: boolean
}
export interface RemodelFeatures {
  title: string,
  description: string,
  isActive: boolean,
  items: RemodelFeaturesItems[] | []
}

export const remodelFeatures = (features: Feature) => {
  const remodeled: RemodelFeatures[] = [
    {
      title: 'Reservasi',
      description: 'Untuk Reservasi Tiket',
      isActive: true,
      items: [
        {
          title: 'Asuransi',
          description: 'Memakai asuransi saat reservasi tiket',
          isActive: features.isInsurance
        },
        {
          title: 'Voucher',
          description: 'Memakai voucher untuk reservasi',
          isActive: features.isVoucher
        },
        {
          title: 'Mengganti Outlet Keberangkatan',
          description: 'User bisa memilih outlet keberangkatan',
          isActive: features.isChangeDeparturePool
        },
        {
          title: 'EDC',
          description: 'Reservasi menggunakan mesin EDC',
          isActive: features.edc.length > 0 ? true : false
        }
      ]
    },
    {
      title: 'Boarding',
      description: 'User dapat boarding mandiri menggukan mesin Kiosk',
      isActive: features.isBoarding,
      items: [],
    },
    {
      title: 'Direct Print Ticket',
      description: 'User dapat print ticket menggunakan mesin Kiosk',
      isActive: features.isPrintTicket,
      items: [],
    },
    {
      title: 'Redesign',
      description: 'Kiosk Sudah menggunakan design terbaru (Redesign)',
      isActive: features.useV2,
      items: [],
    },
    {
      title: 'Ads',
      description: 'Kiosk dapat menampilkan iklan pada page Home',
      isActive: features.isAds,
      items: []
    }
  ]

  return remodeled
}

export const basicAuth = (headers) => {
  if (headers.authorization && headers.authorization.includes('Basic')) {
    const username = 'kiosk_basic_auth_username';
    const password = 'kiosk_basic_auth_password';
    const validCredential = btoa(`${username}:${password}`);
    const basicAuth = headers.authorization;

    const [_, value] = basicAuth.split(' ');
    return value === validCredential;
  }
  return false;
}

export const formattingDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: 'numeric',
    minute: 'numeric'
  };
  return date.toLocaleString('id', options);
}
