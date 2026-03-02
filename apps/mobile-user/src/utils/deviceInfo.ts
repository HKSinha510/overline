import {Platform, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'device_unique_id';

class DeviceInfoHelper {
  private deviceId: string | null = null;

  async initialize() {
    let stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!stored) {
      // Generate a unique device ID based on platform + random UUID
      stored = this.generateUUID();
      await AsyncStorage.setItem(DEVICE_ID_KEY, stored);
    }
    this.deviceId = stored;
  }

  getFingerprint(): string {
    if (!this.deviceId) {
      // Fallback if not initialized yet
      return `${Platform.OS}-${Dimensions.get('window').width}x${Dimensions.get('window').height}`;
    }
    return this.deviceId;
  }

  getDeviceInfo() {
    const {width, height} = Dimensions.get('window');
    return {
      platform: Platform.OS,
      version: Platform.Version,
      screenWidth: width,
      screenHeight: height,
      deviceId: this.deviceId,
    };
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}

const DeviceInfo = new DeviceInfoHelper();

// Initialize on app startup
DeviceInfo.initialize().catch(() => {});

export default DeviceInfo;
