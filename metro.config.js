const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// ลองคอมเมนต์บรรทัดเดิมแล้วใช้แบบนี้แทนเพื่อทดสอบ
module.exports = withNativeWind(config, { input: './global.css' });