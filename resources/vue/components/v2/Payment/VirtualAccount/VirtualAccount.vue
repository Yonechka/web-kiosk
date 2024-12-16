<script setup>
import { useScheduleStore } from '@/store/ScheduleStore';
import VirtualAccountCards from './VirtualAccountCards.vue';
import VirtualAccountCard from './VirtualAccountCard.vue';
import VirtualAccountPayment from './VirtualAccountPayment.vue';
import ModalDialogue from '@/components/v2/ModalDialogue.vue';

import { computed, ref } from 'vue';
import {
  useChangePayment
} from '@/composeable/payment';

const vaDummy = [
  {
    "code": "wmandiriva",
    "name": "Mandiri Virtual Account",
    "group": "Virtual Account",
    "type_admin_fee": "Bulat",
    "admin_fee": 0,
    "image": "https://payment.tiketux.com/image/payment/mandiri-va.png",
    "image_v2": "https://payment.tiketux.com/image/payment_v2/mandiri-va.png",
    "terms": "<!DOCTYPE html><html><head><title>Cara Pembayaran Melalui BCA Virtual Account</title><style type=\"text/css\">body {background-color:#ffffff;color: #777777;font-family: Arial;font-size: 13px;padding:5px;}h1 {text-align: center;font-size: 14px;}ul {margin-left: -20px;}ul li {padding: 3px 0;}a {text-decoration: none;color:blue;}a:hover{text-decoration: underline;}.red{color: red;}</style></head><body><h1>Cara Pembayaran Melalui BCA Virtual Account</h1><ol type=\"1\"><li><b>ATM</b></li><ol type=\"a\"><li>Pilih Menu <b>Transaksi Lainnya</b></li><li>Pilih <b>Transfer</b></li><li>Pilih <b>Ke rekening BCA Virtual Account.</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Pilih <b>Benar</b></li><li>Pilih <b>Ya</b></li><li>Ambil bukti bayar anda</li></ol><br/><li><b>Mobile Banking</b></li><ol type=\"a\"><li>Login Mobile Banking</li><li>Pilih <b>m-Transfer</b>.</li><li>Pilih <b>BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Send</b></li><li>Informasi VA akan ditampilkan</li><li>Klik <b>OK</b></li><li>Input <b>PIN</b> Mobile Banking</li><li>Bukti bayar ditampilkan</li></ol><br/><li><b>Internet Banking</b></li><ol type=\"a\"><li>Login Internet Banking.</li><li>Pilih <b>Transfer Dana</b></li><li>Pilih <b>Transfer Ke BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Lanjutkan</b></li><li>Input <b>Respon KeyBCA Appli 1</b></li><li>Klik <b>Kirim</b></li><li>Bukti bayar ditampilkan</li></ol></ol></body></html>"
  },
  {
    "code": "wmandiriva",
    "name": "Mandiri Virtual Account",
    "group": "Virtual Account",
    "type_admin_fee": "Bulat",
    "admin_fee": 0,
    "image": "https://payment.tiketux.com/image/payment/mandiri-va.png",
    "image_v2": "https://payment.tiketux.com/image/payment_v2/mandiri-va.png",
    "terms": "<!DOCTYPE html><html><head><title>Cara Pembayaran Melalui BCA Virtual Account</title><style type=\"text/css\">body {background-color:#ffffff;color: #777777;font-family: Arial;font-size: 13px;padding:5px;}h1 {text-align: center;font-size: 14px;}ul {margin-left: -20px;}ul li {padding: 3px 0;}a {text-decoration: none;color:blue;}a:hover{text-decoration: underline;}.red{color: red;}</style></head><body><h1>Cara Pembayaran Melalui BCA Virtual Account</h1><ol type=\"1\"><li><b>ATM</b></li><ol type=\"a\"><li>Pilih Menu <b>Transaksi Lainnya</b></li><li>Pilih <b>Transfer</b></li><li>Pilih <b>Ke rekening BCA Virtual Account.</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Pilih <b>Benar</b></li><li>Pilih <b>Ya</b></li><li>Ambil bukti bayar anda</li></ol><br/><li><b>Mobile Banking</b></li><ol type=\"a\"><li>Login Mobile Banking</li><li>Pilih <b>m-Transfer</b>.</li><li>Pilih <b>BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Send</b></li><li>Informasi VA akan ditampilkan</li><li>Klik <b>OK</b></li><li>Input <b>PIN</b> Mobile Banking</li><li>Bukti bayar ditampilkan</li></ol><br/><li><b>Internet Banking</b></li><ol type=\"a\"><li>Login Internet Banking.</li><li>Pilih <b>Transfer Dana</b></li><li>Pilih <b>Transfer Ke BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Lanjutkan</b></li><li>Input <b>Respon KeyBCA Appli 1</b></li><li>Klik <b>Kirim</b></li><li>Bukti bayar ditampilkan</li></ol></ol></body></html>"
  },
  {
    "code": "wmandiriva",
    "name": "Mandiri Virtual Account",
    "group": "Virtual Account",
    "type_admin_fee": "Bulat",
    "admin_fee": 0,
    "image": "https://payment.tiketux.com/image/payment/mandiri-va.png",
    "image_v2": "https://payment.tiketux.com/image/payment_v2/mandiri-va.png",
    "terms": "<!DOCTYPE html><html><head><title>Cara Pembayaran Melalui BCA Virtual Account</title><style type=\"text/css\">body {background-color:#ffffff;color: #777777;font-family: Arial;font-size: 13px;padding:5px;}h1 {text-align: center;font-size: 14px;}ul {margin-left: -20px;}ul li {padding: 3px 0;}a {text-decoration: none;color:blue;}a:hover{text-decoration: underline;}.red{color: red;}</style></head><body><h1>Cara Pembayaran Melalui BCA Virtual Account</h1><ol type=\"1\"><li><b>ATM</b></li><ol type=\"a\"><li>Pilih Menu <b>Transaksi Lainnya</b></li><li>Pilih <b>Transfer</b></li><li>Pilih <b>Ke rekening BCA Virtual Account.</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Pilih <b>Benar</b></li><li>Pilih <b>Ya</b></li><li>Ambil bukti bayar anda</li></ol><br/><li><b>Mobile Banking</b></li><ol type=\"a\"><li>Login Mobile Banking</li><li>Pilih <b>m-Transfer</b>.</li><li>Pilih <b>BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Send</b></li><li>Informasi VA akan ditampilkan</li><li>Klik <b>OK</b></li><li>Input <b>PIN</b> Mobile Banking</li><li>Bukti bayar ditampilkan</li></ol><br/><li><b>Internet Banking</b></li><ol type=\"a\"><li>Login Internet Banking.</li><li>Pilih <b>Transfer Dana</b></li><li>Pilih <b>Transfer Ke BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Lanjutkan</b></li><li>Input <b>Respon KeyBCA Appli 1</b></li><li>Klik <b>Kirim</b></li><li>Bukti bayar ditampilkan</li></ol></ol></body></html>"
  },
  {
    "code": "wmandiriva",
    "name": "Mandiri Virtual Account",
    "group": "Virtual Account",
    "type_admin_fee": "Bulat",
    "admin_fee": 0,
    "image": "https://payment.tiketux.com/image/payment/mandiri-va.png",
    "image_v2": "https://payment.tiketux.com/image/payment_v2/mandiri-va.png",
    "terms": "<!DOCTYPE html><html><head><title>Cara Pembayaran Melalui BCA Virtual Account</title><style type=\"text/css\">body {background-color:#ffffff;color: #777777;font-family: Arial;font-size: 13px;padding:5px;}h1 {text-align: center;font-size: 14px;}ul {margin-left: -20px;}ul li {padding: 3px 0;}a {text-decoration: none;color:blue;}a:hover{text-decoration: underline;}.red{color: red;}</style></head><body><h1>Cara Pembayaran Melalui BCA Virtual Account</h1><ol type=\"1\"><li><b>ATM</b></li><ol type=\"a\"><li>Pilih Menu <b>Transaksi Lainnya</b></li><li>Pilih <b>Transfer</b></li><li>Pilih <b>Ke rekening BCA Virtual Account.</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Pilih <b>Benar</b></li><li>Pilih <b>Ya</b></li><li>Ambil bukti bayar anda</li></ol><br/><li><b>Mobile Banking</b></li><ol type=\"a\"><li>Login Mobile Banking</li><li>Pilih <b>m-Transfer</b>.</li><li>Pilih <b>BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Send</b></li><li>Informasi VA akan ditampilkan</li><li>Klik <b>OK</b></li><li>Input <b>PIN</b> Mobile Banking</li><li>Bukti bayar ditampilkan</li></ol><br/><li><b>Internet Banking</b></li><ol type=\"a\"><li>Login Internet Banking.</li><li>Pilih <b>Transfer Dana</b></li><li>Pilih <b>Transfer Ke BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Lanjutkan</b></li><li>Input <b>Respon KeyBCA Appli 1</b></li><li>Klik <b>Kirim</b></li><li>Bukti bayar ditampilkan</li></ol></ol></body></html>"
  },
  {
    "code": "wmandiriva",
    "name": "Mandiri Virtual Account",
    "group": "Virtual Account",
    "type_admin_fee": "Bulat",
    "admin_fee": 0,
    "image": "https://payment.tiketux.com/image/payment/mandiri-va.png",
    "image_v2": "https://payment.tiketux.com/image/payment_v2/mandiri-va.png",
    "terms": "<!DOCTYPE html><html><head><title>Cara Pembayaran Melalui BCA Virtual Account</title><style type=\"text/css\">body {background-color:#ffffff;color: #777777;font-family: Arial;font-size: 13px;padding:5px;}h1 {text-align: center;font-size: 14px;}ul {margin-left: -20px;}ul li {padding: 3px 0;}a {text-decoration: none;color:blue;}a:hover{text-decoration: underline;}.red{color: red;}</style></head><body><h1>Cara Pembayaran Melalui BCA Virtual Account</h1><ol type=\"1\"><li><b>ATM</b></li><ol type=\"a\"><li>Pilih Menu <b>Transaksi Lainnya</b></li><li>Pilih <b>Transfer</b></li><li>Pilih <b>Ke rekening BCA Virtual Account.</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Pilih <b>Benar</b></li><li>Pilih <b>Ya</b></li><li>Ambil bukti bayar anda</li></ol><br/><li><b>Mobile Banking</b></li><ol type=\"a\"><li>Login Mobile Banking</li><li>Pilih <b>m-Transfer</b>.</li><li>Pilih <b>BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Send</b></li><li>Informasi VA akan ditampilkan</li><li>Klik <b>OK</b></li><li>Input <b>PIN</b> Mobile Banking</li><li>Bukti bayar ditampilkan</li></ol><br/><li><b>Internet Banking</b></li><ol type=\"a\"><li>Login Internet Banking.</li><li>Pilih <b>Transfer Dana</b></li><li>Pilih <b>Transfer Ke BCA Virtual Account</b></li><li>Input Nomor Virtual Account, misal. 123456789012XXXX</li><li>Klik <b>Lanjutkan</b></li><li>Input <b>Respon KeyBCA Appli 1</b></li><li>Klik <b>Kirim</b></li><li>Bukti bayar ditampilkan</li></ol></ol></body></html>"
  },
];

