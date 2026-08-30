export type Lang = "tr" | "en";

export type Localized = { tr: string; en: string };

export type TimelineStop = {
  id: string;
  when: Localized;
  place: Localized;
  role?: Localized;
  note?: Localized;
  tags?: Localized[];
  href?: string;
  photo?: string;
  photoAlt?: Localized;
};

export function pick(lang: Lang, text: Localized): string {
  return text[lang];
}

export const PLATES = [
  "profile",
  "timeline",
  "projects",
  "contact",
] as const;

export type PlateId = (typeof PLATES)[number];

export const profile = {
  givenName: "Melike",
  familyName: "Külahcı",
  fullName: "Melike Külahcı",
  githubUser: "Melikeda",
  email: "m.edakulahci@mail.com",
  links: {
    github: "https://github.com/Melikeda",
    linkedin: "https://www.linkedin.com/in/melike-kulahci",
    medium: "https://medium.com/@m.edakulahci",
    kaggle: "https://www.kaggle.com/melikeklahc",
    university: "https://www.duzce.edu.tr/",
  },
};

export const ui = {
  skip: { tr: "İçeriğe geç", en: "Skip to content" },
  folio: { tr: "Sayfa sayfa", en: "Paged" },
  flat: { tr: "Kaydır", en: "Scroll" },
  paper: { tr: "Açık", en: "Light" },
  ink: { tr: "Koyu", en: "Dark" },
  theme: { tr: "Tema", en: "Theme" },
  view: { tr: "Görünüm", en: "View" },
  viewNote: {
    tr: "Sayfa sayfa: her bölüm tam ekran. Kaydır: normal sayfa.",
    en: "Paged: one full screen per section. Scroll: a normal page.",
  },
  open: { tr: "Aç", en: "Open" },
  demo: { tr: "Canlı", en: "Live" },
  repo: { tr: "Kod", en: "Code" },
  plates: {
    profile: { tr: "Profil", en: "Profile" },
    timeline: { tr: "Timeline", en: "Timeline" },
    projects: { tr: "Proje", en: "Project" },
    contact: { tr: "İletişim", en: "Contact" },
  } satisfies Record<PlateId, Localized>,
};

export const intro = {
  role: {
    tr: "Bilgisayar Mühendisliği",
    en: "Computer Engineering",
  },
  school: {
    tr: "Düzce Üniversitesi",
    en: "Düzce University",
  },
  film: [
    {
      src: "/profile/03.jpg",
      alt: {
        tr: "İskelede, gün batımında",
        en: "On a pier at golden hour",
      },
    },
    {
      src: "/profile/04.jpg",
      alt: {
        tr: "Taş duvarın önünde",
        en: "In front of a stone wall",
      },
    },
    {
      src: "/profile/05.jpg",
      alt: {
        tr: "Örgülü saçlarla dışarıda",
        en: "Outdoors with braided hair",
      },
    },
    {
      src: "/profile/01.jpg",
      alt: {
        tr: "Sarı çiçekle, kapüşonlu",
        en: "In a hoodie, with a yellow flower",
      },
    },
    {
      src: "/profile/02.jpg",
      alt: {
        tr: "Teknede, Galata arkasında",
        en: "On a ferry, Galata behind",
      },
    },
    {
      src: "/profile/06.jpg",
      alt: {
        tr: "Parkta, akşam ışığında",
        en: "In the park at dusk",
      },
    },
    {
      src: "/profile/07.jpg",
      alt: {
        tr: "Karlı ormanda",
        en: "In a snowy forest",
      },
    },
    {
      src: "/profile/08.jpg",
      alt: {
        tr: "Teknede, kanyon arasında",
        en: "On a boat in a river canyon",
      },
    },
    {
      src: "/profile/09.jpg",
      alt: {
        tr: "Kotor’da, eski kent duvarının önünde",
        en: "In Kotor, in front of the old town wall",
      },
    },
    {
      src: "/profile/10.jpg",
      alt: {
        tr: "Kırmızı lalelerle",
        en: "With red tulips",
      },
    },
    {
      src: "/profile/11.jpg",
      alt: {
        tr: "Sarı çiçek tarlasında",
        en: "In a field of yellow flowers",
      },
    },
    {
      src: "/profile/12.jpg",
      alt: {
        tr: "Bulutların üstünde, yamaç paraşütü",
        en: "Above the clouds, a paraglider",
      },
    },
    {
      src: "/profile/13.jpg",
      alt: {
        tr: "Alacakaranlıkta, lunapark geride",
        en: "At dusk, Ferris wheel in the distance",
      },
    },
  ] as { src: string; alt: Localized }[],
};

