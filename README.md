# Paper Driven Design — strona podcastu

Astro 7 + Tailwind CSS 4. Strona statyczna: landing, strony odcinków, kanał podcastowy `/feed.xml`.
Pliki audio i okładki leżą w S3 za CloudFrontem (Terraform w `../stitch_paper_driven_design_landing 3/paper-driven-design-audio-infra`).

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
| `src/pages/llms.txt.ts` | Streszczenie strony w Markdownie dla asystentów AI (`/llms.txt`) |
| `src/lib/seo.ts` | Dane strukturalne schema.org (PodcastSeries, PodcastEpisode, Person, FAQPage, okruszki) |
| `src/pages/404.astro` | Strona błędu (GitHub Pages serwuje `404.html`) |
| `src/scripts/player.ts` | Odtwarzacz audio (działa z plikiem MP3, a bez niego w trybie podglądu) |
| `src/pages/backoffice/index.astro` | Backoffice: generator intra (`/backoffice/`), bez indeksowania |
| `src/scripts/intro-generator.js`, `src/vendor/mp4-muxer.js` | Logika generatora (canvas + WebCodecs) i muxer MP4 |
| `public/backoffice/intro/` | Zasoby generatora: dżingiel i zdjęcia prowadzących |

## Dodanie odcinka

1. Skopiuj `src/content/episodes/001.yaml` jako `002.yaml` i uzupełnij pola.
2. Ustaw `status: published` (odcinki `upcoming` pokazują się tylko jako zapowiedź „kolejny odcinek”).
3. Wgraj MP3 do S3: `../stitch_paper_driven_design_landing 3/paper-driven-design-audio-infra/scripts/upload-episode.sh plik.mp3 002-slug`.
   Skrypt wypisze URL i rozmiar w bajtach — wpisz je w `audio.url` i `audio.bytes` (to `length` w `<enclosure>`).
4. Link do wersji wideo wpisz w `youtube` (pokazuje się jako przycisk na stronie odcinka, na landingu i w feedzie).
   Link do odcinka w Spotify wpisz w `spotify`, a w Apple Podcasts w `apple` (przyciski na stronie odcinka i na landingu).
   Linki Apple do wszystkich odcinków zwraca `https://itunes.apple.com/lookup?id=6827512045&entity=podcastEpisode` (pole `trackViewUrl`).
5. Okładkę odcinka 3000x3000 wgraj `scripts/upload-image.sh okladka.jpg episodes/002-slug-3000x3000.jpg` i wpisz URL w `image`.
6. Notatki PDF do `public/notes/`, zdjęcia prowadzących do `public/images/`.

Po pushu na `main` strona i feed budują się same; Spotify/Apple zobaczą nowy odcinek przy kolejnym odczycie feedu.

Najnowszy opublikowany odcinek automatycznie trafia do sekcji „Najnowszy” na landingu, a filtry tematów budują się z pola `tags`.

## Do podmiany przed startem

- `src/data/site.ts` → linki do Spotify / Apple / YouTube, profile prowadzących, `newsletterAction` (URL formularza dostawcy newslettera; pusty = tryb demo).
- `src/data/site.ts` → `podcast.ownerEmail`: Apple i Spotify wymagają adresu właściciela w feedzie (wysyłają tam kod weryfikacyjny). Dopóki jest pusty, feed nie ma `<itunes:owner>`.
- `astro.config.mjs` → `site` (używany do canonical i RSS).
- `public/favicon.svg`.

## SEO i AEO

Co strona robi sama przy każdym buildzie:

- `sitemap-index.xml` (integracja `@astrojs/sitemap`), `robots.txt` w `public/` wpuszcza wszystkie roboty, także asystentów AI, i wskazuje sitemapę.
- JSON-LD w `<head>`: landing = WebSite + Organization + PodcastSeries + Person (prowadzący) + FAQPage; strona odcinka = PodcastEpisode (z AudioObject, VideoObject z YouTube, rozdziałami jako Clip, transkrypcją) + BreadcrumbList.
- Meta: canonical, robots, Open Graph z `og:image` 3000x3000 i `og:audio` (MP3) na odcinkach, `article:published_time`, Twitter card.
- `/llms.txt`: streszczenie podcastu, prowadzących, odcinków i FAQ w Markdownie (format llmstxt.org) dla ChatGPT, Claude, Perplexity.
- Sekcja FAQ na landingu z `site.faq` — treść, którą asystenci AI cytują najchętniej; edytuj tam, schema i `llms.txt` zaktualizują się same.

Sitemapa: `https://paperdriven.design/sitemap-index.xml` (wskazuje `sitemap-0.xml`). Każdy URL ma `lastmod`: odcinek = data publikacji,
strona główna = data najnowszego odcinka, polityka = `legal.policyUpdatedIso`. Bez `/backoffice/`, feedów i 404.

### Google Search Console krok po kroku

