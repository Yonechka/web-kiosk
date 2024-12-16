
const currentDatas = [
  {
    qr_code: "TBRT241126OVKT",
    ticket_no: "TBRT241126OVKT",
    departure_date: "2024-11-26",
    departure_time: "15:00",
    schedule_code: "BBB-BMI-15:00",
    passenger_name: "FFF",
    seat_no: "4",
    ticket_price: 20000,
    promo_discount: 0,
    voucher_discount: 0,
    total_payment: 20000,
    promo_name: "",
    voucher_code: null,
    transaction_time: "2024-11-26 10:36:39",
    payment_type: "QRIS",
    departure: "BANDUNG",
    destination: "BANDUNG",
    departure_pool_name: "BUAH BATU",
    destination_pool_name: "CIMAHI",
    company_name: "Baraya",
    company_address: "",
    company_phone_no: "",
    company_website: "",
    ticket_note: null,
    with_infant: false,
    infant_name: null,
    cso: null
  },
]

function sendData() {
    if (window.JavaScriptChannel) {
        window.JavaScriptChannel.postMessage(JSON.stringify(currentDatas));
        console.log('data sents');
    } else {
        console.error('JavaScriptChannel tidak tersedia');
    }
}

window.onload = function() {
    sendData();
};
