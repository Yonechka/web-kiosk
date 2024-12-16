<script setup>
const emit = defineEmits(['retryOnClick']);

const props = defineProps({
    bg: {
      type: String,
      default: 'bg-[#EB2C27]'
    },
    textColor: {
      type: String,
      default: 'text-white'
    },
    bgButton: {
      type: String,
      default: 'bg-[#00990F]'
    },
  });

const retryHandle = () => {
  emit('retryOnClick')
}

</script>

<template>
  <div
    class="w-full h-full absolute top-0 left-0 z-[55] flex justify-center items-center"
    :class="[props.bg]"
  >
    <span class=" text-[30px]" :class="[props.textColor]">
      {{ $t('errorState.message') }} <br><br>
      <div
        @click="retryHandle"
        class="p-[20px] text-white rounded-md text-center"
        :class="[props.bgButton]"
      >
        {{ $t('errorState.cta') }}
      </div>
      
    </span>
  </div>
</template>