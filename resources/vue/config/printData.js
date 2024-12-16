/* Additional data for printing by Operator */
const smallTextPlus = '8px';
const fontMedium = '600';
const defaultStyle = { fontSize: smallTextPlus, textAlign: 'center', fontWeight: fontMedium }
const defaultStyleLast = { ...defaultStyle, paddingBottom: '80px' }
const printData = {
  JACKAL_HOLIDAYS: [
    {
      value: 'ticket.jackal.complaint',
      style: defaultStyle,
    },
    {
      value: '08112236900',
      style: defaultStyle,
    },
    {
      value: 'IG @jackalholidaysgroup',
      style: defaultStyle,
    },
    {
      value: 'ticket.jackal.service',
      style: defaultStyle,
    },
    {
      value: 'ticket.jackal.bus',
      style: defaultStyleLast
    }
  ],
  DAYTRANS: [
    {
      value: 'ticket.daytrans.thanks',
      style: defaultStyleLast
    },
  ],
  BARAYA: [
    {
      value: 'ticket.baraya.thanks',
      style: defaultStyleLast
    },
  ],
  BTM: [
    {
      value: 'ticket.btm.thanks',
      style: defaultStyleLast
    },
  ],
  ARAGON: [
    {
      value: 'ticket.aragon.thanks',
      style: defaultStyleLast
    }
  ],
  KRUZZ: [
    {
      value: 'ticket.kruzz.thanks',
      style: defaultStyleLast
    }
  ],
  CONNEX: [
    {
      value: 'ticket.connex.thanks',
      style: defaultStyleLast
    }
  ],
  RAPUTRI: [
    {
      value: 'ticket.raputri.thanks',
      style: defaultStyleLast
    }
  ],

};

export default printData;
