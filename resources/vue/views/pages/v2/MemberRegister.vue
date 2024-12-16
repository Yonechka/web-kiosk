<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { formattingDateYMD, formattingDateHuman, getNextYearDate } from '@/utils';
import { useMemberStore } from "@/store/MemberStore.js";
import { useRouter } from 'vue-router';
import VueDatePicker from '@vuepic/vue-datepicker';

import MemberLayout from '@/components/v2/Member/MemberLayout.vue';
import FormCard from '@/components/v2/Member/FormCard.vue';
import InputForm from '@/components/v2/Member/InputForm.vue';
import CheckboxForm from '@/components/v2/Member/CheckboxForm.vue';
import LetterKeyboard from '@/components/daytrans/completed/LetterKeyboard.vue';
import ToastCustom from '@/components/daytrans/ToastCustom.vue';

const router = useRouter();
const memberStore = useMemberStore();

const gender = [
  { label: 'Laki-laki', value: 0, isSelected: true },
  { label: 'Perempuan', value: 1, isSelected: false },
];

const forms = reactive([
  {
    id: 0,
    name: 'name',
    value: null,
    label: 'Nama Lengkap',
    placeholder: 'Nama Lengkap',
    type: 'input',
    isShow: false,
    validation: { validate: true, type: 'name' },
    maxLength: 35,
  },
  {
    id: 1,
    name: 'phoneNumb',
    value: null,
    label: 'Nomor Telepon',
    placeholder: '08xxxxxxx',
    type: 'input',
    isShow: false,
    validation: { validate: true, type: 'phoneNumb' },
    maxLength: 16
  },
  {
    id: 2,
    name: 'gender',
    value: [
      { label: 'Laki-laki', value: 0, isSelected: true },
      { label: 'Perempuan', value: 1, isSelected: false },
    ],
    label: 'Jenis Kelamin',
    placeholder: 'JK',
    type: 'checkbox',
  },
  {
    id: 3,
    name: 'birthPlace',
    value: null,
    label: 'Tempat Lahir',
    placeholder: 'Masukkan Tempat Lahir',
    type: 'input',
    isShow: false,
    validation: { validate: true, type: 'birthPlace' },
    maxLength: 16
  },
  {
    id: 4,
    name: 'birthDate',
    value: null,
    formatted: null,
    label: 'Tanggal Lahir',
    placeholder: 'Masukkan Tanggal Lahir',
    type: 'date',
    isShow: false
  },
  {
    id: 5,
    name: 'email',
    value: null,
    label: 'Email',
    placeholder: 'contoh@gmail.com',
    type: 'input',
    isShow: false,
    validation: { validate: true, type: 'email' },
    maxLength: 40
  },
  {
    id: 6,
    name: 'address',
    value: null,
    label: 'Alamat',
    placeholder: 'Masukkan Alamat Domisili',
    type: 'input',
    isShow: false,
    validation: { validate: true, type: 'address' },
    maxLength: 50
  },
  {
    id: 7,
    name: 'posCode',
    value: null,
    label: 'Kode Pos',
    placeholder: 'Masukkan Kode Pos Domisili',
    type: 'input',
    isShow: false,
    validation: { validate: true, type: 'posCode' },
    maxLength: 5
  },
  {
    id: 8,
    name: 'city',
    value: null,
    label: 'Kota',
    placeholder: 'Masukkan Kota Domisili',
    type: 'input',
    isShow: false,
    validation: { validate: true, type: 'city' },
    maxLength: 16
  },
  {
    id: 9,
    name: 'work',
    value: null,
    label: 'Pekerjaan',
    placeholder: 'Pekerjaan Saat Ini',
    type: 'input',
    isShow: false,
    validation: { validate: true, type: 'work' },
    maxLength: 16
  },
  {
    id: 10,
    name: 'memberType',
    value: memberStore.memberTypes?.data?.map((type, index) => ({ 
      label: type.name,
      value: type.code,
      isSelected: index == 0 ? true : false
    })) ?? [], 
    label: 'Jenis Member',
    placeholder: 'JM',
    type: 'checkbox',
  },
]);


const updateFormValue = (index, newValue) => {
  console.log(forms[index].label)
  forms[index].value = newValue;
  forms[index].isShow = false;
}

const onChangeCheckbox = (indexForm, indexCheckbox) => {
  forms[indexForm].value.forEach((item) => item.isSelected = false);
  forms[indexForm].value[indexGender].isSelected = true
}

const onChangeDate = (index, newDate) => {
  forms[index].value = formattingDateYMD(newDate);
  forms[index].formatted = formattingDateHuman(newDate);
  forms[index].isShow = false;
}

const isFormFilled = computed(() => {
  return forms.filter((form) => form.type == 'input').every((input) => input.value);
});

const onSubmitAction = async () => {
  const params = forms.reduce((acc, item) => {
    if (item?.type == 'input') {
      acc[item.name] = item.value;
    }

    if (item?.type == 'checkbox') {
      acc[item.name] = item.value.find(data => data.isSelected).value;
    }
    return acc;
  }, {});

  const expired = formattingDateYMD(getNextYearDate());
  params.expiredDate = expired;

  const result = await memberStore.postMemberRegister({ params });
}

