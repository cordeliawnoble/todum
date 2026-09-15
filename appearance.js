(function(){
  const cfg = window.TODUM_CONFIG || {};
  const seasons = ['spring','summer','autumn','winter'];

  function autoSeason(){
    const now = new Date();
    const md = String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    const starts = (cfg.appearanceFallback && cfg.appearanceFallback.seasonStarts) || {
      spring:'03-01', summer:'06-01', autumn:'09-01', winter:'12-01'
    };
    if (md >= starts.winter || md < starts.spring) return 'winter';
    if (md >= starts.autumn) return 'autumn';
    if (md >= starts.summer) return 'summer';
    return 'spring';
  }

  function fallbackSeason(){
    const f = cfg.appearanceFallback || {};
    return f.mode === 'manual' ? (f.forcedSeason || 'autumn') : autoSeason();
  }

  async function loadAppearance(page){
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) {
      return { season:fallbackSeason(), assets:[] };
    }
    const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    let season = fallbackSeason();

    try {
      const {data: settings} = await client.from('todum_appearance_settings').select('key,value');
      const map = Object.fromEntries((settings||[]).map(x=>[x.key,x.value]));
      if (map.theme_mode?.mode === 'manual') season = map.theme_mode.forcedSeason || season;
      else if (map.season_starts) {
        const old = cfg.appearanceFallback.seasonStarts;
        cfg.appearanceFallback.seasonStarts = map.season_starts;
        season = autoSeason();
        cfg.appearanceFallback.seasonStarts = old;
      }
    } catch(e) { console.warn('Todum appearance settings fallback', e); }

    try {
      const {data, error} = await client
        .from('todum_appearance_assets')
        .select('*')
        .eq('season', season)
        .eq('enabled', true)
        .in('page', ['global', page])
        .order('sort_order', {ascending:true});
      if (error) throw error;
      return {season, assets:data||[]};
    } catch(e) {
      console.warn('Todum appearance assets fallback', e);
      return {season, assets:[]};
    }
  }

  function pick(assets, slot, page){
    const list = assets.filter(a => a.slot===slot && (a.page===page || a.page==='global'));
    if (!list.length) return null;
    return list[Math.floor(Math.random()*list.length)];
  }

  async function applyAppearance(page){
    const {season, assets} = await loadAppearance(page);
    document.documentElement.dataset.season = season;
    const banner = pick(assets, 'banner', page);
    const side = pick(assets, 'sidebar_walter', page);
    const empty = pick(assets, 'empty_state', page);

    if (banner?.public_url) document.documentElement.style.setProperty('--season-banner', `url("${banner.public_url}")`);
    if (side?.public_url) document.documentElement.style.setProperty('--sidebar-walter', `url("${side.public_url}")`);
    if (empty?.public_url) document.documentElement.style.setProperty('--empty-walter', `url("${empty.public_url}")`);
  }

  window.TodumAppearance = { loadAppearance, applyAppearance, autoSeason };
})();
