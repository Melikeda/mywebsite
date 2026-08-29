export type Lang = "tr" | "en";

export type Localized = { tr: string; en: string };

export function pick(lang: Lang, text: Localized): string {
  return text[lang];
}

export const PLATES = [
  "threshold",
  "about",
  "campus",
  "work",
  "worlds",
  "now",
  "door",
] as const;

export type PlateId = (typeof PLATES)[number];

export const profile = {
  givenName: "Melike",
  familyName: "Külahcı",
  fullName: "Melike Külahcı",
  githubUser: "Melikeda",
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
  folio: { tr: "Folyo", en: "Folio" },
  flat: { tr: "Düz", en: "Flat" },
  paper: { tr: "Kâğıt", en: "Paper" },
  ink: { tr: "Mürekkep", en: "Ink" },
  open: { tr: "Aç", en: "Open" },
  demo: { tr: "Canlı", en: "Live" },
  repo: { tr: "Kod", en: "Code" },
  plates: {
    threshold: { tr: "Eşik", en: "Threshold" },
    about: { tr: "İz", en: "Trace" },
    campus: { tr: "Kampüs", en: "Campus" },
    work: { tr: "İş", en: "Work" },
    worlds: { tr: "Dışarı", en: "Worlds" },
    now: { tr: "Şimdi", en: "Now" },
    door: { tr: "Kapı", en: "Door" },
  } satisfies Record<PlateId, Localized>,
};

export const threshold = {
  kicker: { tr: "Levha 00", en: "Plate 00" },
  role: {
    tr: "Bilgisayar mühendisliği öğrencisi · bilgisayarlı görü ve makine öğrenmesi",
    en: "Computer engineering student · computer vision and machine learning",
  },
  line: {
    tr: "Makinenin görmeyi öğrendiği yerde duruyorum.",
    en: "I work where machines learn to see.",
  },
  aside: {
    tr: "Kaydır. Ya da düz görünüme geç — recruiter için tek bakış.",
    en: "Scroll. Or switch to the flat view — one glance for a recruiter.",
  },
};

export const about = {
  kicker: { tr: "Levha 01 · yazısız biyografi", en: "Plate 01 · biography without a paragraph" },
  title: { tr: "Altı nesne, bir kişi.", en: "Six objects, one person." },
  hint: {
    tr: "Kartlara dokun. Metin yok; iz var.",
    en: "Touch a card. No paragraph — a trace.",
  },
  cards: [
    {
      id: "notebook",
      word: { tr: "merak", en: "curiosity" },
      caption: { tr: "Açık defter, yarım deney.", en: "An open notebook, a half-run experiment." },
    },
    {
      id: "campus",
      word: { tr: "kampüs", en: "campus" },
      caption: {
        tr: "Düzce Üniversitesi, bilgisayar mühendisliği.",
        en: "Düzce University, computer engineering.",
      },
    },
    {
      id: "vision",
      word: { tr: "görme", en: "vision" },
      caption: {
        tr: "Kamera, kutu, etiket: dünyayı çerçevelemek.",
        en: "Camera, box, label: framing the world.",
      },
    },
    {
      id: "product",
      word: { tr: "ürün", en: "product" },
      caption: {
        tr: "Model yetmez. API, uygulama, güvenlik eşiği.",
        en: "A model is not enough. API, app, a safety threshold.",
      },
    },
    {
      id: "writing",
      word: { tr: "yazı", en: "writing" },
      caption: {
        tr: "Öğrendiğini dışarıya bırakmak.",
        en: "Putting what I learn out in the open.",
      },
    },
    {
      id: "trail",
      word: { tr: "iz", en: "trail" },
      caption: {
        tr: "Staj, akademi, yarışma — aynı hat.",
        en: "Internships, academy, contests — one line.",
      },
    },
  ],
};

export const campus = {
  kicker: { tr: "Levha 02 · okul ve istasyonlar", en: "Plate 02 · school and stations" },
  title: { tr: "Akademik hat.", en: "The academic line." },
  stations: [
    {
      mark: "01",
      place: { tr: "Düzce Üniversitesi", en: "Düzce University" },
      role: { tr: "Bilgisayar Mühendisliği", en: "Computer Engineering" },
      note: {
        tr: "Asıl hat. Görü, veri, yazılım aynı masada.",
        en: "The main track. Vision, data, and software on the same desk.",
      },
      href: "https://www.duzce.edu.tr/",
    },
    {
      mark: "02",
      place: { tr: "Cerebrum Tech", en: "Cerebrum Tech" },
      role: { tr: "Ar-Ge stajı · Yolocilin", en: "R&D internship · Yolocilin" },
      note: {
        tr: "İlaç kutusu tanıma: modelden Flutter istemciye kadar.",
        en: "Medicine-box recognition: from the model to a Flutter client.",
      },
      href: "https://github.com/Melikeda/yolocilin",
    },
    {
      mark: "03",
      place: { tr: "Türkiye Yapay Zeka Akademisi", en: "Türkiye AI Academy" },
      role: { tr: "ML ve veri bilimi hattı", en: "ML and data-science track" },
      note: {
        tr: "Klasik ML’den duygu analizine: ölçülen iş.",
        en: "From classical ML to sentiment work you can measure.",
      },
      href: "https://turkiyeyapayzekaakademisi.com/",
    },
    {
      mark: "04",
      place: { tr: "Argenova · TNC", en: "Argenova · TNC" },
      role: { tr: "Staj izleri", en: "Internship traces" },
      note: {
        tr: "Sahada kod: not defteri değil, teslim.",
        en: "Code in the field — delivery, not a notebook.",
      },
      href: "https://github.com/Melikeda/Argenova_Internship",
    },
  ],
};

