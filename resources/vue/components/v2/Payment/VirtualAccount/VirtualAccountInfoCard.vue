<script setup>
import { useScheduleStore } from '@/store/ScheduleStore';
import { useStore } from '@/store/Store';
import { formatAccountNumber, formattingNumber } from '@/utils';
import QrcodeVue from 'qrcode.vue';

const scheduleStore = useScheduleStore();
const store = useStore();
const qrDetailBooking = `${store.website}book/cektiket?kodebooking=${scheduleStore.bookingInfo.booking_code}`;

</script>

<template>
  <div class="w-[691px] relative">
    <div class=" w-full bg-[#DC2626] rounded-2xl text-white font-medium text-sm pt-2 pb-10 px-4 relative">
      Pastikan untuk menyimpan Kode Booking untuk melanjutkan reservasi melalui halaman awal. Kode Booking ini Bisa dicatat atau difoto.
    </div>

    <div class=" bg-white w-full rounded-2xl p-6 flex flex-col justify-center items-center gap-6 mt-[-25px] z-10 relative">
      <!-- Label -->
      <div class=" text-[#1F2937] font-semibold text-2xl">Informasi Pembayaran</div>

      <!-- Info Payment -->
      <div class=" w-full flex flex-col items-center">
        <!-- Booking Code -->
        <div class=" w-full flex justify-between items-center mb-[6px]">
          <span class="text-[#71747D] font-medium text-xl">
            Kode Booking:
          </span>
          <span class=" font-semibold text-xl text-[#1F2937]">
            {{ scheduleStore.bookingInfo.booking_code }}
          </span>
        </div>

        <!-- Nomor VA -->
        <div class=" w-full flex justify-between items-center mb-2">
          <span class="text-[#71747D] font-medium text-xl">
            Nomor VA:
          </span>
          <span class=" font-semibold text-xl text-[#1F2937]">
            {{ formatAccountNumber(scheduleStore?.changePaymentInfo?.results?.kodePembayaran) }}
          </span>
        </div>

        <!-- Total Price -->
        <div>
          <div class=" text-[#71747D] font-medium text-xl text-center">
            Total Pembayaran
          </div>

          <div class=" text-[#0A374E] font-bold text-[32px] text-center">
            Rp. {{ formattingNumber(scheduleStore.totalTicketPriceNewAsmat) }}
          </div>
        </div>

        


      </div>

      <!-- QR -->
      <div class=" relative">
        <!-- Qr Image -->
        <div class=" w-[168px] h-[168px] rounded-2xl border border-[#2A3C7C] p-6 mx-auto">
          <QrcodeVue :value="qrDetailBooking" :size="116"/>
        </div>

        <!-- Text -->
        <div class=" font-medium text-center mt-3 text-[#1F2937]">
          Scan <b>QR</b> di atas<br>
          untuk <b>Melihat Detail Virtual Account</b>
        </div>
      </div>
    </div>
  </div>
</template>