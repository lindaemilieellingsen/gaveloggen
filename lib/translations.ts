export type Language = "no" | "en"

export const translations = {
  // App name
  appName: {
    no: "Gaveloggen",
    en: "Gift Log",
  },

  // Landing page
  landing: {
    tagline: {
      no: "Hold oversikt over gaver til alle du er glad i",
      en: "Keep track of gifts for everyone you care about",
    },
    getStarted: {
      no: "Kom i gang",
      en: "Get Started",
    },
  },

  // Auth pages
  auth: {
    login: {
      no: "Logg inn",
      en: "Log in",
    },
    loggingIn: {
      no: "Logger inn...",
      en: "Logging in...",
    },
    loginDescription: {
      no: "Skriv inn e-posten din for å logge inn",
      en: "Enter your email to log in",
    },
    rememberMe: {
      no: "Forbli pålogget",
      en: "Remember me",
    },
    email: {
      no: "E-post",
      en: "Email",
    },
    emailPlaceholder: {
      no: "din@epost.no",
      en: "your@email.com",
    },
    password: {
      no: "Passord",
      en: "Password",
    },
    repeatPassword: {
      no: "Gjenta passord",
      en: "Repeat password",
    },
    noAccount: {
      no: "Har du ikke en konto?",
      en: "Don't have an account?",
    },
    hasAccount: {
      no: "Har du allerede en konto?",
      en: "Already have an account?",
    },
    register: {
      no: "Registrer deg",
      en: "Sign up",
    },
    registering: {
      no: "Oppretter konto...",
      en: "Creating account...",
    },
    registerDescription: {
      no: "Opprett en ny konto",
      en: "Create a new account",
    },
    passwordMismatch: {
      no: "Passordene stemmer ikke overens",
      en: "Passwords do not match",
    },
    passwordTooShort: {
      no: "Passordet må være minst 6 tegn",
      en: "Password must be at least 6 characters",
    },
    errorOccurred: {
      no: "En feil oppstod",
      en: "An error occurred",
    },
    userExists: {
      no: "En bruker med denne e-posten finnes allerede",
      en: "A user with this email already exists",
    },
    unknownError: {
      no: "En ukjent feil oppstod",
      en: "An unknown error occurred",
    },
    somethingWentWrong: {
      no: "Noe gikk galt",
      en: "Something went wrong",
    },
    tryAgain: {
      no: "Prøv igjen",
      en: "Try again",
    },
    checkEmail: {
      no: "Sjekk e-posten din",
      en: "Check your email",
    },
    confirmationSent: {
      no: "Vi har sendt deg en bekreftelseslenke",
      en: "We have sent you a confirmation link",
    },
    confirmationDescription: {
      no: "Klikk på lenken i e-posten for å bekrefte kontoen din og komme i gang med",
      en: "Click the link in the email to confirm your account and get started with",
    },
    backToLogin: {
      no: "Tilbake til innlogging",
      en: "Back to login",
    },
    logout: {
      no: "Logg ut",
      en: "Log out",
    },
    userMenu: {
      no: "Brukermenyer",
      en: "User menu",
    },
    selectLanguage: {
      no: "Velg språk",
      en: "Select language",
    },
  },

  // Gift tracker
  tracker: {
    addPerson: {
      no: "Legg til person",
      en: "Add person",
    },
    giftIdeas: {
      no: "Gaveideer",
      en: "Gift ideas",
    },
    history: {
      no: "Historikk",
      en: "History",
    },
    newPersonName: {
      no: "Navn på personen",
      en: "Person's name",
    },
    add: {
      no: "Legg til",
      en: "Add",
    },
    cancel: {
      no: "Avbryt",
      en: "Cancel",
    },
    close: {
      no: "Lukk",
      en: "Close",
    },
    save: {
      no: "Lagre",
      en: "Save",
    },
    saveChanges: {
      no: "Lagre Endringer",
      en: "Save Changes",
    },
    delete: {
      no: "Slett",
      en: "Delete",
    },
    edit: {
      no: "Rediger",
      en: "Edit",
    },
    personExists: {
      no: "Denne personen finnes allerede",
      en: "This person already exists",
    },
    couldNotAddPerson: {
      no: "Kunne ikke legge til person",
      en: "Could not add person",
    },
    noGiftsYet: {
      no: "Ingen gaver registrert ennå.",
      en: "No gifts registered yet.",
    },
    noIdeasYet: {
      no: "Ingen ideer registrert ennå.",
      en: "No ideas registered yet.",
    },
    noGiftsRegistered: {
      no: "Ingen gaver registrert ennå.",
      en: "No gifts registered yet.",
    },
    noGiftsMatch: {
      no: "Ingen gaver matcher filteret.",
      en: "No gifts match the filter.",
    },
    giftsGiven: {
      no: "Gaver gitt",
      en: "Gifts given",
    },
    giftIdeasTitle: {
      no: "Gaveideer",
      en: "Gift ideas",
    },
    allGiftIdeas: {
      no: "Alle gaveideer",
      en: "All gift ideas",
    },
    giftHistory: {
      no: "Gavehistorikk",
      en: "Gift history",
    },
    addGiftOrIdea: {
      no: "Legg til gave eller idé",
      en: "Add gift or idea",
    },
    editGift: {
      no: "Rediger gave",
      en: "Edit gift",
    },
    selectPerson: {
      no: "Velg person",
      en: "Select person",
    },
    giftTitle: {
      no: "Gave",
      en: "Gift",
    },
    whatIsGift: {
      no: "Hva er gaven?",
      en: "What is the gift?",
    },
    description: {
      no: "Beskrivelse",
      en: "Description",
    },
    moreDetails: {
      no: "Mer detaljer...",
      en: "More details...",
    },
    isIdea: {
      no: "Dette er en idé (ikke gitt enda)",
      en: "This is an idea (not given yet)",
    },
    occasion: {
      no: "Anledning",
      en: "Occasion",
    },
    selectOccasion: {
      no: "Velg anledning",
      en: "Select occasion",
    },
    year: {
      no: "År",
      en: "Year",
    },
    selectYear: {
      no: "Velg år",
      en: "Select year",
    },
    christmas: {
      no: "Jul",
      en: "Christmas",
    },
    birthday: {
      no: "Bursdag",
      en: "Birthday",
    },
    other: {
      no: "Annet",
      en: "Other",
    },
    customOccasion: {
      no: "Annen anledning",
      en: "Other occasion",
    },
    allOccasions: {
      no: "Alle anledninger",
      en: "All occasions",
    },
    allYears: {
      no: "Alle år",
      en: "All years",
    },
    allPersons: {
      no: "Alle personer",
      en: "All persons",
    },
    giveGift: {
      no: "Gi gave",
      en: "Give gift",
    },
    markAsGiven: {
      no: "Merk som gitt",
      en: "Mark as given",
    },
    gift: {
      no: "gave",
      en: "gift",
    },
    gifts: {
      no: "gaver",
      en: "gifts",
    },
    idea: {
      no: "idé",
      en: "idea",
    },
    ideas: {
      no: "ideer",
      en: "ideas",
    },
    share: {
      no: "Del",
      en: "Share",
    },
    shareIdeas: {
      no: "Del ideer",
      en: "Share ideas",
    },
    copy: {
      no: "Kopier",
      en: "Copy",
    },
    copied: {
      no: "Kopiert!",
      en: "Copied!",
    },
    totalGifts: {
      no: "Totalt",
      en: "Total",
    },
    back: {
      no: "Tilbake",
      en: "Back",
    },
    earlier: {
      no: "Tidligere",
      en: "Earlier",
    },
    convertToGift: {
      no: "Konverter til gave",
      en: "Convert to gift",
    },
    addNewPerson: {
      no: "Legg til Ny Person",
      en: "Add New Person",
    },
    addExamples: {
      no: "Legg til Eksempler (Per, Lise, etc.)",
      en: "Add Examples (John, Lisa, etc.)",
    },
    noPeopleYet: {
      no: 'Ingen folk lagt til ennå. Klikk "Legg til Person" for å begynne.',
      en: 'No people added yet. Click "Add Person" to get started.',
    },
    ideasFor: {
      no: "Gaveideer til",
      en: "Gift ideas for",
    },
    name: {
      no: "Navn",
      en: "Name",
    },
    person: {
      no: "Person",
      en: "Person",
    },
    showing: {
      no: "Viser",
      en: "Showing",
    },
    of: {
      no: "av",
      en: "of",
    },
    myPeople: {
      no: "Mine folk",
      en: "My people",
    },
    people: {
      no: "Personer",
      en: "People",
    },
    title: {
      no: "Tittel",
      en: "Title",
    },
    descriptionOptional: {
      no: "Beskrivelse (valgfritt)",
      en: "Description (optional)",
    },
    newGiftIdea: {
      no: "Ny gave/idé",
      en: "New gift/idea",
    },
    registerGift: {
      no: "Registrer gave",
      en: "Register gift",
    },
    registerGiftAs: {
      no: "Registrer som gitt gave:",
      en: "Register as given gift:",
    },
    occasionPlaceholder: {
      no: "F.eks. konfirmasjon, bryllup...",
      en: "E.g. confirmation, wedding...",
    },
    givenGiftsCount: {
      no: "gaver gitt",
      en: "gifts given",
    },
    ideasCount: {
      no: "ideer",
      en: "ideas",
    },
    noGiftsRegisteredYet: {
      no: "Ingen gaver registrert ennå.",
      en: "No gifts registered yet.",
    },
    noIdeasRegisteredYet: {
      no: "Ingen ideer registrert ennå.",
      en: "No ideas registered yet.",
    },
    specifyOccasion: {
      no: "Spesifiser anledning",
      en: "Specify occasion",
    },
    copyToClipboard: {
      no: "Kopier til utklippstavle",
      en: "Copy to clipboard",
    },
    shareIdeasFor: {
      no: "Del gaveideer for",
      en: "Share gift ideas for",
    },
    egPlaceholder: {
      no: "f.eks.",
      en: "e.g.",
    },
  },

  // Example names
  examples: {
    people: {
      no: ["Per", "Lise", "Mamma", "Mohammed", "Bestemor", "Pappa"],
      en: ["John", "Lisa", "Mom", "Mohammed", "Grandma", "Dad"],
    },
    placeholder: {
      no: "Per",
      en: "John",
    },
  },
} as const

export function t(key: string, lang: Language): string {
  const keys = key.split(".")
  let value: unknown = translations

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }

  if (value && typeof value === "object" && lang in value) {
    return (value as Record<string, string>)[lang]
  }

  return key
}

export function tArray(key: string, lang: Language): string[] {
  const keys = key.split(".")
  let value: unknown = translations

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return []
    }
  }

  if (value && typeof value === "object" && lang in value) {
    return (value as Record<string, string[]>)[lang]
  }

  return []
}
