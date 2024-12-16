import { createWebHistory, createRouter } from 'vue-router'
import Features from '../config/features'
import Schedule from '../views/pages/jackal/Schedule.vue'
import Reservation from '../views/pages/jackal/Reservation.vue'
import Payment from '../views/pages/jackal/Payment.vue'
import Completed from '../views/pages/jackal/Completed.vue'
import Thanks from '../views/pages/jackal/Thanks.vue'
import ThanksDummy from '../views/Dummy/Thanks.vue'
import SendEticket from '../views/pages/jackal/SendEticket.vue'
import Boarding from '@/views/pages/daytrans/Boarding.vue'
import Idle from '../views/pages/jackal/Idle.vue'

/* V2 Components */
import ScheduleV2 from '@/views/pages/v2/Schedule.vue'
import ReservationV2 from '@/views/pages/v2/Reservation.vue'
import PaymentV2 from '@/views/pages/v2/Payment.vue'
import CompletedV2 from '@/views/pages/v2/Completed.vue'
import ThanksV2 from '@/views/pages/v2/Thanks.vue'

const routes = [
  {
    path: '/jackal/:departureCode?',
    name: 'idle',
    component: Idle,
  },
  {
    path: '/jackal/schedule',
    name: 'schedule',
    component: Features.JACKAL_HOLIDAYS.useV2 ? ScheduleV2 : Schedule,
    beforeEnter: (to, from) => {
      if (from.name === 'completed') {
        console.log(`routing from ${from.name} to ${to.name}`);
        return false;
      } else {
        console.log(`routing from ${from.name} to ${to.name}`);
        return true;
      }
    }
  },
  {
    path: '/jackal/reservation',
    name: 'reservation',
    component: Features.JACKAL_HOLIDAYS.useV2 ? ReservationV2 : Reservation,
    beforeEnter: (to, from) => {
      if (from.name === 'completed') {
        console.log('stop bang');
        return false;
      } else {
        console.log(from.name);
        return true;
      }
    }
  },
  {
    path: '/jackal/payment',
    name: 'payment',
    component: Features.JACKAL_HOLIDAYS.useV2 ? PaymentV2 : Payment,
    beforeEnter: (to, from) => {
      if (from.name !== 'reservation') {
        console.log(`routing from ${from.name} to ${to.name}`);
        return false;
      } else {
        console.log(`routing from ${from.name} to ${to.name}`);
        return true;
      }
    }
  },
  {
    path: '/jackal/completed',
    name: 'completed',
    component: Features.JACKAL_HOLIDAYS.useV2 ? CompletedV2 : Completed,
    beforeEnter: (to, from) => {
      if (from.name == 'payment' || from.name == 'reservation') {
        console.log(`routing from ${from.name} to ${to.name}`);
        return true;
      } else {
        console.log(`routing from ${from.name} to ${to.name}`);
        return false;
      }
    }
  },
  {
    path: '/jackal/send-eticket',
    name: 'sendEticket',
    component: SendEticket
  },
  {
    path: '/jackal/boarding',
    name: 'boarding',
    component: Boarding
  },
  {
    path: '/jackal/thanks',
    name: 'thanks',
    component: Features.JACKAL_HOLIDAYS.useV2 ? ThanksV2 : Thanks,
  },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },


  /* DUMMY ROUTE, INTENDED FOR DEV ONLY */
  {
    path: '/jackal/dummy/thanks',
    name: 'thanksDummy',
    component: ThanksDummy,
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const routeAllow = ['boarding', 'idle', 'thanksDummy', 'sendEticket'];
  if (!routeAllow.includes(to.name)) {
    if (from.name === undefined) {
      const departureCode = localStorage.getItem('departureCode');
      console.log('departureCode from route', departureCode);
      return { name: 'idle', params: { departureCode } }
    }
  }
})

export default router
