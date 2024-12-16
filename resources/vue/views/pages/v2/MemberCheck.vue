<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from "@/store/MemberStore.js";
import MemberLayout from '@/components/v2/Member/MemberLayout.vue';
import FormCard from '@/components/v2/Member/FormCard.vue';
import ToastCustom from '@/components/daytrans/ToastCustom.vue';

import useCheckMember from '@/composeable/member/useCheckMember.js'
import LetterKeyboard from '@/components/daytrans/completed/LetterKeyboard.vue';


const router = useRouter();
const {
  phoneNumb, isKeyboardShow, placeHolderForm, dynamicClassInput, updatePhoneNumbField, onClickSubmitHandler
} = useCheckMember(router);

const memberStore = useMemberStore();

onMounted(async() => {
  memberStore.$reset();
  await memberStore.getMemberTypes();
})

</script>

<template>
  <MemberLayout>
    
    <template #content>
      <Teleport to=".appWrapper">
        <transition>
          <ToastCustom
            v-if="memberStore.memberDetail.error"
            type="failed"
            title="Check Member Gagal"
            :message="memberStore.memberDetail.error"
            @closeToast="memberStore.memberDetail.error = false"
          />
        </transition>
      </Teleport>
      <FormCard>
        <!-- Label Header -->
        <template #header>
          Masukkan No Telepon
        </template>
        <template #description>
          Masukkan 12 digit no telepon
        </template>

        <!-- Form -->
        <div
          @click="isKeyboardShow = true"
          class=" w-full py-[30px] rounded-[18px] bg-white border px-6"
          :class="[ dynamicClassInput, `border-[${colors.primaryColor}]` ]"
        >
          {{ phoneNumb ?? placeHolderForm }}
        </div>

        <!-- Button -->
        <button
          @click="onClickSubmitHandler"
          class=" w-full rounded-2xl py-4 text-2xl font-bold text-white"
          :class="[ phoneNumb ? `bg-[${colors.primaryColor}]` : 'bg-[#71747D]' ]"
        >
          Kirim
        </button>
      </FormCard>

      <!-- Card -->
      <div class=" w-full rounded-[35px] bg-white py-[47px] px-8 flex gap-4">
        <div class=" flex-1 text-[30px] font-medium text-[#1F2937] flex items-center justify-start">
          <div>
            <span>
              Belum Jadi Member?
            </span>
            
            <button
              @click="router.push({ name: 'memberRegister' })"
              class=" p-4 flex gap-[1.5px] text-lg font-semibold text-white mt-4 rounded-[37px]"
              :class="[ `bg-[${colors.primaryColor}]` ]"
            >
              <img src="@/assets/images/ic-member-register.svg" alt="ic-member-register">
              Daftar Menjadi Member
            </button>
          </div>
        </div>

        <div class="w-[207px] flex justify-center items-center">
          <img src="@/assets/images/member-register-illustration.svg" alt="member-register-illustraion">
        </div>
      </div>

      <LetterKeyboard
        :placeholderValue="placeHolderForm"
        :value="phoneNumb"
        :isShow="isKeyboardShow"
        :validation="{ validate: true, type: 'phoneNumb' }"
        :disable-special-char="true"
        id="phoneNumb"
        @updatingValue="updatePhoneNumbField"
        @closeKeyboard="isKeyboardShow = false"
      />
    </template>

    
  </MemberLayout>
  
</template>