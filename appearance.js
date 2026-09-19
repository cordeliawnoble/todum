(function(){
  const cfg=window.TODUM_CONFIG||{};
  const seasons=['spring','summer','autumn','winter'];

  function autoSeason(starts){
    const now=new Date();
    const md=String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    starts=starts||cfg.appearanceFallback?.seasonStarts||{spring:'03-01',summer:'06-01',autumn:'09-01',winter:'12-01'};
    if(md>=starts.winter||md<starts.spring)return'winter';
    if(md>=starts.autumn)return'autumn';
    if(md>=starts.summer)return'summer';
    return'spring';
  }
  function fallbackSeason(){
    const f=cfg.appearanceFallback||{};
    return f.mode==='manual'?(f.forcedSeason||'autumn'):autoSeason(f.seasonStarts);
  }
  async function context(page){
    if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase)return{season:fallbackSeason(),assets:[],palette:null};
    const client=window.__todoomAppearanceClient||(window.__todoomAppearanceClient=supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey));
    let season=fallbackSeason(), palette=null;
    try{
      const {data:settings}=await client.from('todum_appearance_settings').select('key,value').in('key',['theme_mode','season_starts','season_palettes']);
      const map=Object.fromEntries((settings||[]).map(x=>[x.key,x.value]));
      if(map.theme_mode?.mode==='manual')season=map.theme_mode.forcedSeason||season;
      else season=autoSeason(map.season_starts||cfg.appearanceFallback?.seasonStarts);
      palette=map.season_palettes?.[season]||null;
    }catch(e){console.warn('Todoom apparence: réglages en fallback',e)}
    try{
      const {data,error}=await client.from('todum_appearance_assets').select('*').eq('season',season).eq('enabled',true).in('page',['global',page]).order('sort_order',{ascending:true});
      if(error)throw error;
      return{season,assets:data||[],palette};
    }catch(e){console.warn('Todoom apparence: visuels en fallback',e);return{season,assets:[],palette}}
  }
  function pick(assets,slot,page){
    const exact=assets.filter(a=>a.slot===slot&&a.page===page);
    const global=assets.filter(a=>a.slot===slot&&a.page==='global');
    const list=exact.length?exact:global;
    return list.length?list[Math.floor(Math.random()*list.length)]:null;
  }
  function applyPalette(p){
    if(!p)return;
    const root=document.documentElement.style;
    const map={
      pageBackground:'--page-bg',sidebarBackground:'--sidebar-bg',surface:'--surface',
      primary:'--primary',secondary:'--secondary',soft:'--soft',ink:'--ink',border:'--border'
    };
    Object.entries(map).forEach(([k,v])=>{if(p[k])root.setProperty(v,p[k])});
  }
  async function applyAppearance(page){
    const {season,assets,palette}=await context(page);
    document.documentElement.dataset.season=season;
    applyPalette(palette);
    const banner=pick(assets,'banner',page);
    const bg=pick(assets,'page_background',page);
    const side=pick(assets,'sidebar_decoration',page);
    const empty=pick(assets,'empty_state',page);
    const root=document.documentElement.style;
    if(banner?.public_url)root.setProperty('--season-banner',`url("${banner.public_url}")`);
    if(bg?.public_url)root.setProperty('--page-background-image',`url("${bg.public_url}")`);
    if(side?.public_url)root.setProperty('--sidebar-decoration',`url("${side.public_url}")`);
    if(empty?.public_url)root.setProperty('--empty-walter',`url("${empty.public_url}")`);
  }
  window.TodumAppearance={applyAppearance,autoSeason};
})();