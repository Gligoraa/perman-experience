export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  stylistId: string;
  stylistName: string;
  price: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface Review {
  name: string;
  text: string;
  rating: number;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  heroPromise: {
    main: string;
    italics: string;
    subtext: string;
  };
  philosophy: {
    title: string;
    desc: string;
  }[];
  services: Service[];
  stylists: Stylist[];
  reviews: Review[];
  gallery: string[];
  contact: {
    address: string;
    phone: string;
    email: string;
    social: {
      instagram: string;
      facebook: string;
    };
  };
  hours: {
    mon_fri: string;
    sat: string;
    sun: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export const businessData: BusinessConfig = {
  name: "Perman Experience",
  tagline: "Premium mu\u0161ki frizerski salon",
  heroPromise: {
    main: "Vi\u0161e od obi\u010dnog",
    italics: "\u0161i\u0161anja",
    subtext:
      "Perman Experience je premium frizerski salon u Rijeci. Rezervirajte termin brzo i jednostavno. \u0160i\u0161anje, brijanje i styling na jednom mjestu.",
  },
  philosophy: [
    {
      title: "Zanat",
      desc: "Svaki rez je na\u0161 potpis. Spajamo tradiciju zanata s modernom precizno\u0161\u0107u.",
    },
    {
      title: "Oaza za mu\u0161karce",
      desc: "Zaboravite na gradsku vrevu. U\u017eivajte u prostoru stvorenom za opu\u0161tanje i potpunu posve\u0107enost vama.",
    },
    {
      title: "Standard",
      desc: "Koristimo samo prvoklasne proizvode. Nema kompromisa, samo vrhunski rezultati svaki put.",
    },
  ],
  services: [
    { id: "1", name: "\u0160i\u0161anje", price: "20,00 \u20ac", duration: "30 min" },
    { id: "2", name: "Pranje i stiliziranje", price: "10,00 \u20ac", duration: "15 min" },
    { id: "3", name: "Ure\u0111ivanje brade", price: "15,00 \u20ac", duration: "20 min" },
    { id: "4", name: "\u0160i\u0161anje i ure\u0111ivanje brade", price: "30,00 \u20ac", duration: "50 min" },
    { id: "5", name: "Dje\u010dje \u0161i\u0161anje", price: "15,00 \u20ac", duration: "30 min" },
  ],
  stylists: [
    {
      id: "1",
      name: "Ivan Mati\u0107",
      specialty: "Master Barber",
      bio: "Nagra\u0111ivani majstor klasi\u010dnog brijanja i preciznog stiliziranja brade.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "2",
      name: "Luka Horvat",
      specialty: "Senior Barber",
      bio: "Stru\u010dnjak za moderne teksturirane frizure i avangardne tehnike brijanja.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "3",
      name: "Marko Kova\u010d",
      specialty: "Barber",
      bio: "Poznat po fade tehnikama, savr\u0161enim prijelazima i modernim stilovima.",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    },
  ],
  reviews: [
    {
      name: "David K.",
      text: "Najbolje iskustvo \u0161i\u0161anja u gradu. Ivan je majstor svog zanata. Atmosfera je vrhunska.",
      rating: 5,
    },
    {
      name: "Sanjin M.",
      text: "Marko mi je potpuno transformirao frizuru. Kona\u010dno salon koji zaista slu\u0161a klijente.",
      rating: 5,
    },
    {
      name: "Mihael R.",
      text: "Premium usluga od po\u010detka do kraja. Topla preporuka svima u Rijeci.",
      rating: 5,
    },
  ],
  gallery: [
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800",
  ],
  contact: {
    address: "Ulica ..., Rijeka, 51000 HR",
    phone: "+385-XX-XXX-XXXX",
    email: "info@perman-experience.com",
    social: {
      instagram: "#",
      facebook: "#",
    },
  },
  hours: {
    mon_fri: "09:00 - 20:00",
    sat: "09:00 - 15:00",
    sun: "Zatvoreno",
  },
  theme: {
    primaryColor: "zinc-100",
    secondaryColor: "zinc-950",
  },
};