1. Wejdź na https://search.google.com/search-console i kliknij „Dodaj usługę”.
2. Wybierz typ usługi:
   - **Domena** (`paperdriven.design`, zalecane: obejmuje http/https i subdomeny, w tym `api.`): Google poda rekord TXT,
     dodaj go w panelu DNS domeny i kliknij „Zweryfikuj” (propagacja do kilkudziesięciu minut).
   - **Prefiks URL** (`https://paperdriven.design/`): wybierz metodę „Tag HTML”, skopiuj samą wartość `content="..."`
     i wpisz ją w `src/data/site.ts` → `seo.googleSiteVerification`. Push na `main`, poczekaj na deploy (ok. 1–2 min),
     dopiero potem kliknij „Zweryfikuj”. Tag zostaje w kodzie na stałe, bo Google okresowo sprawdza go ponownie.
3. Po weryfikacji: menu „Mapy witryn” → wpisz `sitemap-index.xml` → „Prześlij”. Stan powinien zmienić się na „Powodzenie”
   z liczbą wykrytych adresów równą liczbie stron (strona główna + odcinki + polityka).
4. „Sprawdzanie adresu URL” → wklej `https://paperdriven.design/` → „Poproś o zindeksowanie”. Powtórz dla najnowszego odcinka.
   Indeksowanie nowej domeny trwa zwykle od kilku dni do 2–3 tygodni.
5. Po kilku dniach zajrzyj do „Strony” (indeksowanie) i „Ulepszenia” (okruszki, filmy). Błędy danych strukturalnych pokaże też
   https://search.google.com/test/rich-results.
6. Bing Webmaster Tools (https://www.bing.com/webmasters) ma opcję importu usługi z Search Console, bez osobnej weryfikacji.

Do zrobienia ręcznie:

- Test danych strukturalnych: https://validator.schema.org/ i https://search.google.com/test/rich-results (wklej URL strony odcinka).

## Backoffice: generator intra

`/backoffice/` to strona dla prowadzących z generatorem intra wideo (ten sam kod co `../pdd-intro-generator.html`,
osadzony w layoucie strony). Dżingiel „Clean Code, Clear Calls” i zdjęcia Kamila i Artura są wgrane na stałe
(`public/backoffice/intro/`), pola plików pozwalają je jednorazowo podmienić. Numer odcinka podpowiada się sam
(najbliższy `upcoming`, a gdy go nie ma, ostatni opublikowany + 1), data to dzień dzisiejszy.
MP4 (H.264 + AAC) powstaje w przeglądarce przez WebCodecs: Chrome, Edge albo Safari 17+.

Strona jest wyłączona z wyszukiwarek na trzy sposoby: `noindex, nofollow` w `<head>`, `Disallow: /backoffice`
w `robots.txt` i filtr w `astro.config.mjs`, który nie wpuszcza jej do sitemapy. Nie jest nigdzie linkowana.
To ukrycie, nie zabezpieczenie: kto zna adres, wejdzie.

## Kanał podcastowy

`/feed.xml` generuje `src/pages/feed.xml.ts` z danych odcinków (tylko `status: published` z `audio.url`).
Zgłaszasz ten adres raz do Spotify for Creators i Apple Podcasts Connect; potem nie zmieniaj go.
Sprawdzenie: https://podba.se/validate/ albo https://castfeedvalidator.com/.

Zasady, od których zależy, czy platformy dobrze odczytają odcinki:

- `audio.url` i `image` to pełne URL-e z CloudFrontu; raz opublikowany plik nie jest nadpisywany (poprawka = nowy slug i nowy URL).
- `audio.bytes` musi zgadzać się z rozmiarem pliku (skrypt uploadu go wypisuje).
- `guid` odcinka to URL jego strony (`/odcinki/<id>/`) — stały nawet po podmianie pliku audio.
- Odcinek `000` ma `itunes:episodeType = trailer`, pozostałe `full`.

## Analityka (PostHog)

Konfiguracja w `src/data/site.ts` → `analytics` (klucz projektu i host `https://eu.i.posthog.com`, czyli PostHog EU Cloud we Frankfurcie). Pusty klucz albo `npm run dev` = skrypt nie jest renderowany.

Zbieramy tylko dwie rzeczy: odsłony stron (`$pageview`) i uruchomienia odtwarzacza (zdarzenie `episode_play` z polami `episode`, `episode_title`, wysyłane raz na załadowanie strony z `src/scripts/player.ts`). Skrypt działa w trybie bez cookies (`persistence: 'memory'`), bez autocapture, nagrywania sesji, map ciepła i ankiet, i respektuje Do Not Track. Dzięki temu strona nie potrzebuje banera zgody. Konsekwencja: PostHog nie rozpoznaje powracających osób, więc „unikalni użytkownicy” to w praktyce liczba wizyt.

W projekcie PostHog włącz **Discard client IP data** (Settings → Project → Data management), bo polityka prywatności obiecuje, że IP nie jest zapisywany ze zdarzeniem.

Każda zmiana zakresu zbieranych danych wymaga aktualizacji `/polityka-prywatnosci/` (sekcje II, III, IV, V, VI, VIII) i daty `legal.policyUpdated`.
