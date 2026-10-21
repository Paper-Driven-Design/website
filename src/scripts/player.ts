/**
 * Odtwarzacz odcinka — jeden skrypt obsługuje każdy element `[data-player]`.
 *
 * Gdy <audio data-player-audio> ma `src`, sterujemy prawdziwym dźwiękiem.
 * Gdy pliku brak (np. przed publikacją), odtwarzacz działa w trybie symulacji,
 * żeby interfejs (rozdziały, scrubber, prędkość) można było obejrzeć i przetestować.
 *
 * Atrybuty w drzewie odtwarzacza:
 *   data-player-audio          <audio>
 *   data-player-toggle         przycisk play/pause
 *   data-player-icon-play / data-player-icon-pause   elementy przełączane klasą `hidden`
 *   data-player-label-play / data-player-label-pause tekst przycisku (opcjonalnie)
 *   data-player-bar            klikalna szyna
 *   data-player-progress       wypełnienie szyny (szerokość w %)
 *   data-player-current / data-player-total   odczyt czasu
 *   data-player-skip="-15"     przewijanie o N sekund
 *   data-player-speed="1.25"   wybór prędkości (aktywny = atrybut data-active)
 *   data-player-volume         <input type="range" 0–100>
 *   data-player-seek="870"     skok do sekundy (rozdziały); aktywny = data-active, odsłuchany = data-done
 *   data-player-target="main"  łączy rozdział spoza korzenia z <div data-player="main">
 *   data-player-chapter="…"   tytuł rozdziału do etykiety
 *   data-player-chapter-label  nazwa bieżącego rozdziału
 *   data-player-episode="001"  slug odcinka — trafia do zdarzenia analitycznego `episode_play`
 *   data-player-title="…"      tytuł odcinka do tego samego zdarzenia
 *
 * Analityka: przy pierwszym uruchomieniu prawdziwego dźwięku (nie w trybie symulacji) wysyłamy do PostHog
 * jedno zdarzenie `episode_play` na załadowanie strony. Nic więcej: ani pozycji, ani czasu słuchania.
 */

declare global {
  interface Window {
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void };
  }
}

function formatTime(total: number): string {
  const secs = Math.max(0, Math.floor(total));
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = (h > 0 && m < 10 ? '0' : '') + m;
  const ss = (s < 10 ? '0' : '') + s;
  return h > 0 ? `${h}:${mm}:${ss}` : `${(m < 10 ? '0' : '') + m}:${ss}`;
}

