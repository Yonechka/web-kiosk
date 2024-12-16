import printData from "../config/printData";

export const dataGrouping = (data, groupedBy) => {
  return data.reduce((curr, pool) => {
    const current = curr;
    if (current.filter((item) => item[groupedBy] === pool[groupedBy]).length === 0) {
      current.push({ [groupedBy]: pool[groupedBy], pools: [{ ...pool }] });
    } else {
      current
        .find((item) => item[groupedBy] === pool[groupedBy])
        .pools.push({ ...pool });
    }
    return current;
  }, [])
};

export const addIsSelectedProperty = (data, selectFirstIndex = true) => {
  data.forEach((item, index) => {
    if (selectFirstIndex) {
      index === 0 ? item.isSelected = true : item.isSelected = false;
    } else {
      item.isSelected = false;
    }
  });
}

export const formattingNumber = (number) =>  new Intl.NumberFormat('id').format(number);

export const formattingNumberHuman = (number) => {
  return (number / 1000) + 'rb'
}

export const formattingDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleString('id', options);
}

export const formattingDateHuman = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleString('id', options);
}

export const formattingDateYMD = (date) => {
  // Get the individual components of the date
  const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
  const day = String(date.getDate()).padStart(2, '0');

  // Construct the zero-based YMD string
  const ymd = `${year}-${month}-${day}`;

  return ymd;
}

export const cutString = (inputString, length = 15) => {
  if (!inputString) return 'Empty String';
  if (inputString.length > length) {
    return inputString.substring(0, length) + '...';
  } else {
    return inputString;
  }
}