export const timeline: {
  title: Localized;
  emptyPhoto: Localized;
  stops: TimelineStop[];
} = {
  title: { tr: "Timeline", en: "Timeline" },
  emptyPhoto: { tr: "Anı fotoğrafı", en: "A still from there" },
  stops: [
    {
      id: "duzce",
      when: { tr: "2022 · hala devam etmekte", en: "2022 · still ongoing" },
      place: { tr: "Düzce Üniversitesi", en: "Düzce University" },
      role: {
        tr: "Bilgisayar Mühendisliği · 4. sınıf",
        en: "Computer Engineering · 4th year",
      },
      tags: [
        { tr: "Yazılım", en: "Software" },
        { tr: "Veri", en: "Data" },
        { tr: "Bilgisayarlı görü", en: "Computer vision" },
        { tr: "Machine learning", en: "Machine learning" },
        { tr: "C++", en: "C++" },
        { tr: "Python", en: "Python" },
        { tr: "OOP", en: "OOP" },
        { tr: "Takım çalışması", en: "Teamwork" },
      ],
      href: "https://www.duzce.edu.tr/",
      photo: "/campus/duzce.jpg",
      photoAlt: {
        tr: "Düzce Üniversitesi kampüsünde, çiçekli ağacın önünde.",
        en: "On the Düzce University campus, by a flowering tree.",
      },
    },
    {
      id: "dld",
      when: { tr: "Ekim 2024 – Mayıs 2025", en: "Oct 2024 – May 2025" },
      place: { tr: "Değişim Liderleri Derneği", en: "Değişim Liderleri Derneği" },
      role: {
        tr: "Gönüllü · Kıvılcımlar Programı · Kuanta",
        en: "Volunteer · Kıvılcımlar Programme · Kuanta",
      },
      note: {
        tr: "Liderliğe İlk Adım Çalıştayı. Kuanta ile PCOS farkındalık projesi.",
        en: "First Step to Leadership workshop. PCOS awareness project with Kuanta.",
      },
      tags: [
        { tr: "Liderlik", en: "Leadership" },
        { tr: "Takım çalışması", en: "Teamwork" },
        { tr: "Paydaş bulma", en: "Stakeholder outreach" },
        { tr: "PCOS çalışmaları", en: "PCOS work" },
      ],
      href: "https://www.degisimliderleri.org/",
      photo: "/timeline/dld.jpg",
      photoAlt: {
        tr: "Değişim Liderleri Derneği, Liderliğe İlk Adım Çalıştayı ekip fotoğrafı.",
        en: "Değişim Liderleri Derneği, First Step to Leadership workshop group photo.",
      },
    },
    {
      id: "argenova",
      when: { tr: "Temmuz 2025 – Ağustos 2025", en: "July 2025 – August 2025" },
      place: { tr: "Argenova", en: "Argenova" },
      role: {
        tr: "Intern · online bilişim stajı",
        en: "Intern · remote informatics",
      },
      note: {
        tr: "Uzaktan, kısa yaz dönemi.",
        en: "Remote, a short summer term.",
      },
      tags: [
        { tr: "Excel/CSV", en: "Excel/CSV" },
        { tr: "Girin", en: "Girin" },
        { tr: "FastAPI", en: "FastAPI" },
        { tr: "Ollama", en: "Ollama" },
        { tr: "LLaMA 3", en: "LLaMA 3" },
        { tr: "Qdrant", en: "Qdrant" },
        { tr: "RAG", en: "RAG" },
        { tr: "Flutter", en: "Flutter" },
        { tr: "AI Mesai Chatbot", en: "AI hours chatbot" },
      ],
      href: "https://github.com/Melikeda/Argenova_Internship",
      photo: "/campus/argenova.jpg",
      photoAlt: {
        tr: "Argenova stajında dizüstü: kod ve model eğitimi. Ofis arkası bulanık.",
        en: "Laptop during the Argenova internship: code and model training. Office behind is blurred.",
      },
    },
    {
      id: "cerebrum",
      when: { tr: "Haziran 2026 – Ağustos 2026", en: "June 2026 – August 2026" },
      place: {
        tr: "Cerebrum Tech · Bilkent Cyberpark, Ankara",
        en: "Cerebrum Tech · Bilkent Cyberpark, Ankara",
      },
      role: { tr: "AI Intern · Ar-Ge · ofis", en: "AI Intern · R&D · on site" },
      tags: [
        { tr: "YOLOv8n", en: "YOLOv8n" },
        { tr: "OpenCV", en: "OpenCV" },
        { tr: "EasyOCR", en: "EasyOCR" },
        { tr: "RapidFuzz", en: "RapidFuzz" },
        { tr: "FastAPI", en: "FastAPI" },
        { tr: "Flutter", en: "Flutter" },
        { tr: "Docker", en: "Docker" },
        { tr: "Kaggle", en: "Kaggle" },
        { tr: "Medium", en: "Medium" },
      ],
      href: "https://github.com/Melikeda/yolocilin",
      photo: "/campus/cerebrum.jpg",
      photoAlt: {
        tr: "Cerebrum Tech ofisinde yeşil duvar ve logo.",
        en: "Cerebrum Tech green wall and logo.",
      },
    },
    {
      id: "lcoy",
      when: { tr: "21–23 Ağustos 2026", en: "21–23 Aug 2026" },
      place: { tr: "LCOY Türkiye 2026", en: "LCOY Türkiye 2026" },
      role: {
        tr: "Katılımcı · YOUNGO / UNFCCC",
        en: "Participant · YOUNGO / UNFCCC",
      },
      note: {
        tr: "TOBB İkiz Kuleler, Ankara. COP31 yolunda yerel gençlik iklim konferansı.",
        en: "TOBB Twin Towers, Ankara. Local Conference of Youth on the road to COP31.",
      },
      tags: [
        { tr: "İklim", en: "Climate" },
        { tr: "Sürdürülebilirlik", en: "Sustainability" },
        { tr: "Politika", en: "Policy" },
        { tr: "Gençlik savunuculuğu", en: "Youth advocacy" },
        { tr: "Uluslararası iş birliği", en: "International cooperation" },
      ],
      href: "https://unfccc.int/topics/education-and-youth/youngo",
      photo: "/timeline/lcoy.jpg",
      photoAlt: {
        tr: "LCOY Türkiye 2026, TOBB İkiz Kuleler, Ankara.",
        en: "LCOY Türkiye 2026, TOBB Twin Towers, Ankara.",
      },
    },
  ] satisfies TimelineStop[],
};

