import { onMounted } from "vue";
import { useScheduleStore } from "@/store/ScheduleStore";
import pingStatusConfig from "@/config/pingStatus";

let intervalId = null;
const usePingStatus = ({ clientId, outlet }) => {
  const env = document.querySelector('[name=environment]').content;
  const duration = 300000; // 5 minute
  const scheduleStore = useScheduleStore();

  const startPingStatusInterval = () => {
    const outletName = pingStatusConfig[clientId][outlet] ?? null;
    if (env !== 'production' || outlet === null || intervalId !== null || outletName === null) return;
    
    scheduleStore.pingStatusPut({ client_id: clientId, outlet: outletName })
    intervalId = setInterval(() => {
      scheduleStore.pingStatusPut({ client_id: clientId, outlet: outletName })
    }, duration);
  }
  
  startPingStatusInterval();
};

export default usePingStatus;