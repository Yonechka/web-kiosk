<script setup>
import { ref } from 'vue';
import { 
  useCompleted
} from '@/composeable/thanks';
import { useRouter } from 'vue-router';

import Button from '@/components/v2/common/Button.vue';
import Card from '@/components/v2/Thank/RightSection/Card.vue';
import ModalDialogue from '@/components/v2/ModalDialogue.vue';

const router = useRouter();

/* Complete button handler */
const { complete } = useCompleted(router);

/* Modal Dialogue */
const isModalDialogueShow = ref(false);
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card/>
    <Button
      id="btnReservationComplete"
      @click="isModalDialogueShow = true"
    >
      {{ $t('thanks.done') }}
    </Button>

    <Transition>
      <ModalDialogue
        v-if="isModalDialogueShow"
        class=" z-10"
        @onClickCancel="isModalDialogueShow = false"
        @onClickConfirm="() => {
          isModalDialogueShow = false;
          complete();
        }"
      >
        <template #header>
          Konfirmasi Cetak Tiket
        </template>

        <template #content>
          <div class=" w-full flex flex-col gap-2">
            <span>Apakah Anda yakin ingin menyelesaikan reservasi ini?</span>
            <span>
              Setelah selesai, Anda tidak dapat kembali ke halaman sebelumnya. Pastikan semua informasi sudah benar sebelum melanjutkan.
            </span>
          </div>
        </template>
        
        <template #confirmCta>
          Selesai
        </template>

        <template #bottomSection>
          <div class=" w-full text-[#71747D]">
            Jika Anda memiliki pertanyaan, hubungi layanan bantuan kami.
          </div>
        </template>
      </ModalDialogue>
    </Transition>
    
  </div>
</template>