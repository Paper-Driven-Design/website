# Paper Driven Design — strona podcastu

Astro 7 + Tailwind CSS 4. Strona statyczna: landing, strony odcinków, kanał RSS.

## Uruchomienie

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # wynik w dist/
npm run preview
```

## Struktura

| Ścieżka | Co tu jest |
| --- | --- |
| `src/content/episodes/*.yaml` | Odcinki — jeden plik = jeden odcinek, nazwa pliku to slug (`002.yaml` → `/odcinki/002/`) |
| `src/content.config.ts` | Schemat (zod) pól odcinka |
| `src/data/site.ts` | Nazwa, opis, linki do platform, prowadzący, manifest, endpoint newslettera |
| `src/styles/global.css` | Tokeny design systemu (kolory, fonty, typografia) i klasy komponentów |
| `src/layouts/BaseLayout.astro` | `<head>`, fonty, nagłówek i stopka |
| `src/components/` | Logo, nagłówek, stopka, karta odcinka, separator FlightPath, newsletter, awatar |
| `src/pages/index.astro` | Landing |
| `src/pages/odcinki/[id].astro` | Strona odcinka (odtwarzacz, rozdziały, materiały, transkrypcja) |
| `src/pages/rss.xml.ts` | Kanał RSS |
| `src/scripts/player.ts` | Odtwarzacz audio (działa z plikiem MP3, a bez niego w trybie podglądu) |

## Dodanie odcinka

1. Skopiuj `src/content/episodes/002.yaml` jako `003.yaml` i uzupełnij pola.
2. Ustaw `status: published` (odcinki `upcoming` pokazują się tylko jako zapowiedź „kolejny odcinek”).
3. Wgraj plik MP3 do `public/audio/` i wpisz `audio.url: /audio/pdd-003.mp3`.
4. Notatki PDF do `public/notes/`, zdjęcia do `public/images/`.

Najnowszy opublikowany odcinek automatycznie trafia do sekcji „Najnowszy” na landingu, a filtry tematów budują się z pola `tags`.

## Do podmiany przed startem

- `src/data/site.ts` → `url`, linki do Spotify / Apple / YouTube, profile prowadzących, `newsletterAction` (URL formularza dostawcy newslettera; pusty = tryb demo).
- `astro.config.mjs` → `site` (używany do canonical i RSS).
- `public/favicon.svg`.

## Testowe pliki audio

W `public/audio/` leżą dwa wygenerowane pliki testowe (`pdd-001-test.mp3`, `pdd-002-test.mp3`): cichy sygnał co 30 s, a na początku każdego rozdziału lektor czyta jego tytuł i czas. Długości odpowiadają polom `duration` w YAML.

Wygenerujesz je ponownie (macOS: `say` + `ffmpeg`) poleceniem:

```sh
scripts/make-test-audio.sh public/audio/pdd-003-test.mp3 <długość_s> "<intro>" "<sek>|<tytuł rozdziału>" ...
```

Przed publikacją podmień `audio.url` w plikach odcinków na właściwe MP3 i usuń pliki testowe.
