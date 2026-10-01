(() => {
  const player = document.querySelector('.radio-player');
  const audio = document.querySelector('#radio-audio');
  const play = document.querySelector('#radio-play');
  const mute = document.querySelector('#radio-mute');
  const volume = document.querySelector('#radio-volume');
  const status = document.querySelector('#radio-status');
  let active = 0;
  let request = 0;
  let wantsPlayback = false;
  let failed = false;
  let previousVolume = RADIO_CONFIG.initialVolume;

  const setState = (message, playing = false) => {
    status.textContent = message;
    player.classList.toggle('is-playing', playing);
    play.setAttribute('aria-pressed', String(wantsPlayback));
    play.setAttribute('aria-label', wantsPlayback ? 'Pause demo radio' : failed ? 'Retry demo radio' : 'Play demo radio');
    play.querySelector('svg path').setAttribute('d', wantsPlayback ? 'M6 3h4v18H6ZM14 3h4v18h-4Z' : 'M6 3 21 12 6 21Z');
  };
  const updateVolume = () => {
    const quiet = audio.muted || audio.volume === 0;
    const percent = Math.round(audio.volume * 100);
    mute.classList.toggle('is-muted', quiet);
    mute.setAttribute('aria-pressed', String(quiet));
    mute.setAttribute('aria-label', quiet ? 'Unmute demo radio' : 'Mute demo radio');
    volume.value = percent;
    volume.setAttribute('aria-valuetext', `${percent} percent${audio.muted ? ', muted' : ''}`);
    document.querySelector('#radio-volume-value').textContent = quiet ? 'OFF' : `${percent}%`;
    player.classList.toggle('is-muted', quiet);
  };
  const loadTrack = () => {
    const item = RADIO_PLAYLIST[active];
    audio.src = RADIO_CONFIG.sources[item.source];
    document.querySelector('#radio-title').textContent = item.title;
    document.querySelector('#radio-artist').textContent = item.artist;
    const art = document.querySelector('#radio-art');
    art.style.backgroundImage = `url("${item.artwork.url}")`;
    art.style.backgroundPosition = `${item.artwork.x * 0.34}px ${item.artwork.y * 0.34}px`;
    art.setAttribute('aria-label', item.artwork.label);
    failed = false;
  };
  const reportError = () => {
    failed = true;
    wantsPlayback = false;
    setState('Audio unavailable. Retry.');
  };
  const start = async () => {
    const currentRequest = ++request;
    wantsPlayback = true;
    setState('Loading demo…');
    try {
      await audio.play();
    } catch (error) {
      if (currentRequest !== request) return;
      wantsPlayback = false;
      if (error.name === 'NotAllowedError') setState('Press play to listen.');
      else if (error.name !== 'AbortError') reportError();
      else setState('Paused');
    }
  };
  const advance = (resume) => {
    ++request;
    wantsPlayback = false;
    audio.pause();
    active = (active + 1) % RADIO_PLAYLIST.length;
    loadTrack();
    if (resume) start();
    else setState('Ready to play');
  };
  play.addEventListener('click', () => {
    if (wantsPlayback || !audio.paused) {
      ++request;
      wantsPlayback = false;
      audio.pause();
      setState('Paused');
    } else {
      if (failed) { audio.load(); failed = false; }
      start();
    }
  });
  audio.addEventListener('playing', () => { wantsPlayback = true; setState('Playing demo', true); });
  audio.addEventListener('pause', () => {
    if (!audio.ended && !failed) { wantsPlayback = false; setState('Paused'); }
  });
  audio.addEventListener('waiting', () => { if (wantsPlayback) setState('Buffering…'); });
  audio.addEventListener('ended', () => { if (wantsPlayback) advance(true); });
  audio.addEventListener('error', reportError);
  audio.addEventListener('volumechange', updateVolume);
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value) / 100;
    if (audio.volume > 0) previousVolume = audio.volume;
    audio.muted = false;
    updateVolume();
  });
  mute.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
      if (audio.volume === 0) audio.volume = previousVolume || RADIO_CONFIG.initialVolume;
      audio.muted = false;
    } else audio.muted = true;
    updateVolume();
  });
  // Reserve the sticky bar's real height for anchors, including enlarged text.
  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--radio-height', `${player.offsetHeight}px`);
  }).observe(player);
  audio.volume = RADIO_CONFIG.initialVolume;
  loadTrack();
  updateVolume();
})();
