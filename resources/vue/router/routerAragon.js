import { createWebHistory, createRouter } from 'vue-router'
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

const routes = [
  {
    path: '/aragon/:departureCode?',
    name: 'idle',
    component: Idle,
  },
  {
    path: '/aragon/schedule',
    name: 'schedule',
    component: Schedule,
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
    path: '/aragon/reservation',
    name: 'reservation',
    component: Reservation,
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
    path: '/aragon/payment',
    name: 'payment',
    component: Payment,
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
    path: '/aragon/completed',
    name: 'completed',
    component: Completed,
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
    path: '/aragon/send-eticket',
    name: 'sendEticket',
    component: SendEticket
  },
  {
    path: '/aragon/print-ticket',
    name: 'printTicket',
    component: PrintTicket
  },
  {
    path: '/aragon/boarding',
    name: 'boarding',
    component: Boarding
  },
  {
    path: '/aragon/thanks',
    name: 'thanks',
    component: Thanks,
  },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },


  /* DUMMY ROUTE, INTENDED FOR DEV ONLY */
  {
    path: '/aragon/dummy/thanks',
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
