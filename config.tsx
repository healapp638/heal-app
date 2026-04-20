import { sensitiveData } from "./src/constants/Sensitive/sensitiveData";

export enum Mode {
  DEV = "DEV",
  STAGE = "STAGE",
  PROD = "PROD"
}

export interface Config {
  mode: Mode;
  devUrl: string;
  devFileUrl: string;
  stageUrl: string;
  stageFileUrl: string;
  prodUrl: string;
  prodFileUrl: string;
  devStripeKey: string;
  stageStripeKey: string;
  prodStripeKey: string;
  googleMapKey: string;
}

export const config: Config = {
  mode: Mode.DEV,

  // Development
  devUrl: sensitiveData.devApiUrl,
  devFileUrl: sensitiveData.devFileUrl,

  // Staging
  stageUrl: sensitiveData.stageApiUrl,
  stageFileUrl: sensitiveData.stageFileUrl,

  // Production
  prodUrl: sensitiveData.liveApiUrl,
  prodFileUrl: sensitiveData.liveFileUrl,

  // Stripe Dev Key
  devStripeKey: "",

  // Stripe Stage Key
  stageStripeKey: "",

  // Stripe Prod Key
  prodStripeKey: "",

  // GoogleMapKey
  googleMapKey: ""
};
