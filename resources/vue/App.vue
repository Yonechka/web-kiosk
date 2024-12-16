<script setup>
  import { ref, watch, onActivated } from 'vue';  
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from './store/Store';

  import Home from './views/pages/jackal/Home.vue';
  import TheNavBar from './components/jackal/TheNavBar.vue';  
  import LetterKeyboard from './components/jackal/LetterKeyboardApp.vue';
  import NetworkIndicator from '@/components/NetworkIndicator.vue';
  import NoInternetScreen from '@/components/NoInternetScreen.vue';
  import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';

  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';

  const routeNoNavbar = ['thanks', 'idle'];
  const routeWithNetworkIndicator = ['idle', 'boarding', 'thanks'];
  const route = useRoute();
  const router = useRouter();
  const store = useStore();
  const showSpinner = ref(false);

  /* Refresh The Application */
  let isPasswordField = ref(false);
  const password = ref(null);
  const passwordRefreshApp = document.querySelector('[name=passwordRefreshApp]').content;
  const passwordLogout = document.querySelector('[name=passwordLogout]').content;
  const passwordManualSettlement = document.querySelector('[name=passwordManualSettlement]').content;
  const showPasswordField = () => isPasswordField.value = true;
  const updatePasswordValue = (newValue) => {
    if (newValue == passwordRefreshApp) {
      console.log('password true');
      window.location.reload();
      return;
    };

    if (newValue == passwordLogout) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('departureCode');
      window.electronAPI.logout();
    }

    if (newValue == passwordManualSettlement) {
      window.electronAPI.manualEdcSettlement();
    }

    if (newValue == '020304') {
      showSpinner.value = true;
      try {
        let payload = {
          transactionType:"01",
          transactionAmount: 1,
          pan: '                   ',
          expireDate: '    ',
        };
        window.electronAPI.createPaymentEdc(payload)
          .then(async (data) => {
            showSpinner.value = false;
            if (data.status != 1 || data.response["Response Code"] != "00") {
              toast.error('Payment Failed or Cancelled!', {
                position: toast.POSITION.TOP_CENTER,
                theme: 'colored',
                icon: false
              });
              
              return
            }
            
            toast.success('Payment Success!', {
              position: toast.POSITION.TOP_CENTER,
              theme: 'colored',
              icon: false
            });
          })
          .catch((error) => {
            toast.success('Payment Failed!', {
              position: toast.POSITION.TOP_CENTER,
              theme: 'colored',
              icon: false
            });
            showSpinner.value = false;
          });
      } catch (error) {
        toast.success('Payment Failed!', {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
          icon: false
        });
        showSpinner.value = false;
      }
    }

    password.value = null;
    isPasswordField.value = false;
  };
  const closePasswordKeyboard = () => isPasswordField.value = false;

  let clickCount = 0;
  let clickTimeout;
  const clickThreeTimes = () => {
    clickCount++;
    if (clickCount === 3) {
      console.log('Element clicked three times!');
      isPasswordField.value = true;
      clickCount = 0;
    }

    // Clear the previous timeout and set a new one
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      clickCount = 0;
    }, 500);
  }

  /* Route To Idle After 5 Minutes With No Activity */
  const currentRoute = ref(null);
  let idlingDuration = 60 * 5 ;
  let idlingCountDown = ref(idlingDuration);
  let intervalIdling;

  const idlingReset = () => {
    if (currentRoute.value == 'schedule' || currentRoute.value == 'boarding') {
      idlingCountDown.value = idlingDuration;
    }
  }

  const intervalIdlingFunc = () => {
    if (idlingCountDown.value > 0) {
      idlingCountDown.value--
    } else {
      clearInterval(intervalIdling);
      intervalIdling = null;
      store.isReset = true;
      const departureCode = localStorage.getItem('departureCode');
      router.push({ name: 'idle', params: { departureCode }});
    }
  }

  const startIntervalIdling = () => {
    intervalIdling = setInterval(intervalIdlingFunc, 1000)
  }

  watch(() => route.name, () => {
    currentRoute.value = route.name;
    if (route.name == 'schedule' || route.name == 'boarding') {
      if (!intervalIdling) {
        startIntervalIdling();
      }
    } else {
      idlingCountDown.value = idlingDuration;
      clearInterval(intervalIdling);
      intervalIdling = null;
    }
  }, { immediate: true, deep: true });
</script>

<template>
  <img :src="images.logoSecondary" class="mx-auto w-[377px] mb-6 hidden">
  
  <div class="mx-auto relative">
    <OverlaySpinner
      :spinnerColor="colors.primaryColor"
      bg="bg-[#0000003f]"
      v-show="showSpinner"
    />
    <div @click="idlingReset" @input="idlingReset" class="appWrapper mx-auto w-[1080px] flex relative">
        <!-- <div class=" absolute top-0 left-0 text-[red] text-2xl z-[100]">
          {{ idlingCountDown }}
        </div> -->
        <NetworkIndicator
          v-show="routeWithNetworkIndicator.includes($route.name)"
          class="absolute top-[20px] right-[20px] z-[99]"
        />
        <NoInternetScreen/>
        <div
          @click="clickThreeTimes"
          class="z-[100] absolute top-0 right-0 p-[10px] w-[40px] h-[40px] opacity-0">
        </div>
        <TheNavBar v-if="!routeNoNavbar.includes($route.name)" />
        <div :class="[ !routeNoNavbar.includes($route.name) ? `bg-[${colors.primaryColor}]` : '' ]" class="w-[757px]  h-[1920px] px-[56px] relative">
          <!-- <Home/> -->
          <Suspense>
            <router-view  v-slot="{ Component }">
              <keep-alive include="Schedule, Reservation">
                <component :is="Component"></component>
              </keep-alive> 
            </router-view>
          </Suspense>
        </div>
        <LetterKeyboard
          placeholderValue="Enter Value"
          :value="password"
          :isShow="isPasswordField"
          @updatingValue="updatePasswordValue"
          @closeKeyboard="closePasswordKeyboard"
        />
    </div>
  </div>
</template>


<style>

  .place-card {
    display: none !important;
  }
  .gm-style .place-card {
    display: none !important;
  }
  .place-card-large {
    display: none !important;
  }
  :root {
    --toastify-color-warning: #f1c40f;
    --toastify-toast-width: auto !important;
    color-scheme: light only;
  }


  *{
    user-select: none;
  }
  body {
    position: relative;
    font-family: "Poppins", sans-serif;
  }

  .nested-enter-active .inner,
  .nested-leave-active .inner {
    transition: all 0.3s ease-in-out;
  }

  .nested-enter-from .inner,
  .nested-leave-to .inner {
    transform: translateX(30px);
    opacity: 0;
  }

      /* width */
::-webkit-scrollbar {
  width: 10px;
  height: 90% !important;
  margin-left: -20px !important;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f100;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555555;
}
.Toastify__toast-container--top-center{
  top: 300px !important;
}


</style>

