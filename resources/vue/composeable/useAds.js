import { onMounted, ref } from 'vue';
import { useScheduleStore } from '@/store/ScheduleStore';
import { useIntervalFn } from '@vueuse/core';
import Features from '@/config/features.js';
import { outletConfig } from '@/config/adsConfig';

const useAds = (clientId, route) => {
  const scheduleStore = useScheduleStore();
  const adsFullScreenRef = ref(null);

  const resetShowAdsDuration = () => {
    adsFullScreenRef?.value?.resetShowAdsHandler();
  }
  const getKioskIdentifier = () => {
    const fromQuery = route.query.adsIdentifier;

    if (fromQuery) localStorage.setItem('adsIdentifier', fromQuery);

    return localStorage.getItem('adsIdentifier');
  }

  const pingKioskAds = ({ ads, operator, kiosk }) => {
    if (getKioskIdentifier() && ads) {
      const kioskIdentifier = getKioskIdentifier();
      const adsIds = ads.map(ad => ad.id).join(',');
      const params = {
        operator,
        kiosk,
        code: kioskIdentifier,
        id_content: adsIds
      };
      console.log('params ping ads', params)
      scheduleStore.pingAds(params);
    } else {
      console.log('Should not ping ads', getKioskIdentifier());
    }
  }
  

  onMounted(() => {
    const fetchAndSetAds = async () => {
      /* Fetch Ads */
      const departureCode =  localStorage.getItem('departureCode') ?? route.params.departureCode;
      const operator = outletConfig[clientId].operator;
      const kiosk = outletConfig[clientId].kiosk[departureCode];
      const ads = await scheduleStore.getAds({ operator, kiosk });

      console.log('kiosk identifier', getKioskIdentifier());

      if (ads.status == 'ZERO_RESULT') {
        scheduleStore.ads = [];
        return
      }

      /* Conditionally set ads based on ads length array from store and new fetched ads */
      if (ads?.results?.list && scheduleStore.ads.length !== ads.results.list.length) {
        console.log('set new ads')
        scheduleStore.ads = ads.results.list;

        /* Ping new added Ads */
        pingKioskAds({ ads: ads.results.list, kiosk, operator});
      }
    }
    
  
    /* Conditionally fetch ads based on features.isAds */
    if (Features[clientId].isAds) {
      /* Initial Set ads */
      fetchAndSetAds();
  
      /* Call api ads every (n) minutes */
      useIntervalFn(() => {
        try {
          fetchAndSetAds();
        } catch (error) {
          console.log('on error set ads', error)
        }
        
      }, 60000)
    }
  })

  return { adsFullScreenRef, resetShowAdsDuration }
};

export default useAds;