function initPlayer(root: HTMLElement) {
  const audio = root.querySelector<HTMLAudioElement>('[data-player-audio]');
  const hasSource = !!audio && !!audio.getAttribute('src');

  const toggles = root.querySelectorAll<HTMLButtonElement>('[data-player-toggle]');
  const iconsPlay = root.querySelectorAll<HTMLElement>('[data-player-icon-play]');
  const iconsPause = root.querySelectorAll<HTMLElement>('[data-player-icon-pause]');
  const labelsPlay = root.querySelectorAll<HTMLElement>('[data-player-label-play]');
  const labelsPause = root.querySelectorAll<HTMLElement>('[data-player-label-pause]');
  const bar = root.querySelector<HTMLElement>('[data-player-bar]');
  const progress = root.querySelector<HTMLElement>('[data-player-progress]');
  const currentEl = root.querySelector<HTMLElement>('[data-player-current]');
  const totalEl = root.querySelector<HTMLElement>('[data-player-total]');
  const chapterLabel = root.querySelector<HTMLElement>('[data-player-chapter-label]');
  // Rozdziały mogą leżeć poza korzeniem odtwarzacza — łączymy je przez data-player-target="<nazwa>".
  const name = root.dataset.player;
  const external = name
    ? Array.from(document.querySelectorAll<HTMLElement>(`[data-player-seek][data-player-target="${name}"]`))
    : [];
  const seeks = Array.from(root.querySelectorAll<HTMLElement>('[data-player-seek]')).concat(external);
  const speeds = root.querySelectorAll<HTMLButtonElement>('[data-player-speed]');
  const volume = root.querySelector<HTMLInputElement>('[data-player-volume]');
  const status = root.querySelector<HTMLElement>('[data-player-status]');

  let duration = Number(root.dataset.duration ?? 0) || 0;
  let current = Number(root.dataset.start ?? 0) || 0;
  let playing = false;
  let playTracked = false;
  let rate = 1;
  let timer: number | undefined;

  const chapters = seeks
    .map((el) => ({ el, seconds: Number(el.dataset.playerSeek) || 0 }))
    .sort((a, b) => a.seconds - b.seconds);

  function render() {
    const pct = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
    if (progress) progress.style.width = `${pct}%`;
    if (bar) bar.setAttribute('aria-valuenow', String(Math.floor(current)));
    if (currentEl) currentEl.textContent = formatTime(current);
    if (totalEl && duration > 0) totalEl.textContent = formatTime(duration);

    if (chapters.length) {
      let active = chapters[0];
      for (const ch of chapters) if (current >= ch.seconds) active = ch;
      chapters.forEach((ch) => {
        if (ch === active) ch.el.setAttribute('data-active', '');
        else ch.el.removeAttribute('data-active');
        // rozdziały przed bieżącym oznaczamy jako odsłuchane
        if (ch.seconds < active.seconds) ch.el.setAttribute('data-done', '');
        else ch.el.removeAttribute('data-done');
      });
      if (chapterLabel) chapterLabel.textContent = `Rozdział: ${active.el.dataset.playerChapter ?? ''}`;
    }
  }

  function setPlaying(next: boolean) {
    playing = next;
    iconsPlay.forEach((el) => el.classList.toggle('hidden', playing));
    iconsPause.forEach((el) => el.classList.toggle('hidden', !playing));
    labelsPlay.forEach((el) => el.classList.toggle('hidden', playing));
    labelsPause.forEach((el) => el.classList.toggle('hidden', !playing));
    toggles.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Wstrzymaj odcinek' : 'Odtwórz odcinek');
    });
    if (status) status.textContent = playing ? 'Odtwarzanie' : hasSource ? 'Gotowy do odsłuchu' : 'Podgląd odtwarzacza';
  }

  // --- tryb symulacji (brak pliku audio) -----------------------------------
  function simStart() {
    simStop();
    timer = window.setInterval(() => {
      if (current < duration) {
        current = Math.min(duration, current + rate);
        render();
      } else {
        simStop();
        setPlaying(false);
      }
    }, 1000);
  }
  function simStop() {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  }

  // --- API wspólne -----------------------------------------------------------
  function seek(seconds: number) {
    current = Math.min(duration || seconds, Math.max(0, seconds));
    if (hasSource && audio) audio.currentTime = current;
    render();
  }

  function play() {
    if (hasSource && audio) {
      audio.play().catch(() => {
        /* autoplay zablokowany — użytkownik kliknie ponownie */
      });
    } else {
      simStart();
      setPlaying(true);
    }
  }

  function pause() {
    if (hasSource && audio) audio.pause();
    else {
      simStop();
      setPlaying(false);
    }
  }

  function togglePlay() {
    playing ? pause() : play();
  }

  // --- zdarzenia audio -------------------------------------------------------
  if (hasSource && audio) {
    audio.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(audio.duration)) duration = audio.duration;
      if (current > 0) audio.currentTime = current;
      render();
    });
    audio.addEventListener('timeupdate', () => {
      current = audio.currentTime;
      render();
    });
    audio.addEventListener('play', () => {
      setPlaying(true);
      if (!playTracked) {
        playTracked = true;
        window.posthog?.capture('episode_play', {
          episode: root.dataset.playerEpisode ?? null,
          episode_title: root.dataset.playerTitle ?? null,
        });
      }
    });
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('ended', () => setPlaying(false));
    if (volume) audio.volume = Number(volume.value) / 100;
  }

  // --- sterowanie ------------------------------------------------------------
  toggles.forEach((btn) => btn.addEventListener('click', togglePlay));

  if (bar) {
    const seekFromPointer = (event: MouseEvent) => {
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      seek(ratio * duration);
    };
    bar.addEventListener('click', seekFromPointer);
    bar.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') seek(current + 5);
      if (event.key === 'ArrowLeft') seek(current - 5);
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        togglePlay();
      }
    });
  }

  root.querySelectorAll<HTMLButtonElement>('[data-player-skip]').forEach((btn) => {
    btn.addEventListener('click', () => seek(current + (Number(btn.dataset.playerSkip) || 0)));
  });

  speeds.forEach((btn) => {
    btn.addEventListener('click', () => {
      rate = Number(btn.dataset.playerSpeed) || 1;
      if (audio) audio.playbackRate = rate;
      speeds.forEach((b) => (b === btn ? b.setAttribute('data-active', '') : b.removeAttribute('data-active')));
    });
  });

  if (volume) {
    volume.addEventListener('input', () => {
      if (audio) audio.volume = Number(volume.value) / 100;
    });
  }

  chapters.forEach(({ el, seconds }) => {
    el.addEventListener('click', () => {
      seek(seconds);
      if (!playing) play();
    });
  });

  setPlaying(false);
  render();
}

document.querySelectorAll<HTMLElement>('[data-player]').forEach(initPlayer);

// Plik musi być modułem, żeby `declare global` było dozwolone.
export {};
