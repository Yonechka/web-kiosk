import { ref } from 'vue';

/* Payment Success Countdown */
export const useCountDown = (duration = 5, onComplete = function(){}) => {
  let intervalCountDown;
  let countDownDuration = ref(duration);

  const skipCountDown = async () => {
    clearInterval(intervalCountDown);
    console.log('done bang');
    onComplete();
  }

  const countDown = async () => {
    if (countDownDuration.value > 0) {
      countDownDuration.value--;
    } else {
      skipCountDown();
    }
  }

  const startInterval = () => {
    if (!intervalCountDown) {
      intervalCountDown = setInterval(countDown, 1000);
    }
  }

  

  return {
    countDownDuration,
    countDown,
    startInterval,
    skipCountDown
  };

}