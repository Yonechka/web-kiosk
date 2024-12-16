<script setup>
  import { onMounted, ref } from 'vue';

  const displayIcons = {
    info: '/images/ic_info_toast.png',
    failed: '/images/ic_failed_toast.png',
    success: '/images/ic_success_toast.png',
  }

  const props = defineProps({
    type: {
      type: String,
      default: 'info'
    },
    title: {
      type: String
    },
    message: {
      type: String,
      default: null
    }
  });

  const showToast = ref(false);
  showToast.value = true;

  const emits = defineEmits(['closeToast']);
  const closeToast = () => {
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
    setTimeout(() => {
      emits('closeToast');
    }, 3500);
  }
  
  onMounted(() => {
    closeToast();  
    console.log('Toast Mounted!');
  })
</script>

<template>
  
    <div 
      class="w-full h-full bg-[#000000CC] absolute flex justify-center items-center z-[99] toast"
      :class="[showToast ? 'activeToast' : '']"
    >
      <div
        class="w-[423px] min-h-[508px] bg-white flex flex-col justify-center items-center rounded-[20px] px-[20px] pt-[30px] pb-[45px]">
        <img :src="displayIcons[props.type]" class="mb-[30px]">
        <div class="text-center font-bold text-[32px]">
          {{ props.title }}
        </div>
        <div class="text-center font-medium text-[22px] mt-[15px]">
          {{ props.message }}
        </div>
      </div>
    </div>
</template>

<style>
  .toast {
    visibility: none;
    opacity: 0;
    transition: visibility 0s, opacity 0.1s linear;
  }

  .activeToast {
    visibility: visible;
    opacity: 1;
  }
</style>