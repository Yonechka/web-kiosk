import featuresDev from "./features.dev"
import featuresProd from "./features.prod"

export interface Feature {
  edc: string[],
  isInsurance: boolean,
  isBoarding: boolean,
  isVoucher: boolean,
  isPrintTicket: boolean,
  isChangeDeparturePool: boolean,
  useV2: boolean,
  isAds: boolean
}

export interface Features {
  [key: string]: Feature,
}

export { featuresDev, featuresProd };
