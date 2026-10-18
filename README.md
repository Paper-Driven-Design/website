# Paper Driven Design — strona podcastu

Astro 7 + Tailwind CSS 4. Strona statyczna: landing, strony odcinków, kanał podcastowy `/feed.xml`.
Pliki audio i okładki leżą w S3 za CloudFrontem (Terraform w `../paper-driven-design-audio-infra`).

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
| `src/content/episodes/*.yaml` | Odcinki — jeden plik = jeden odcinek, nazwa pliku to slug (`001.yaml` → `/odcinki/001/`) |
| `src/content.config.ts` | Schemat (zod) pól odcinka |
| `src/data/site.ts` | Nazwa, opis, linki do platform, prowadzący, manifest, endpoint newslettera |
| `src/styles/global.css` | Tokeny design systemu (kolory, fonty, typografia) i klasy komponentów |
| `src/layouts/BaseLayout.astro` | `<head>`, fonty, nagłówek i stopka |
| `src/components/` | Logo, nagłówek, stopka, karta odcinka, separator FlightPath, newsletter, awatar |
| `src/pages/index.astro` | Landing |
| `src/pages/odcinki/[id].astro` | Strona odcinka (odtwarzacz, rozdziały, materiały, transkrypcja) |
| `src/pages/feed.xml.ts` | Kanał podcastowy (RSS + iTunes) dla Spotify / Apple; `/rss.xml` to alias |
| `src/scripts/player.ts` | Odtwarzacz audio (działa z plikiem MP3, a bez niego w trybie podglądu) |

## Dodanie odcinka

1. Skopiuj `src/content/episodes/001.yaml` jako `002.yaml` i uzupełnij pola.
2. Ustaw `status: published` (odcinki `upcoming` pokazują się tylko jako zapowiedź „kolejny odcinek”).
3. Wgraj MP3 do S3: `../paper-driven-design-audio-infra/scripts/upload-episode.sh plik.mp3 002-slug`.
   Skrypt wypisze URL i rozmiar w bajtach — wpisz je w `audio.url` i `audio.bytes` (to `length` w `<enclosure>`).
4. Okładkę odcinka 3000x3000 wgraj `scripts/upload-image.sh okladka.jpg episodes/002-slug-3000x3000.jpg` i wpisz URL w `image`.
5. Notatki PDF do `public/notes/`, zdjęcia prowadzących do `public/images/`.

Po pushu na `main` strona i feed budują się same; Spotify/Apple zobaczą nowy odcinek przy kolejnym odczycie feedu.

Najnowszy opublikowany odcinek automatycznie trafia do sekcji „Najnowszy” na landingu, a filtry tematów budują się z pola `tags`.

## Do podmiany przed startem

- `src/data/site.ts` → linki do Spotify / Apple / YouTube, profile prowadzących, `newsletterAction` (URL formularza dostawcy newslettera; pusty = tryb demo).
- `src/data/site.ts` → `podcast.ownerEmail`: Apple i Spotify wymagają adresu właściciela w feedzie (wysyłają tam kod weryfikacyjny). Dopóki jest pusty, feed nie ma `<itunes:owner>`.
- `astro.config.mjs` → `site` (używany do canonical i RSS).
- `public/favicon.svg`.

## Kanał podcastowy

`/feed.xml` generuje `src/pages/feed.xml.ts` z danych odcinków (tylko `status: published` z `audio.url`).
Zgłaszasz ten adres raz do Spotify for Creators i Apple Podcasts Connect; potem nie zmieniaj go.
Sprawdzenie: https://podba.se/validate/ albo https://castfeedvalidator.com/.

Zasady, od których zależy, czy platformy dobrze odczytają odcinki:

- `audio.url` i `image` to pełne URL-e z CloudFrontu; raz opublikowany plik nie jest nadpisywany (poprawka = nowy slug i nowy URL).
- `audio.bytes` musi zgadzać się z rozmiarem pliku (skrypt uploadu go wypisuje).
- `guid` odcinka to URL jego strony (`/odcinki/<id>/`) — stały nawet po podmianie pliku audio.
- Odcinek `000` ma `itunes:episodeType = trailer`, pozostałe `full`.
