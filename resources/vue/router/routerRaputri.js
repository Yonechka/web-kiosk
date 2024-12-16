import { createWebHistory, createRouter } from 'vue-router'
import Features from '../config/features'
import Schedule from '@/views/pages/daytrans/Schedule.vue'
import Reservation from '@/views/pages/daytrans/Reservation.vue'
import Payment from '@/views/pages/daytrans/Payment.vue'
import Completed from '@/views/pages/daytrans/Completed.vue'
import Thanks from '@/views/pages/daytrans/Thanks.vue'
import ThanksDummy from '@/views/Dummy/Thanks.vue'
import SendEticket from '@/views/pages/daytrans/SendEticket.vue'
import Boarding from '@/views/pages/daytrans/Boarding.vue'
import Idle from '@/views/pages/daytrans/Idle.vue'
import PrintTicket from '@/views/pages/daytrans/PrintTicket.vue'

/* V2 Components */
import ScheduleV2 from '@/views/pages/v2/Schedule.vue'
import ReservationV2 from '@/views/pages/v2/Reservation.vue'
import PaymentV2 from '@/views/pages/v2/Payment.vue'
import CompletedV2 from '@/views/pages/v2/Completed.vue'
import ThanksV2 from '@/views/pages/v2/Thanks.vue'
import MemberCheck from '@/views/pages/v2/MemberCheck.vue';
import MemberDetail from '@/views/pages/v2/MemberDetail.vue';
import MemberRegister from '@/views/pages/v2/MemberRegister.vue';


const routes = [
  {
    path: '/raputri/:departureCode?',
    name: 'idle',
    component: Idle,
  },
  {
    path: '/raputri/schedule',
    name: 'schedule',
    component: Features.RAPUTRI.useV2 ? ScheduleV2 : Schedule,
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
    path: '/raputri/reservation',
    name: 'reservation',
    component: Features.RAPUTRI.useV2 ? ReservationV2 : Reservation,
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
    path: '/raputri/payment',
    name: 'payment',
    component: Features.RAPUTRI.useV2 ? PaymentV2 : Payment,
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
    path: '/raputri/completed',
    name: 'completed',
    component: Features.RAPUTRI.useV2 ? CompletedV2 : Completed,
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
    path: '/raputri/send-eticket',
    name: 'sendEticket',
    component: SendEticket
  },
  {
    path: '/raputri/print-ticket',
    name: 'printTicket',
    component: PrintTicket
  },
  {
    path: '/raputri/boarding',
    name: 'boarding',
    component: Boarding
  },
  {
    path: '/raputri/thanks',
    name: 'thanks',
    component: Features.RAPUTRI.useV2 ? ThanksV2 : Thanks,
  },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },

  /* Member */
  {
    path: '/raputri/member-check',
    name: 'memberCheck',
    component: MemberCheck
  },
  {
    path: '/raputri/member-detail',
    name: 'memberDetail',
    component: MemberDetail
  },
  {
    path: '/raputri/member-register',
    name: 'memberRegister',
    component: MemberRegister
  },

  /* DUMMY ROUTE, INTENDED FOR DEV ONLY */
  {
    path: '/raputri/dummy/thanks',
    name: 'thanksDummy',
    component: ThanksDummy,
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const routeAllow = ['boarding', 'idle', 'thanksDummy', 'sendEticket', 'printTicket'];
  if (!routeAllow.includes(to.name)) {
    if (from.name === undefined) {
      const departureCode = localStorage.getItem('departureCode');
      console.log('departureCode from route', departureCode);
      return { name: 'idle', params: { departureCode } }
    }
  }
})

export default router
