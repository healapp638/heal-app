import { config, Mode } from "./config";

const env = {
  development: {
    apiUrl: config.devUrl,
    fileUrl: config.devFileUrl,
    stripeKey: config.devStripeKey,
    googleMapKey: config.googleMapKey
  },
  staging: {
    apiUrl: config.stageUrl,
    fileUrl: config.stageFileUrl,
    stripeKey: config.stageStripeKey,
    googleMapKey: config.googleMapKey
  },
  production: {
    apiUrl: config.prodUrl,
    fileUrl: config.prodFileUrl,
    stripeKey: config.prodStripeKey,
    googleMapKey: config.googleMapKey
  }
};


const getEnvVars = () => {
  if (config.mode === Mode.STAGE) {
    return env.staging;
  } else if (config.mode === Mode.PROD) {
    return env.production;
  } else {
    return env.development;
  }
};

export default getEnvVars;