const emits = defineEmits(['onClickVaHandler', 'onClickChangeVaHandler']);
const scheduleStore = useScheduleStore();
const showVaPayment = ref(false);
const selectedAttemptVaCode = ref(null);
const isModalShow = ref(false);
const { changePayment } = useChangePayment();

const attemptedVa = computed(() => {
  if (!selectedAttemptVaCode.value) return null
  return scheduleStore.virtualAccountPayment.find((va) => va.code == selectedAttemptVaCode.value);
});

const confirmVaChange = async () => {
  scheduleStore.selectedVirtualAccount = scheduleStore.virtualAccountPayment.find((va) => va.code == selectedAttemptVaCode.value);
  const result = await changePayment(scheduleStore.selectedVirtualAccount.code);
  if (!result) return;
  emits('onClickVaHandler');
  showVaPayment.value = true;
};

const onClickVaHandler = (code) => {
  if (code == scheduleStore?.selectedVirtualAccount?.code) {
    emits('onClickVaHandler');
    showVaPayment.value = true;
    return
  }
  isModalShow.value = true;
  selectedAttemptVaCode.value = code;

}

const onClickChangeVaHandler = () => {
  // scheduleStore.selectedVirtualAccount = null;
  emits('onClickChangeVaHandler');
  showVaPayment.value = false;
}

