const menus = [
  {
    label: 'theNavbar.schedule',
    route: 'schedule',
    function: () => {}
  },
  {
    label: 'theNavbar.reservation',
    route: 'reservation',
    function: () => router.push({ name: 'reservation' })
  },
  {
    label: 'theNavbar.payment',
    route: 'payment',
    function: () => {}
  },
  {
    label: 'theNavbar.complete',
    route: 'completed',
    function: () => {}
  },
];

const navbarMenu = {
  reservation: [
    {
      label: 'theNavbar.schedule',
      route: 'schedule',
      function: () => {}
    },
    {
      label: 'theNavbar.reservation',
      route: 'reservation',
      function: () => router.push({ name: 'reservation' })
    },
    {
      label: 'theNavbar.payment',
      route: 'payment',
      function: () => {}
    },
    {
      label: 'theNavbar.complete',
      route: 'completed',
      function: () => {}
    },
  ],

  
}