<script setup>
import { computed, ref } from 'vue';
import axios from 'axios';
import "vanilla-jsoneditor/themes/jse-theme-dark.css";
import JsonEditorVue from 'json-editor-vue';
import { getNestedValue } from '@/utils';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import printDataDummy from '@/data/printDataDummy.js';

const value = ref('');
const isJsonError = ref(true);
const type = ref('json');

/* Json Change Handler */
const objectChange = (
  content,
  prev,
  changeStatus
) => {
  // value.value = content.text;
  isJsonError.value = (changeStatus.contentErrors || !content.text)
};

/* Print JSON Handler */
const print = (preview = false) => {
  const payload = {
    preview,
    data: JSON.parse(value.value)
  }
  window.electronAPI.setPrinting(payload)
    .then((data) => {
      console.log('this is print response', data);
      if (!data.status) {
        toast.error(data.message, {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
          icon: false
        });
      }
    })
    .catch((error) => {
      toast.error('Terjadi Kesalahan saat proses printing', {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        icon: false
      });
    })
}

/* Print API Handler */
const url = ref(null);
const identifier = ref(null);
const token = ref(null);
const printWithApi = async (preview = false) => {
  try {
    const result = (await axios.get('/api/print-test', {
      params: {
        url: url.value,
        token: token.value
      }
    }))?.data ?? null;
    if (!result) {
      toast.error('Terjadi Kesalahan saat fetch api', {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        icon: false
      });
      return
    };

    let data;
    identifier.value ? data = getNestedValue(result, identifier.value) : data = result;
    if (!data || data.length <= 0) {
      toast.error('Data tidak ditemukan, harap periksa lagi form identifier!', {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        icon: false
      });
      return
    };

    const payload = {
      preview,
      data
    }

    window.electronAPI.setPrinting(payload)
      .then((data) => {
        console.log(data);
        if (!data.status) {
          toast.error(data.message, {
            position: toast.POSITION.TOP_CENTER,
            theme: 'colored',
            icon: false
          });
        }
      })
      .catch((error) => {
        toast.error('Terjadi Kesalahan saat proses printing', {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
          icon: false
        });
      })
  } catch (error) {
    console.log('error exios', error);
    toast.error(error?.response?.data?.message ?? 'Error Occured', {
      position: toast.POSITION.TOP_CENTER,
      theme: 'colored',
      icon: false
    });
  }

  
}

/* Example CTA handler */
const useExampleHandler = () => {
  
  isJsonError.value = false;
  if (type.value == 'json') {
    value.value = JSON.stringify(printDataDummy);
  } else {
    url.value = window.location.origin + '/api/print-data-dummy';
    identifier.value = 'tiketux.result';
    token.value = 'someRandomString'
    value.value = JSON.stringify({
      kode_booking: 'BCNX93829933',
      otp: '12849'
    })
  }
}

/* Print CTA Dynamic */
const printCTA = (preview) => type.value == 'json' ? print(preview) : printWithApi(preview);

/* Validation Button Print CTA */
const isValid = computed(() => {
  if (type.value == 'json') return !isJsonError.value;

  return (!isJsonError.value && url.value && identifier.value);
});

const logoutHandler = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('departureCode');
  window.electronAPI.logout();
}


</script>

<template>
  <div class=" w-full h-fit bg-[#343434] relative">
    <button @click="logoutHandler" class=" p-2 absolute top-2 left-2 bg-[#FFE500] text-[#1F2937] font-medium rounded-xl">
      Logout
    </button>
    <div class=" w-full min-h-screen container mx-auto py-8">
      <div class=" flex items-center gap-3 mx-auto w-fit mb-3">
        <div>
          <input @change="value = ''" type="radio" id="json" value="json" class=" mr-2" v-model="type" />
          <label class=" text-white text-lg font-medium" for="json">Raw Json</label>
        </div>
        <div>
          <input @change="value = ''" type="radio" id="api" value="api" class=" mr-2" v-model="type" />
          <label class=" text-white text-lg font-medium" for="api">API</label>
        </div>
      </div>
      <JsonEditorVue
        v-if="type == 'json'"
        v-model="value"
        mode="text"
        class="jse-theme-dark w-[80%] mx-auto h-full max-h-[70vh] overflow-y-auto"
        :main-menu-bar="false"
        :navigation-bar="false"
        :status-bar="false"
        :onChange="(updated, prev, changeStatus) => { objectChange(updated, prev, changeStatus) }"
        :escape-control-characters="true"
        :escape-unicode-characters="true"

      />

      <div v-else class=" text-white w-[40%] mx-auto h-fit flex flex-col gap-3">
        <div class=" flex gap-3">
          <div class=" flex flex-col gap-1 w-full">
            <label class=" font-medium">Url</label>
            <input v-model="url" type="text" class=" outline-none border-none text-[#1F2937] w-full px-2 py-1 rounded">
          </div>
          <div class=" flex flex-col gap-1 w-full">
            <label class=" font-medium">Identifier</label>
            <input v-model="identifier" type="text" class=" outline-none border-none text-[#1F2937] w-full px-2 py-1 rounded">
          </div>
        </div>

        <div class="w-[50%]">
          <div class=" flex flex-col gap-1 w-full">
            <label class=" font-medium">Token</label>
            <input v-model="token" type="text" class=" outline-none border-none text-[#1F2937] w-full px-2 py-1 rounded">
          </div>
        </div>

        <div class="flex flex-col gap-1 w-full">

          <label class=" text-white font-medium">
            Params
          </label>
          <JsonEditorVue
            v-model="value"
            mode="text"
            class="jse-theme-dark w-full mx-auto h-full max-h-[400px] overflow-y-auto"
            :main-menu-bar="false"
            :navigation-bar="false"
            :status-bar="false"
            :onChange="(updated, prev, changeStatus) => { objectChange(updated, prev, changeStatus) }"
            :escape-control-characters="true"
            :escape-unicode-characters="true"
          />
        </div>
      </div>

      <div class=" w-full flex justify-center gap-3 mt-4">
        <button
          @click="printCTA(false)"
          class=" bg-[#FFE500] text-[#1F2937] w-fit py-1 px-4 font-bold rounded-lg text-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-white"
          :disabled="!isValid"
        >
          Print
        </button>

        <button
          @click="printCTA(true)"
          class=" bg-[#FFE500] text-[#1F2937] w-fit py-1 px-4 font-bold rounded-lg text-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-white"
          :disabled="!isValid"
        >
          Preview
        </button>
        <button
          @click="useExampleHandler"
          class=" bg-[#FFE500] text-[#1F2937] w-fit py-1 px-4 font-bold rounded-lg text-lg disabled:cursor-not-allowed "
        >
          Use Example
        </button>
      </div>
    </div>
  </div>
</template>