import { ref } from 'vue';
import { useIntervalFn } from '@vueuse/core';

const useRedirectToIdle = ({ router, durationSec = 120 }) => {
  const remainingDurationSec = ref(durationSec);
  const { pause } = useIntervalFn(() => {
    remainingDurationSec.value -= 1;
    console.log(remainingDurationSec.value);

    if (remainingDurationSec.value <= 0) {
      pause();
      router.push({ name: 'idle' });
    }
  }, 1000);

  const resetRemainingTimeout = () => {
    remainingDurationSec.value = durationSec;
  };

  return { remainingDurationSec, resetRemainingTimeout };
}

export default useRedirectToIdle;