const ctaAction = computed(() => {
 return isFormFilled.value ? onSubmitAction : () => { console.log('not filled') }}
);

const successCard = computed(() => {
  return [
    {
      label: 'Kode Member',
      value: memberStore?.memberRegister?.data?.memberCode ?? null
    },
    {
      label: 'Nama',
      value: forms?.find(form => form.name == 'name')?.value ?? null
    },
    {
      label: 'Jenis Member',
      value: forms?.find(form => form.name == 'memberType')?.value.find((item) => item.isSelected)?.value ?? null
    },
    {
      label: 'No Telepon',
      value: forms?.find(form => form.name == 'phoneNumb')?.value ?? null
    }
  ]
});

const toMemberCheck = () => {
  router.push({ name: 'memberCheck' })
}

</script>

<template>
  <div class=" w-full h-full">
    <Teleport to=".appWrapper">
      <transition>
        <ToastCustom
          v-if="memberStore.memberRegister.error"
          type="failed"
          title="Registrasi Member Gagal"
          :message="memberStore.memberRegister.error"
          @closeToast="memberStore.memberRegister.error = false"
        />
      </transition>
    </Teleport>
    <MemberLayout v-if="!memberStore?.memberRegister?.data?.memberCode" >
      <template #content>
        <FormCard>
          <!-- Label Header -->
          <template #header>
            Daftar Member
          </template>
          <template #description>
            Daftar sebagai Member untuk Akses Keuntungan dan Penawaran Eksklusif
          </template>

          <template v-for="(form, index) in forms">
            <!-- Text -->
            <InputForm
              v-if="form.type == 'input'"
              @click="forms[index].isShow = true"
              :value="form.value"
              :placeHolder="form.placeholder"
              :maxLength="form.maxLength"
            >
              <template #label>
                {{ form.label }}
              </template>
            </InputForm>

            <!-- Checkbox -->
            <CheckboxForm
              v-if="form.type == 'checkbox'"
              @change="onChangeCheckbox(index, $event)"
              :value="form.value"
            >
              <template #label>
                {{ form.label }}
              </template>
            </CheckboxForm>

            <!-- Date -->
            <div
              v-if="form.type == 'date'"
              class=" relative"
            >
              <InputForm
                @click="form.isShow = true"
                :value="form.formatted"
                :placeHolder="form.placeholder"
              >
                <template #label>
                  {{ form.label }}
                </template>
              </InputForm>
              <div
                v-show="form.isShow"
                class="absolute left-[-10px] bottom-[90px] border-[2px] rounded-[14px] pt-[15px]"
                :class="`bg-[${colors.secondaryColor}]`"
              >
                <VueDatePicker
                  inline auto-apply
                  :max-date="new Date()"
                  :enable-time-picker="false"
                  @update:model-value="onChangeDate(index, $event)"
                />
              </div>

            </div>
          </template>

          <button
            @click="ctaAction"
            class=" w-full text-center py-[14px] rounded-2xl text-white text-2xl font-medium"
            :class="[ isFormFilled ? `bg-[${colors.primaryColor}]` : 'bg-[#71747D]' ]"
          >
            Daftar Member
          </button>
        </FormCard>

        <LetterKeyboard
          v-for="(form, index) in (forms.filter((form) => form.type == 'input'))"
          :key="form.label"
          :value="form.value"
          :isShow="form.isShow"
          :placeholderValue="form.placeholder"
          :validation="form.validation"
          :maxLength="form.maxLength"
          @updatingValue="($event) => { 
            form.value = $event
            form.isShow = false
          }"
          @closeKeyboard="form.isShow = false"
        />
      </template>
    </MemberLayout>

    <div v-else class=" w-full">
      <div class=" w-full h-fit p-8 bg-white rounded-[36px] flex flex-col justify-center items-center gap-8 mb-8">
        <div class=" text-[#1F2937] font-semibold text-2xl">Pendaftaran Member Berhasil</div>

        <img src="@/assets/images/ic_checklist_xl.png" alt="ic_checklist_x">

        <div class=" w-full flex flex-col gap-3 h-fit text-2xl font-medium">
          <div v-for="item in successCard" class=" w-full flex">
            <div class=" w-6/12 flex justify-between">
              <span>{{ item?.label }}</span>
              :
            </div>
            <div class=" w-6/12 text-end">
              {{ item?.value }}
            </div>
          </div>
        </div>

        <div class=" w-full text-center text-[#1F2937] font-medium text-2xl">
          Terima kasih telah mendaftar! Klik tombol di bawah untuk kembali ke halaman utama.
        </div>
      </div>

      <div @click="toMemberCheck" class=" w-full py-[14px] rounded-2xl font-semibold text-2xl bg-white text-[#1F2937] text-center">
        Selesai
      </div>
    </div>
  </div>
</template>