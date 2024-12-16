import { useIntervalFn } from '@vueuse/core'

const useMidnightRefresh = () => {

  useIntervalFn(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // Check if the current time is exactly 00:00:00
    if (hours === 0 && minutes === 0 && seconds === 0) {
      
      location.reload(); // Refresh the page
    }
  }, 1000)
}

export default useMidnightRefresh;
