<script setup>
import { ref } from 'vue';
import { useScheduleStore } from '@/store/ScheduleStore';
import { formatAccountNumber, removeStyleTag } from '@/utils';
import { useCheckPayment } from '@/composeable/payment';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  useChangePayment
} from '@/composeable/payment';

import ModalOverlay from '@/components/v2/ModalOverlay.vue';
import VirtualAccountInfoCard from './VirtualAccountInfoCard.vue';

const props = defineProps({
  name: String,
  imageSrc: String,
});

const router = useRouter();
const scheduleStore = useScheduleStore();
const { t } = useI18n({ useScope: 'global' });
const { checkPaymentStatus } = useCheckPayment(router, t);
const showModalHelp = ref(false);
const showModalHowToPay = ref(false);
const { changePayment } = useChangePayment();



const emits = defineEmits(['onClickChangeVaHandler']);
const html = "<!DOCTYPE html><html><head><title>Cara Pembayaran Melalui BCA Virtual Account</title><style type=\"text/css\">body {background-color:#ffffff;color: #777777;font-family: Arial;font-size: 13px;padding:5px;}h1 {text-align: center;font-size: 14px;}ul {margin-left: -20px;}ul li {padding: 3px 0;}a {text-decoration: none;color:blue;}a:hover{text-decoration: underline;}.red{color: red;}</style></head><body><h1>Cara Pembayaran Melalui BCA Virtual Account</h1><ol type=\"1\"><li><b>ATM</b></li><ol type=\"a\"><li>Pilih Menu <b>Transaksi Lainnya</b></li><li>Pilih <b>Transfer</b></li><li>Pilih <b>Ke rekening BCA Virtual Account.</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Pilih <b>Benar</b></li><li>Pilih <b>Ya</b></li><li>Ambil bukti bayar anda</li></ol><br/><li><b>Mobile Banking</b></li><ol type=\"a\"><li>Login Mobile Banking</li><li>Pilih <b>m-Transfer</b>.</li><li>Pilih <b>BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Send</b></li><li>Informasi VA akan ditampilkan</li><li>Klik <b>OK</b></li><li>Input <b>PIN</b> Mobile Banking</li><li>Bukti bayar ditampilkan</li></ol><br/><li><b>Internet Banking</b></li><ol type=\"a\"><li>Login Internet Banking.</li><li>Pilih <b>Transfer Dana</b></li><li>Pilih <b>Transfer Ke BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Lanjutkan</b></li><li>Input <b>Respon KeyBCA Appli 1</b></li><li>Klik <b>Kirim</b></li><li>Bukti bayar ditampilkan</li></ol></ol></body></html>";
const onClickChangeVaHandler = async () => {
  emits('onClickChangeVaHandler');
}

</script>

<template>
  <div class=" w-full flex justify-center items-center flex-col gap-4">
    <!-- Modal Help -->
    <teleport to='.appWrapper'>
      <Transition>
        <ModalOverlay
          v-show="showModalHelp"
          @on-click-close-modal-handler="showModalHelp = false"
        >
          <div class="w-[755px] h-[1447px] relative flex items-end pb-[96px]">
            <img src="@/assets/images/how-to-pay-va.png" alt="how-to-pay-va" class=" w-full h-full absolute top-0">
            <VirtualAccountInfoCard class=" z-10 mx-8" />
          </div>
          
        </ModalOverlay>
      </Transition>
    </teleport>

    <!-- Modal How To Pay -->
    <teleport to='.appWrapper'>
      <Transition>
        <ModalOverlay
          v-show="showModalHowToPay"
          @on-click-close-modal-handler="showModalHowToPay = false"
        >
          <div class="w-[755px] h-[1447px] text-[20px] bg-white rounded-l-[30px] pt-[60px] px-8 overflow-hidden pb-[56px] relative" >
            <div class=" w-full h-full overflow-y-auto  modalHowToPay" v-html="removeStyleTag(scheduleStore?.selectedVirtualAccount?.terms)"></div>
            <div class=" w-full h-[56px] bg-[#1976D3] absolute bottom-0 left-0 text-white text-sm font-medium flex items-center justify-center gap-1.5">
              <span>Powered By</span>
              <img src="@/assets/images/tiketux-logo.png" alt="tiketux-logo">
            </div>
          </div>
          
        </ModalOverlay>
      </Transition>
    </teleport>


    <!-- VA Name & CTA Change Va -->
    <div class=" w-full flex justify-between">
      <!-- Name & Image -->
      <div class=" flex items-center gap-1">
        <img
          :src="props.imageSrc"
          :alt="props.name"
          class=" w-10"
        >
        <span class=" font-semibold text-xl">
          {{ props.name }}
        </span>
      </div>

      <!-- Cta Change VA -->
      <div @click="onClickChangeVaHandler" class="cursor-pointer py-3 px-4 bg-white border border-[#0055BA] text-[#0055BA] rounded-xl text-sm font-semibold">
        Ubah Virtual Account
      </div>
    </div>

    <!-- No Virtual Account -->
    <div>
      <div class=" text-center mb-2">No. Virtual Account</div>
      <div
        class="text-[#0A374E] font-bold text-5xl py-2 tracking-tight"
        :class="`text-[${colors.primaryColor200}]`"
      >{{ formatAccountNumber(scheduleStore?.changePaymentInfo?.results?.kodePembayaran) }}</div>
    </div>

    <!-- CTA Check Payment Status -->
    <div
      @click="checkPaymentStatus"
      class="cursor-pointer py-2 px-4 border border-[#115B7F1A] rounded-xl text-sm font-semibold"
      :class="[`bg-[${colors.primaryColor20}]`, `text-[${colors.primaryColor200}]`]"
    >
      Cek Status Bayar
    </div>

    <!-- CTA How To Pay-->
    <div
      @click="showModalHowToPay = true"
      class="cursor-pointer py-3 px-4   text-white rounded-xl text-sm font-semibold"
      :class="`bg-[${colors.primaryColor200}]`"
    >
      Cara Pembayaran {{ props.name }}
    </div>

    <!-- Need Help Section -->
    <div class="needHelp w-full p-6 flex justify-between border border-[#9C771833] rounded-2xl relative overflow-hidden">
      <!-- Text -->
      <div class=" relative">
        <div class=" text-[#1F2937] font-semibold text-xl">Butuh Bantuan?</div>
        <div class="text-sm text-[#555555]">
          Jika Anda mengalami kendala, kami siap membantu.
        </div>
      </div>

      <!-- CTA -->
      <div
        @click="showModalHelp = true"
        class=" cursor-pointer p-4 bg-[#0A374E] text-white rounded-xl"
        :class="[`bg-[${colors.primaryColor200}]`]"
      >
        Bantuan
      </div>

      <!-- Stars Decoration -->
       <img src="@/assets/images/stars-yellow.svg" alt="stars-yellow" class=" absolute bottom-0 right-0 mr-[-13px] mb-[-7px]">
    </div>
  </div>
</template>

<style scoped>
.needHelp {
  background: linear-gradient(180deg, rgba(240, 213, 143, 0.25) 0%, rgba(187, 135, 0, 0.25) 100%);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.modalHowToPay :deep(h1) {
  color: #1976D3;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center; 
}

.modalHowToPay :deep(ol) {
  color: #1F2937;
  font-size: 20px;
}
</style>