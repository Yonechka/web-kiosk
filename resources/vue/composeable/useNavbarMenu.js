const useNavbarMenu = (router, type = 'reservation') => {
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
  
    member: [
      {
        label: 'theNavbar.member.labelCheck',
        route: 'memberCheck',
        function: () => router.push({ name: 'memberCheck' })
      },
      {
        label: 'theNavbar.member.labelDetail',
        route: 'memberDetail',
        function: () => {}
      },
    ]
  };

  const menu = navbarMenu[type];
  return { menu }
};

export default useNavbarMenu;