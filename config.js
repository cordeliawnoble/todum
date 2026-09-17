window.TODUM_CONFIG = {
  // Pont Google Sheets sécurisé. C'est ICI que va l'URL /exec.
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbx-8x2IQ_JSPCNzjDFymGutsS8t79GstXcwiLXWjKrCnKDcV9OrWWVLqHK1zGRwqrgheA/exec",

  // Supabase : garde les valeurs de TON projet actuel.
  // URL publique du projet, ex. https://xxxx.supabase.co
  supabaseUrl: "https://uvlzrfxecmaugdfuhjho.supabase.co",

  // Clé PUBLIQUE anon / publishable uniquement. JAMAIS service_role.
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bHpyZnhlY21hdWdkZnVoamhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTA5NjMsImV4cCI6MjEwNDE2Njk2M30.RXYM5ZDpFcf_mFoon9UglTyXe_Iqoy9ljQUNu2cPr-s",

  // Ton bucket d'images existant reste inchangé.
  mediaBucket: "Todum",

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
