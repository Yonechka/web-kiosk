<script setup>
  const props = defineProps({
    bg: {
      type: String,
      default: 'bg-white'
    },
    isAbsolute: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: 'w-full h-full'
    },
    spinnerColor: {
      type: String,
      default: '#EB2C27'
    },
    zIndex: {
      type: String,
      default: 'z-[50]'
    },
    spinnerWrapperSize: {
      type: String,
      default: '80px',
    },
    spinnerSize: {
      type: String,
      default: '64px'
    },
    spinnerBorder: {
      type: String,
      default: '8px'
    },

  });
</script>

<template>
  <div
    :class="[props.bg, props.zIndex, props.isAbsolute ? 'absolute' : '', props.customClass]"
    class=" left-0 top-0 flex justify-center items-center"
  >
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<style scoped>
.lds-ring {
  display: inline-block;
  position: relative;
  width: v-bind(props.spinnerWrapperSize);
  height: v-bind(props.spinnerWrapperSize);
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: v-bind(props.spinnerSize);
  height: v-bind(props.spinnerSize);
  margin: 8px;
  border: v-bind(props.spinnerBorder) solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: v-bind(props.spinnerColor) transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>