</script>

<template>
  <div class="w-full p-6 border border-[#E5E7EB] bg-[#FAFAFA] rounded-2xl">
    

    <!-- VA CARDS -->
    <div  v-show="!showVaPayment">
      <div class=" w-full text-center font-bold mb-8">
        Pilih Bank <b>Virtual Account</b>
      </div>
    
      <VirtualAccountCards>
        
        <VirtualAccountCard
          v-if="scheduleStore.virtualAccountPayment"
          v-for="va in scheduleStore.virtualAccountPayment"
          @on-click-va-handler="onClickVaHandler"
          :image-src="va.image_v2"
          :code="va.code"
        />
      </VirtualAccountCards>
    </div>

    <!-- VA Payment -->
    <VirtualAccountPayment
      v-if="showVaPayment && scheduleStore.selectedVirtualAccount"
      @on-click-change-va-handler="onClickChangeVaHandler"
      :image-src="scheduleStore.selectedVirtualAccount.image_v2"
      :name="scheduleStore.selectedVirtualAccount.name"
    />

    <Teleport to=".appWrapper">
      <Transition>
        <ModalDialogue
          v-if="isModalShow"
          @onClickCancel="isModalShow = false"
          @onClickConfirm="() => {
            isModalShow = false;
            confirmVaChange();
          }"
        >
          <template #content>
            Ubah metode pembayaran ke <span class=" font-bold text-[#1F2937] text-lg">{{ attemptedVa?.name }}</span>?
          </template>
        </ModalDialogue>
      </Transition>
    </Teleport>
  </div>
</template>