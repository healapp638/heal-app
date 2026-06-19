import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'com.heal.tokens';

export const saveTokensToKeychain = async (accessToken: string, refreshToken: string) => {
  try {
    const tokenData = JSON.stringify({ accessToken, refreshToken });
    await Keychain.setGenericPassword('user_session', tokenData, {
      service: SERVICE_NAME,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch (error) {
    console.error('Failed to save tokens to keychain', error);
  }
};

export const getTokensFromKeychain = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
    if (credentials) {
      return JSON.parse(credentials.password) as { accessToken: string; refreshToken: string };
    }
  } catch (error) {
    console.error('Failed to get tokens from keychain', error);
  }
  return null;
};

export const clearTokensFromKeychain = async () => {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE_NAME });
  } catch (error) {
    console.error('Failed to clear tokens from keychain', error);
  }
};
