<script setup>
import { computed } from 'vue';
import { useMemberStore } from '@/store/MemberStore.js'
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import MemberLayout from '@/components/v2/Member/MemberLayout.vue';
import FormCard from '@/components/v2/Member/FormCard.vue';
import InputForm from '@/components/v2/Member/InputForm.vue';

const memberStore = useMemberStore();
const { memberDetail } = storeToRefs(memberStore);
const { t, d } = useI18n({ useScope: 'global' });
const member = computed(() => {
  return [
    {
      label: 'Nama',
      value: memberStore.memberDetail.data.name,
      ic: null,
      desc: null
    },
    {
      label: 'Nomor Telepon',
      value: memberStore.memberDetail.data.phoneNumb,
      ic: memberStore.memberDetail.data.verifiedPhoneNumb ? '/images/ic-checklist-green.svg' : null,
      desc: 'Nomor Telepon telah terverifikasi'
    },
    {
      label: 'Email',
      value: memberStore.memberDetail.data.email,
      ic: memberStore.memberDetail.data.verifiedEmail ? '/images/ic-checklist-green.svg' : null,
      desc: 'Email telah terverifikasi'
    },
    {
      label: 'Masa Kadaluwarsa',
      value: d(new Date(memberStore.memberDetail.data.expired), 'short'),
      ic: null,
      desc: null
    }
  ]
});
</script>

<template>
  <MemberLayout>
    

    <template #content>
      <FormCard>
        <template #header>
          Detail Member
        </template>
        <template #description>
          Selengkapnya detail data member
        </template>

        <!-- Forms -->
        <InputForm
          v-for="item in member"
          :value="item.value"
        >
          <template #label>
            {{ item.label }}
          </template>

          <template #icon v-if="item.ic">
            <img :src="item.ic" alt="ic-checklist-green">
          </template>

          <template #description v-if="item.desc">
            {{ item.desc }}
          </template>
        </InputForm>

        <hr class=" text-[#E5E7EB]">

        <div class=" w-full p-9 bg-[#F5F5F5] flex flex-col gap-7 items-center">
          <img
            v-if="memberDetail.data.memberType == 'Pelajar'"
            class="w-[180px]" src="@/assets/images/badge-pelajar.png"
            alt="badge-pelajar"
          >
          <img
            v-else-if="memberDetail.data.memberType == 'Korporat'"
            class="w-[180px]"
            src="@/assets/images/badge-corporate.png"
            alt="badge-corporate"
          >
          <img
            v-else
            class="w-[180px]"
            src="@/assets/images/badge-member.png"
            alt="badge-member"
          >
          <div class=" flex flex-col gap-[17px]">
            <span class=" text-xl font-medium text-[#1F2937] text-center">Member {{ memberDetail.data.memberType }}</span>
            <span class=" text-[#1F2937] text-center">Hemat Lebih Banyak dalam Perjalanan Anda dengan Tarif Khusus</span>
          </div>

          <div class=" w-full flex gap-9 justify-center items-center">
            <div class=" w-6/12 bg-white rounded-2xl py-6 text-center flex flex-col gap-[26px]">
              <span class=" text-xl">
                Total Point
              </span>
              <span class=" text-[40px] font-bold text-[#2A3C7C]">
                {{ memberDetail.data.point }}
              </span>
            </div>
            <div class=" w-6/12 bg-white rounded-2xl py-6 text-center flex flex-col gap-[26px]">
              <span class=" text-xl">
                Total Reward
              </span>
              <span class=" text-[40px] font-bold text-[#2A3C7C]">
                {{ memberDetail.data.pointReward }}
              </span>
            </div>
          </div>
        </div>
      </FormCard>
    </template>
  </MemberLayout>
</template>