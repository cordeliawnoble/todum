window.TODUM_CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbx-8x2IQ_JSPCNzjDFymGutsS8t79GstXcwiLXWjKrCnKDcV9OrWWVLqHK1zGRwqrgheA/exec",

  // À renseigner quand on branche l'apparence à ton projet Supabase existant.
  supabaseUrl: "https://uvlzrfxecmaugdfuhjho.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bHpyZnhlY21hdWdkZnVoamhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTA5NjMsImV4cCI6MjEwNDE2Njk2M30.RXYM5ZDpFcf_mFoon9UglTyXe_Iqoy9ljQUNu2cPr-s",
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