export const projects = {
  title: { tr: "Yolocilin", en: "Yolocilin" },
  line: {
    tr: "Kamerayla ilaç kutusunu çek. Uygulama okur, katalogla eşler, kısaca açıklar.",
    en: "Point the camera at a medicine box. The app reads it, matches a catalog, and explains.",
  },
  href: "https://github.com/Melikeda/yolocilin",
  dataset: {
    label: { tr: "Kaggle veri seti", en: "Kaggle dataset" },
    href: "https://www.kaggle.com/datasets/melikeklahc/yolocilin-medicine-box-detection",
  },
  disclaimer: {
    tr: "Tıbbi tavsiye değil — paket yazısını okur, eczacıya bırakır.",
    en: "Not medical advice — it reads the pack, then leaves the rest to a pharmacist.",
  },
  beats: [
    {
      n: "01",
      word: { tr: "Giriş", en: "Home" },
      note: {
        tr: "Hızlı ilaç tarama: kamera, barkod veya galeri.",
        en: "Quick scan: camera, barcode, or gallery.",
      },
    },
    {
      n: "02",
      word: { tr: "Önizleme", en: "Preview" },
      note: {
        tr: "Fotoğrafı gör, OCR modunu seç, analiz et.",
        en: "See the photo, pick an OCR mode, then analyze.",
      },
    },
    {
      n: "03",
      word: { tr: "Sonuç", en: "Result" },
      note: {
        tr: "Kutu eşleşir, kısa bilgi açılır.",
        en: "The box matches and a short note opens.",
      },
    },
    {
      n: "04",
      word: { tr: "Barkod", en: "Barcode" },
      note: {
        tr: "Kodu çerçeveye hizala, oku.",
        en: "Align the code and read it.",
      },
    },
    {
      n: "05",
      word: { tr: "Geçmiş", en: "History" },
      note: {
        tr: "Önceki taramalar bir listede durur.",
        en: "Earlier scans stay in a list.",
      },
    },
  ],
};

export const contact = {
  title: { tr: "İletişim.", en: "Contact." },
  webHint: {
    tr: "Kırmızı düğmeyi çek, bırak.",
    en: "Pull the red button, then let go.",
  },
  webTrigger: { tr: "Ağ", en: "Web" },
  mailLabel: { tr: "E-posta", en: "Email" },
  campusNote: {
    tr: "Düzce Üniversitesi · Mühendislik Fakültesi",
    en: "Düzce University · Faculty of Engineering",
  },
  campusPhoto: "/campus/muhendislik.jpg",
  campusPhotoAlt: {
    tr: "Mühendislik Fakültesi tabelasının önünde arkadaşlarla.",
    en: "With friends in front of the Faculty of Engineering sign.",
  },
  tiles: [
    {
      id: "mail" as const,
      label: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      id: "linkedin" as const,
      label: "LinkedIn",
      href: profile.links.linkedin,
    },
    {
      id: "github" as const,
      label: "GitHub",
      href: profile.links.github,
    },
    {
      id: "kaggle" as const,
      label: "Kaggle",
      href: profile.links.kaggle,
    },
    {
      id: "medium" as const,
      label: "Medium",
      href: profile.links.medium,
    },
  ],
};
