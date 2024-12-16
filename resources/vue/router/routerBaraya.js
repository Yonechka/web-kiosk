import { createWebHistory, createRouter } from 'vue-router'
import Schedule from '../views/pages/daytrans/Schedule.vue'
import Reservation from '../views/pages/daytrans/Reservation.vue'
import Payment from '../views/pages/daytrans/Payment.vue'
import Completed from '../views/pages/daytrans/Completed.vue'
import Thanks from '../views/pages/daytrans/Thanks.vue'
import ThanksDummy from '../views/Dummy/Thanks.vue'
import SendEticket from '../views/pages/daytrans/SendEticket.vue'
import Boarding from '../views/pages/daytrans/Boarding.vue'
import Idle from '../views/pages/daytrans/Idle.vue'
import PrintTicket from '../views/pages/daytrans/PrintTicket.vue'


const routes = [
  {
    path: '/baraya/:departureCode?',
    name: 'idle',
    component: Idle,
  },
  {
    path: '/baraya/schedule',
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
    path: '/baraya/reservation',
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
    path: '/baraya/payment',
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
    path: '/baraya/completed',
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
    path: '/baraya/send-eticket',
    name: 'sendEticket',
    component: SendEticket
  },
  {
    path: '/baraya/print-ticket',
    name: 'printTicket',
    component: PrintTicket
  },
  {
    path: '/baraya/boarding',
    name: 'boarding',
    component: Boarding
  },
  {
    path: '/baraya/thanks',
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
    path: '/baraya/dummy/thanks',
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
