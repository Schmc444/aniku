import { requireNativeModule } from 'expo-modules-core';

const VideoProxy = requireNativeModule('VideoProxy');

const PORT = 18765;
let _running = false;

export function startProxyServer() {
  if (_running) return;
  VideoProxy.startServer(PORT);
  _running = true;
}

export function stopProxyServer() {
  if (!_running) return;
  VideoProxy.stopServer();
  _running = false;
}

export function registerProxyUrl(token, url, headers) {
  const ip = VideoProxy.getLocalIP();
  if (!ip) return null;
  VideoProxy.registerUrl(token, url, headers);
  return `http://${ip}:${PORT}/${token}`;
}

export function unregisterProxyUrl(token) {
  VideoProxy.unregisterUrl(token);
}
