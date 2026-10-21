/**
 * Konfiguracja serwisu Paper Driven Design.
 * Tutaj podmieniasz linki do platform, profile prowadzących i endpoint newslettera.
 */
export const site = {
  name: 'Paper Driven Design',
  tagline: 'Polski Podcast Architektury i Projektowania Systemów',
  title: 'Paper Driven Design — Polski Podcast Architektury i Projektowania Systemów',
  description:
    'Podcast o architekturze oprogramowania, Event Stormingu, modelowaniu domeny i miękkich kompetencjach technicznych liderów. Zrozumienie na papierze, spokój na produkcji.',
  url: 'https://paperdriven.design',
  locale: 'pl',
  season: 'SEZON 2026',
  cities: 'WARSZAWA / WROCŁAW',
  cadence: 'Nowe odcinki co dwa tygodnie',
  copyright: '© 2026 Paper Driven Design. Kamil Kiełbasa & Artur Wojnar. Wszystkie prawa zastrzeżone.',

  /** Dane do polityki prywatności (/polityka-prywatnosci/). Administrator = osoby prowadzące listę newslettera. */
  legal: {
    administrator: 'Kamil Kiełbasa i Artur Wojnar, prowadzący podcast Paper Driven Design',
    /** Adres do spraw danych osobowych — publiczny na stronie polityki. UZUPEŁNIJ przed publikacją. */
    contactEmail: 'kamil@linecode.pl',
    policyUpdated: '21 października 2026',
    policyPath: '/polityka-prywatnosci/',
  },

  /** SEO: kod weryfikacyjny Google Search Console (meta google-site-verification). Pusty = tag pominięty. */
  seo: {
    googleSiteVerification: '',
  },

  /** Analityka: PostHog (EU Cloud, Frankfurt). Pusty klucz = analityka wyłączona.
   *  Tryb bez cookies: zbieramy tylko odsłony stron i uruchomienia odtwarzacza (zdarzenie `episode_play`). */
  analytics: {
    posthogKey: 'phc_BzYbsmrdpHJmwazbFAgeisVNp7bLeVxJZg3VEFpHit4P',
    posthogHost: 'https://eu.i.posthog.com',
  },

  /** Formularz newslettera: endpoint zapisu do Brevo (projekt Vercel w katalogu api/).
   *  Pusty string = formularz działa w trybie demo (bez wysyłki). */
  newsletterAction: 'https://api.paperdriven.design/subscribe',

  /** Dane kanału podcastowego (feed.xml dla Spotify / Apple Podcasts). */
  podcast: {
    /** Kanoniczny adres feedu — ten zgłaszasz do Spotify i Apple. Nie zmieniaj po zgłoszeniu. */
    feedPath: '/feed.xml',
    /** <itunes:subtitle> — jedna linia pod nazwą programu w Apple. */
    subtitle: 'Polski podcast o architekturze i projektowaniu systemów',
    /** <description> i <itunes:summary> kanału (Spotify i Apple pokazują to jako opis programu; limit 4000 znaków).
     *  Pełny tekst i warianty: paper-driven-design-profile/apple-podcasts-i-spotify/pdd-opis-podcastu.txt */
    summary: `Paper Driven Design to polski podcast o architekturze oprogramowania i projektowaniu systemów. Prowadzą go Kamil Kiełbasa i Artur Wojnar, architekci z 15-letnim stażem każdy, którzy na co dzień projektują systemy, modernizują rozpadające się aplikacje i facylitują warsztaty łączące biznes z inżynierami.

Wychodzimy z prostego założenia: kod jest najdroższym miejscem na popełnianie błędów koncepcyjnych. Złożoność rozstrzyga się w rozmowie i na papierze, zanim powstanie pierwszy moduł. Dlatego rozmawiamy o tym, jak myśleć o systemie, a nie tylko jak go napisać.

O czym rozmawiamy:
• Domain-Driven Design w praktyce: bounded contexty, język wszechobecny, mapy kontekstów
• Event Storming, Domain Storytelling, Example Mapping, mapy Wardleya i inne metody warsztatowe
• Decyzje architektoniczne i ich koszt: modularne monolity, architektury sterowane zdarzeniami, event sourcing, chmura
• Złożoność systemów i walka z entropią w projektach, które żyją latami
• AI i LLM-y w pracy architekta: co naprawdę zmieniają, a co jest tylko kolejnym kompilatorem Fortrana
• Umiejętności miękkie: facylitacja, komunikacja z biznesem, prowadzenie zespołów przez trudne zmiany
• Nasze własne błędy z produkcji, żebyś nie musiał ich powtarzać

Dla kogo: dla programistów, tech leadów i architektów, którzy chcą projektować systemy świadomie, oraz dla osób z biznesu, które chcą zrozumieć, jak rozmawiać z inżynierami o produkcie.

Format: rozmowa dwóch praktyków, 30-60 minut, bez sponsorowanych wstawek. Co jakiś czas odcinki warsztatowe, w których modelujemy na żywo.

Nowe odcinki co dwa tygodnie. Notatki, materiały i transkrypcje do każdego odcinka: https://paperdriven.design

Prowadzący:
Kamil Kiełbasa — architekt oprogramowania i tech lead, Microsoft MVP, certyfikowany architekt AWS i Azure. Pisze na bd90.pl.
Artur Wojnar — solutions architect, konsultant i prelegent. Pragmatyk projektowania, fan modernizacji i wizualnych metod warsztatowych. Pisze na planthencode.com.`,
    /** Okładka 3000x3000 JPG (wymóg Apple: 1400–3000 px, RGB, JPG/PNG). */
    cover: 'https://d3057vo2xyrx9j.cloudfront.net/images/pdd-cover-3000x3000.jpg',
    author: 'Kamil Kiełbasa & Artur Wojnar',
    /** Właściciel feedu: Apple i Spotify wysyłają na ten adres kod weryfikacyjny i powiadomienia.
     *  Adres jest publiczny w feedzie. Pusty string = tag <itunes:owner> pominięty (Apple i Spotify go wymagają). */
    ownerName: 'Paper Driven Design',
    ownerEmail: '',
    /** Kategorie Apple Podcasts: https://podcasters.apple.com/support/1691-apple-podcasts-categories */
    category: 'Technology',
    explicit: false,
    type: 'episodic' as const,
    language: 'pl',
  },

  nav: [
    { label: 'Odcinki', href: '/#odcinki' },
    { label: 'Tematy', href: '/#tematy' },
    { label: 'Prowadzący', href: '/#prowadzacy' },
    { label: 'Manifest', href: '/#manifest' },
    { label: 'Newsletter', href: '/#newsletter' },
  ],

  platforms: [
    { label: 'Spotify', href: 'https://open.spotify.com/show/7wi5404ErNrFIvkafCVbLN' },
    { label: 'Apple Podcasts', href: '#', comingSoon: true }, // po zatwierdzeniu feedu wpisz link i usuń comingSoon
    { label: 'YouTube', href: 'https://www.youtube.com/@PaperDrivenDesign' },
    { label: 'RSS', href: '/feed.xml' },
  ],

  hosts: [
    {
      id: 'kamil',
      name: 'Kamil Kiełbasa',
      initials: 'KK',
      role: 'ARCHITEKT OPROGRAMOWANIA · FACYLITATOR EVENT STORMING',
      roleShort: 'Software Architect · Tech Lead · Microsoft MVP',
      bio: 'Architekt oprogramowania i tech lead z 15-letnim stażem, Microsoft MVP, certyfikowany architekt AWS i Azure. Projektuje skalowalne systemy w .NET i chmurze. DDD i Event Storming stosuje na co dzień i uczy ich zespoły. Trener i prelegent, pisze na bd90.pl. Gdy odkłada klawiaturę, sięga po gitarę.',
      photo: '/images/hosts/kamil.webp',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bd-90/' },
        { label: 'Blog', href: 'https://bd90.pl/' },
        { label: 'Sessionize', href: 'https://sessionize.com/bd90/' },
      ],
    },
    {
      id: 'artur',
      name: 'Artur Wojnar',
      initials: 'AW',
      role: 'Solutions Architect · Consultant · Speaker',
      roleShort: 'Solutions Architect · Consultant · Speaker',
      bio: 'Pragmatyk projektowania architektury. Jego ulubiona domena to healthcare. Fan modernizacji rozpadających się aplikacji i entuzjasta współpracy z klientem. Uwielbia wizualne metody warsztatowe łączące biznes i tech. Walczy dzielnie z galopującą entropią za pomocą DDD, zdarzeń i event sourcingu.',
      photo: '/images/hosts/artur.webp',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/artur-wojnar-a19349a6' },
        { label: 'Blog', href: 'https://www.planthencode.com/' },
        { label: 'Sessionize', href: 'https://sessionize.com/arturwojnar/' },
      ],
    },
  ],

  /** Pytania i odpowiedzi na landingu + schema FAQPage + /llms.txt (asystenci AI cytują takie bloki). */
  faq: [
    {
      q: 'Czym jest Paper Driven Design?',
      a: 'To polski podcast o architekturze oprogramowania i projektowaniu systemów. Prowadzą go Kamil Kiełbasa i Artur Wojnar, architekci z 15-letnim stażem. Rozmawiamy o tym, jak myśleć o systemie, zanim powstanie kod: o Domain-Driven Design, Event Stormingu, decyzjach architektonicznych i o tym, co AI naprawdę zmienia w pracy architekta.',
    },
    {
      q: 'Dla kogo jest ten podcast?',
      a: 'Dla programistów, tech leadów i architektów, którzy chcą projektować systemy świadomie, oraz dla osób z biznesu, które chcą lepiej rozmawiać z inżynierami o produkcie. Nie wymagamy wiedzy o konkretnym języku ani frameworku.',
    },
    {
      q: 'Gdzie można słuchać Paper Driven Design?',
      a: 'Na Spotify, na YouTube (wersja wideo) i bezpośrednio na tej stronie. Kanał RSS https://paperdriven.design/feed.xml działa w każdej aplikacji podcastowej. Apple Podcasts wkrótce.',
    },
    {
      q: 'Jak często pojawiają się nowe odcinki?',
      a: 'Nowe odcinki co dwa tygodnie. Każdy ma własną stronę z opisem, linkami do materiałów i, gdy to możliwe, rozdziałami i transkrypcją.',
    },
    {
      q: 'Co znaczy „paper driven”?',
      a: 'Że złożoność rozstrzygamy na papierze, zanim trafi do kodu. Kod jest najdroższym miejscem na popełnianie błędów koncepcyjnych, więc najpierw modelujemy, rysujemy i rozmawiamy z biznesem, a dopiero potem programujemy.',
    },
  ],

  manifest: {
    quote:
      '„Kod jest najdroższym miejscem na popełnianie błędów koncepcyjnych. Złożoność rozstrzyga się w rozmowie i na wielkich arkuszach papieru.”',
    paragraphs: [
      'Papier jest najbardziej bezlitosnym, a zarazem najtańszym środowiskiem do testowania hipotez architektonicznych. Jeśli nie potrafisz wytłumaczyć przepływu danych za pomocą flamastra na rolce papieru pakowego, nie pomoże Ci żaden framework, Kubernetes ani architektura rozproszona.',
      'W podkaście skupiamy się na rzemiośle myślenia: zadawaniu właściwych pytań, wyznaczaniu granic odpowiedzialności i facylitacji dialogu pomiędzy programistami a ludźmi biznesu.',
    ],
    pillars: [
      {
        title: 'MODELUJ PRZED KODEM',
        text: 'Klarowność konceptualna oszczędza setki roboczogodzin w fazie wdrożenia.',
      },
      {
        title: 'JĘZYK WSZECHOBECNY',
        text: 'Mówimy językiem problemu biznesowego, a nie żargonem bazy danych.',
      },
      {
        title: 'LUDZIE I RELACJE',
        text: 'Architektura to w 70% psychologia, negocjacje i budowanie porozumienia.',
      },
    ],
  },
} as const;

export type Host = (typeof site.hosts)[number];
