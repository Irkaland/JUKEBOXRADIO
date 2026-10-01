// Original synthesized audio, local metadata, and reference artwork only.
// Future live integration: replace RADIO_CONFIG.sources with the real HTTPS stream
// and replace this local playlist with an authorized Now Playing metadata source.
const RADIO_CONFIG = {
  initialVolume: 0.6,
  sources: {
    city: 'assets/audio/city-signal.wav',
    sun: 'assets/audio/paper-sun.wav',
    night: 'assets/audio/afterglow.wav',
  },
};
const RADIO_PLAYLIST = [
  { artist: 'JUKEBOX Demo Studio', title: 'City Signal', source: 'city', duration: 20,
    artwork: { url: 'assets/reference.png', x: -97, y: -642, label: 'Hip-hop reference sleeve — original demo audio' } },
  { artist: 'JUKEBOX Demo Studio', title: 'Paper Sun', source: 'sun', duration: 20,
    artwork: { url: 'assets/reference.png', x: -293, y: -642, label: 'N.E.R.D reference sleeve — original demo audio, not an N.E.R.D recording' } },
  { artist: 'JUKEBOX Demo Studio', title: 'Afterglow', source: 'night', duration: 20,
    artwork: { url: 'assets/reference.png', x: -872, y: -642, label: 'Jamiroquai reference sleeve — original demo audio, not a Jamiroquai recording' } },
];
