window.TODUM_CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbx-8x2IQ_JSPCNzjDFymGutsS8t79GstXcwiLXWjKrCnKDcV9OrWWVLqHK1zGRwqrgheA/exec",

  // À renseigner quand on branche l'apparence à ton projet Supabase existant.
  supabaseUrl: "",
  supabaseAnonKey: "",
  mediaBucket: "site-images",

  // URL de ton futur hub Eternal Sonata.
  eternalSonataUrl: "#",

  // Fallback local tant que Supabase n'est pas branché.
  appearanceFallback: {
    mode: "auto",
    forcedSeason: "autumn",
    seasonStarts: {
      spring: "03-01",
      summer: "06-01",
      autumn: "09-01",
      winter: "12-01"
    }
  }
};
