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

  /** Formularz newslettera: wstaw URL dostawcy (Buttondown, Mailchimp, ConvertKit…).
   *  Pusty string = formularz działa w trybie demo (bez wysyłki). */
  newsletterAction: '',
  newsletterSubscribers: '3 400',

  nav: [
    { label: 'Odcinki', href: '/#odcinki' },
    { label: 'Tematy', href: '/#tematy' },
    { label: 'Prowadzący', href: '/#prowadzacy' },
    { label: 'Manifest', href: '/#manifest' },
    { label: 'Newsletter', href: '/#newsletter' },
  ],

  platforms: [
    { label: 'Spotify', href: '#' },
    { label: 'Apple Podcasts', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'RSS', href: '/rss.xml' },
    { label: 'LinkedIn', href: '#' },
  ],

  hosts: [
    {
      id: 'kamil',
      name: 'Kamil Kiełbasa',
      initials: 'KK',
      role: 'ARCHITEKT OPROGRAMOWANIA · FACYLITATOR EVENT STORMING',
      roleShort: 'Lead Systems Architect · Domain-Driven Design practitioner',
      bio: 'Specjalizuje się w rozplątywaniu złożonych domen biznesowych przy użyciu warsztatów Event Storming i Context Mapping. Propagator pracy na papierze przed napisaniem pierwszej linijki kodu produkcyjnego.',
      photo: '/images/hosts/kamil.webp',
      links: [
        { label: 'LinkedIn', href: '#' },
        { label: 'GitHub', href: '#' },
        { label: 'Substack', href: '#' },
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