export const printFormat = (data, t, d, roundedTrip = null) => {
  const payload = [];

  const largeText = '16px';
  const mediumText = '12px';
  const semiMediumText = '10px';
  const smallText = '8px';
  const smallTextPlus = '8px';
  const fontBold = '700';
  const fontMedium = '600';
  const clientId = document.querySelector('[name=clientId]').content;
  console.log('this is clientId', clientId)
  /* HEADER SECTION */
  payload.push({
    type: 'text',
    value: data[0].company_name,
    style: {fontWeight: fontBold, textAlign: 'center', fontSize: "16px"}
  });

  payload.push({
    type: 'text',
    value: 'CALL CENTER & WHATSAPP',
    style: {fontSize: smallTextPlus, textAlign: "center", fontWeight: fontMedium}
  });

  payload.push({
    type: 'text',
    value: data[0].company_phone_no,
    style: {fontWeight: fontBold, textAlign: 'center', fontSize: "16px"}
  });

  payload.push({
    type: 'text',
    value: data[0].company_website,
    style:  {fontSize: smallText, textAlign: "center", paddingBottom: '6px', borderBottom: '2px dashed black', fontWeight: fontMedium}
  });

  /* PASSENGERS */
  if (!roundedTrip) {

    data.forEach(item => {
      payload.push({
        type: 'text',
        value: item.ticket_no,
        style: {fontSize: largeText, textAlign: "center", paddingTop: '6px', fontWeight: fontBold}
      });

      payload.push({
        type: 'text',
        value: 'BY:EDC',
        style: {fontSize: semiMediumText, textAlign: "center", fontWeight: fontMedium}
      });

      payload.push({
        type: 'qrCode',
        value: item.qr_code,
        height: 120,
        width: 120,
        position: "center",
        style: { margin: '10 20px 20 20px', fontWeight: fontMedium }
      });

      payload.push({
        type: 'text',
        value: t('ticket.passenger'),
        style: { fontSize: smallText, textAlign: "center", fontWeight: fontMedium }
      });

      payload.push({
        type: 'text',
        value: cutString(item.passenger_name),
        style: {fontSize: mediumText, paddingRight: '3px', fontWeight: fontMedium, textAlign: "center"}
      });

      if (item.is_with_infant == 1) {
        payload.push({
          type: 'text',
          value: t('ticket.withInfant'),
          style: { fontSize: semiMediumText, textAlign: "center", fontWeight: fontMedium }
        });

        payload.push({
          type: 'text',
          value: t('ticket.childName'),
          style: { fontSize: smallText, textAlign: "center", fontWeight: fontMedium }
        });

        payload.push({
          type: 'text',
          value: item.infant_name,
          style: { fontSize: mediumText, textAlign: "center", fontWeight: fontMedium }
        });
      }

      payload.push({
        type: 'text',
        value: t('ticket.departureDateLabel'),
        style: {fontSize: smallText, marginTop: '8px', textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: d(new Date(item.departure_date), 'short'),
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.schedule_code,
        style: {fontSize: smallText, textAlign: 'center', fontWeight: fontMedium}
      });

      if (item.via) {
        payload.push({
          type: 'text',
          value: `VIA: ${item.via}`,
          style: {fontSize: smallText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
        });
      }

      payload.push({
        type: 'text',
        value: 'PICK UP:',
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.departure,
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });


      if (clientId != 'JACKAL_HOLIDAYS' || true) {
        payload.push({
          type: 'text',
          value: item.departure_pool_name,
          style: {fontSize: smallText, textAlign: 'center', fontWeight: fontMedium}
        });
      }



      payload.push({
        type: 'text',
        value: item.departure_time,
        style: {fontSize: mediumText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: t('ticket.seat'),
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.seat_no,
        style: {fontSize: '35px', textAlign: 'center', fontWeight: fontBold}
      });

      payload.push({
        type: 'text',
        value: 'DROP OFF:',
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.destination,
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });


      if (clientId != 'JACKAL_HOLIDAYS' || true) {
        payload.push({
          type: 'text',
          value: item.destination_pool_name,
          style: {fontSize: smallText, textAlign: 'center', marginBottom: '4px', fontWeight: fontMedium}
        });
      }



      if (item.total_payment < item.ticket_price) {
        payload.push({
          type: 'text',
          value: formattingNumber(item.ticket_price),
          style: {fontSize: largeText, textAlign: 'center', fontWeight: fontMedium, textDecoration: 'line-through'}
        });
      }

      payload.push({
        type: 'text',
        value: formattingNumber(item.total_payment),
        style: {fontSize: largeText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.transaction_time,
        style: {fontSize: smallText, textAlign: 'center', paddingBottom: '6px', marginBottom: '6px', borderBottom: '2px dashed black', fontWeight: fontMedium}
      });

    });
  } else {
    const passengers = data.filter((item) => {
      return item.departure_pool_name == roundedTrip.departureOutlet
    });
    const passengersReturn = data.filter((item) => {
      return item.departure_pool_name == roundedTrip.destinationOutlet
    });

    /* Passenger  */
    payload.push({
      type: 'text',
      value: t('ticket.roundedTripLabel'),
      style:  {fontSize: mediumText, textAlign: "center", paddingBottom: '8px', paddingTop: '8px', borderBottom: '2px dashed black', fontWeight: fontMedium}
    });

    passengers.forEach(item => {
      payload.push({
        type: 'text',
        value: item.ticket_no,
        style: {fontSize: largeText, textAlign: "center", paddingTop: '6px', fontWeight: fontBold}
      });

      payload.push({
        type: 'qrCode',
        value: item.qr_code,
        height: 120,
        width: 120,
        position: "center",
        style: { margin: '10 20px 20 20px', fontWeight: fontMedium }
      });

      payload.push({
        type: 'text',
        value: t('ticket.passenger'),
        style: { fontSize: smallText, textAlign: "center", fontWeight: fontMedium }
      });

      payload.push({
        type: 'text',
        value: cutString(item.passenger_name),
        style: {fontSize: mediumText, paddingRight: '3px', fontWeight: fontMedium, textAlign: "center"}
      });

      if (item.is_with_infant == 1) {
        payload.push({
          type: 'text',
          value: t('ticket.withInfant'),
          style: { fontSize: semiMediumText, textAlign: "center", fontWeight: fontMedium }
        });

        payload.push({
          type: 'text',
          value: t('ticket.childName'),
          style: { fontSize: smallText, textAlign: "center", fontWeight: fontMedium }
        });

        payload.push({
          type: 'text',
          value: item.infant_name,
          style: { fontSize: mediumText, textAlign: "center", fontWeight: fontMedium }
        });
      }

      payload.push({
        type: 'text',
        value: t('ticket.departureDateLabel'),
        style: {fontSize: smallText, marginTop: '8px', textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: d(new Date(item.departure_date), 'short'),
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.schedule_code,
        style: {fontSize: smallText, textAlign: 'center', fontWeight: fontMedium}
      });

      if (item.via) {
        payload.push({
          type: 'text',
          value: `VIA: ${item.via}`,
          style: {fontSize: smallText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
        });
      }

      payload.push({
        type: 'text',
        value: 'PICK UP:',
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.departure,
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      if (clientId != 'JACKAL_HOLIDAYS' || true) {
        payload.push({
          type: 'text',
          value: item.departure_pool_name,
          style: {fontSize: smallText, textAlign: 'center', fontWeight: fontMedium}
        });
      }



      payload.push({
        type: 'text',
        value: item.departure_time,
        style: {fontSize: mediumText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: t('ticket.seat'),
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.seat_no,
        style: {fontSize: '35px', textAlign: 'center', fontWeight: fontBold}
      });

      payload.push({
        type: 'text',
        value: 'DROP OFF:',
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.destination,
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });


      if (clientId != 'JACKAL_HOLIDAYS' || true) {
        payload.push({
          type: 'text',
          value: item.destination_pool_name,
          style: {fontSize: smallText, textAlign: 'center', marginBottom: '4px', fontWeight: fontMedium}
        });
      }


      if (item.total_payment < item.ticket_price) {
        payload.push({
          type: 'text',
          value: formattingNumber(item.ticket_price),
          style: {fontSize: largeText, textAlign: 'center', fontWeight: fontMedium, textDecoration: 'line-through'}
        });
      }

      payload.push({
        type: 'text',
        value: formattingNumber(item.total_payment),
        style: {fontSize: largeText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.transaction_time,
        style: {fontSize: smallText, textAlign: 'center', paddingBottom: '6px', marginBottom: '6px', borderBottom: '2px dashed black', fontWeight: fontMedium}
      });

    });


    /* Passengers Return */
    payload.push({
      type: 'text',
      value: t('ticket.roundedTripLabelReturn'),
      style:  {fontSize: mediumText, textAlign: "center", paddingBottom: '8px', paddingTop: '6px', fontWeight: fontMedium, borderBottom: '2px dashed black'}
    });

    passengersReturn.forEach(item => {
      payload.push({
        type: 'text',
        value: item.ticket_no,
        style: {fontSize: largeText, textAlign: "center", paddingTop: '6px', fontWeight: fontBold}
      });

      payload.push({
        type: 'qrCode',
        value: item.qr_code,
        height: 120,
        width: 120,
        position: "center",
        style: { margin: '10 20px 20 20px', fontWeight: fontMedium }
      });

      payload.push({
        type: 'text',
        value: t('ticket.passenger'),
        style: { fontSize: smallText, textAlign: "center", fontWeight: fontMedium }
      });

      payload.push({
        type: 'text',
        value: cutString(item.passenger_name),
        style: {fontSize: mediumText, paddingRight: '3px', fontWeight: fontMedium, textAlign: "center"}
      });

      if (item.is_with_infant == 1) {
        payload.push({
          type: 'text',
          value: t('ticket.withInfant'),
          style: { fontSize: semiMediumText, textAlign: "center", fontWeight: fontMedium }
        });

        payload.push({
          type: 'text',
          value: t('ticket.childName'),
          style: { fontSize: smallText, textAlign: "center", fontWeight: fontMedium }
        });

        payload.push({
          type: 'text',
          value: item.infant_name,
          style: { fontSize: mediumText, textAlign: "center", fontWeight: fontMedium }
        });
      }

      payload.push({
        type: 'text',
        value: t('ticket.departureDateLabel'),
        style: {fontSize: smallText, marginTop: '8px', textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: d(new Date(item.departure_date), 'short'),
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.schedule_code,
        style: {fontSize: smallText, textAlign: 'center', fontWeight: fontMedium}
      });

      if (item.via) {
        payload.push({
          type: 'text',
          value: `VIA: ${item.via}`,
          style: {fontSize: smallText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
        });
      }

      payload.push({
        type: 'text',
        value: 'PICK UP:',
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.departure,
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      if (clientId != 'JACKAL_HOLIDAYS' || true) {
        payload.push({
          type: 'text',
          value: item.departure_pool_name,
          style: {fontSize: smallText, textAlign: 'center', fontWeight: fontMedium}
        });
      }



      payload.push({
        type: 'text',
        value: item.departure_time,
        style: {fontSize: mediumText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: t('ticket.seat'),
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.seat_no,
        style: {fontSize: '35px', textAlign: 'center', fontWeight: fontBold}
      });

      payload.push({
        type: 'text',
        value: 'DROP OFF:',
        style: {fontSize: semiMediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.destination,
        style: {fontSize: mediumText, textAlign: 'center', fontWeight: fontMedium}
      });

      if (clientId != 'JACKAL_HOLIDAYS' || true) {
        payload.push({
          type: 'text',
          value: item.destination_pool_name,
          style: {fontSize: smallText, textAlign: 'center', marginBottom: '4px', fontWeight: fontMedium}
        });
      }


      if (item.total_payment < item.ticket_price) {
        payload.push({
          type: 'text',
          value: formattingNumber(item.ticket_price),
          style: {fontSize: largeText, textAlign: 'center', fontWeight: fontMedium, textDecoration: 'line-through'}
        });
      }

      payload.push({
        type: 'text',
        value: formattingNumber(item.total_payment),
        style: {fontSize: largeText, textAlign: 'center', marginBottom: '8px', fontWeight: fontMedium}
      });

      payload.push({
        type: 'text',
        value: item.transaction_time,
        style: {fontSize: smallText, textAlign: 'center', paddingBottom: '6px', marginBottom: '6px', borderBottom: '2px dashed black', fontWeight: fontMedium}
      });

    });



  }

  /* FOOTER SECTION */
  if (printData[clientId] && printData[clientId].length > 0) {
    printData[clientId].forEach(item => {
      payload.push({
        type: 'text',
        value: t(item.value),
        // style: item.style
      })
    })
  }

  payload.forEach(item => {
    item.style.marginLeft = '-7px';
    item.style.fontFamily = 'Poppins';
  });


  return payload;

}

export const oldAsmatBoardingTicket = (noTicket) => {
  if(
      (noTicket.substring(0, 1) === 'T' && noTicket.substring(1, 3) !== 'JH' ) ||
      noTicket.substring(0, 1) === 'I'
    )
  {
    return noTicket.substring(1)
  }
  return noTicket
}

export const formatAccountNumber = (accountNumber) => {
  return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export const removeStyleTag = (htmlString) => {
  if (!htmlString) return '';
  // return htmlString.replace(/<style[^>]*>.*?<\/style>/g, '')
}

export const getNextYearDate = () => {
  const currentDate = new Date();
  const nextYearDate = new Date(currentDate);
  nextYearDate.setFullYear(currentDate.getFullYear() + 1);
  return nextYearDate;
}

export const dmyStringToDate = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('-');
  // return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
}

export const getNestedValue = (obj, path) => {
  // Split the path into an array based on the dot notation
  const keys = path.split('.');

  // Use reduce to traverse the object based on the path
  return keys.reduce((acc, key) => {
    // Check if the current level is valid, then return the value
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
}