export const work = {
  kicker: { tr: "Levha 03 · seçilmiş iş", en: "Plate 03 · selected work" },
  title: { tr: "Az kart, net iz.", en: "Few cards, a clear trace." },
  items: [
    {
      id: "yolocilin",
      year: "2026",
      tags: ["YOLOv8", "EasyOCR", "FastAPI", "Flutter"],
      href: "https://github.com/Melikeda/yolocilin",
      live: null,
      title: { tr: "Yolocilin", en: "Yolocilin" },
      line: {
        tr: "İlaç kutusunu yanlış göstermemek üzere kurulmuş uçtan uca sistem.",
        en: "An end-to-end system built to refuse the wrong medicine rather than guess.",
      },
    },
    {
      id: "kariyer",
      year: "2025",
      tags: ["TypeScript", "AI", "Vercel"],
      href: "https://github.com/Melikeda/kariyerpusulam-gelecegin-meslekleri",
      live: "https://kariyerpusulam.vercel.app",
      title: { tr: "KariyerPusulam", en: "KariyerPusulam" },
      line: {
        tr: "Kodluyoruz bitirme işi: geleceğin meslekleri için keşif yüzeyi.",
        en: "Kodluyoruz capstone: a discovery surface for emerging careers.",
      },
    },
    {
      id: "imdb",
      year: "2025",
      tags: ["scikit-learn", "TF-IDF", "F1≈0.89"],
      href: "https://github.com/Melikeda/imdb-sentiment-analysis",
      live: null,
      title: { tr: "IMDB duygu", en: "IMDB sentiment" },
      line: {
        tr: "Klasik ML hâlâ işe yarar: TF-IDF ve ölçülmüş F1.",
        en: "Classical ML still ships: TF-IDF and a measured F1.",
      },
    },
    {
      id: "gesture",
      year: "2025",
      tags: ["OpenCV", "MediaPipe"],
      href: "https://github.com/Melikeda/gesture-volume-control",
      live: null,
      title: { tr: "El ile ses", en: "Gesture volume" },
      line: {
        tr: "El hareketiyle sistem sesi — görünün en sade hali.",
        en: "System volume from a hand — vision at its simplest.",
      },
    },
  ],
};

export const worlds = {
  kicker: { tr: "Levha 04 · dış dünyalar", en: "Plate 04 · outer worlds" },
  title: { tr: "Aynı kişi, dört kapı.", en: "Same person, four doors." },
  tiles: [
    {
      id: "linkedin",
      label: "LinkedIn",
      href: profile.links.linkedin,
      blurb: {
        tr: "İş ve staj hattı.",
        en: "Work and internships.",
      },
    },
    {
      id: "github",
      label: "GitHub",
      href: profile.links.github,
      blurb: {
        tr: `@${profile.githubUser} · kodun asıl yeri.`,
        en: `@${profile.githubUser} · where the code lives.`,
      },
    },
    {
      id: "kaggle",
      label: "Kaggle",
      href: profile.links.kaggle,
      blurb: {
        tr: "Veri, notebook, açık set.",
        en: "Data, notebooks, a public set.",
      },
    },
    {
      id: "medium",
      label: "Medium",
      href: profile.links.medium,
      blurb: {
        tr: "Öğrendikçe yazmak.",
        en: "Writing as I learn.",
      },
    },
  ],
};

export const now = {
  kicker: { tr: "Levha 05 · şu an", en: "Plate 05 · currently" },
  title: { tr: "Takip ettiğim hat.", en: "The line I am following." },
  items: [
    { tr: "Ürüne giden bilgisayarlı görü", en: "Computer vision that reaches a product" },
    { tr: "Yanlış tahmini reddeden eşikler", en: "Thresholds that refuse a wrong guess" },
    { tr: "Veritabanı serisi · Medium", en: "A database series on Medium" },
    { tr: "FastAPI + Flutter teslimi", en: "Shipping FastAPI with Flutter" },
    { tr: "Klasik ML’i ölçerek tutmak", en: "Keeping classical ML, measured" },
    { tr: "Açık veri ve tekrarlanabilir deneme", en: "Open data and repeatable trials" },
  ],
};

export const door = {
  kicker: { tr: "Levha 06 · kapı", en: "Plate 06 · the door" },
  title: { tr: "Buradan çıkılır.", en: "This is the way out." },
  body: {
    tr: "İlan, staj, araştırma — LinkedIn veya GitHub yeter. CV dosyasını sonra bu levhaya ekleriz.",
    en: "Roles, internships, research — LinkedIn or GitHub is enough. A CV file can join this plate later.",
  },
  credit: {
    tr: "Bu site bir folyo: yön ve metin bana ait. Üretimde Cursor kullandım; şablon yapıştırmadım.",
    en: "This site is a folio: direction and copy are mine. I used Cursor to build it — I did not paste a template.",
  },
};
