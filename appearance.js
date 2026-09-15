(function(){
  const cfg = window.TODUM_CONFIG || {};

  const palettes = {
    autumn:{
      bg:'#fffaf4', surface:'#fffdf9', ink:'#3f2432', muted:'#816d72',
      primary:'#a85f27', primary2:'#c47b37', soft:'#f4e3cf', line:'#ead7c5',
      sidebar:'#3d2030', sidebarText:'#fff8ef'
    },
    winter:{
      bg:'#f8fbfd', surface:'#ffffff', ink:'#26344c', muted:'#718096',
      primary:'#58789e', primary2:'#91a9c2', soft:'#e8f0f6', line:'#d8e3ec',
      sidebar:'#26344c', sidebarText:'#f7fbff'
    },
    spring:{
      bg:'#fffafc', surface:'#ffffff', ink:'#473347', muted:'#7d6d79',
      primary:'#8c6a86', primary2:'#9caf82', soft:'#f0e7ee', line:'#e6d9e2',
      sidebar:'#49344b', sidebarText:'#fffafd'
    },
    summer:{
      bg:'#fffdf7', surface:'#ffffff', ink:'#28454a', muted:'#718184',
      primary:'#3f8586', primary2:'#d3a85f', soft:'#e4f1ee', line:'#d8e8e4',
      sidebar:'#244e53', sidebarText:'#fbffff'
    }
  };

  function autoSeason(){
    const now=new Date();
    const md=String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    const starts=(cfg.appearanceFallback&&cfg.appearanceFallback.seasonStarts)||{spring:'03-01',summer:'06-01',autumn:'09-01',winter:'12-01'};
    if(md>=starts.winter||md<starts.spring)return'winter';
    if(md>=starts.autumn)return'autumn';
    if(md>=starts.summer)return'summer';
    return'spring';
  }

  function fallbackSeason(){
    const f=cfg.appearanceFallback||{};
    return f.mode==='manual'?(f.forcedSeason||'autumn'):autoSeason();
  }

  async function loadAppearance(page){
    if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase)return{season:fallbackSeason(),assets:[]};
    const client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    let season=fallbackSeason();
    try{
      const {data:settings}=await client.from('todum_appearance_settings').select('key,value');
      const map=Object.fromEntries((settings||[]).map(x=>[x.key,x.value]));
      if(map.theme_mode?.mode==='manual')season=map.theme_mode.forcedSeason||season;
    }catch(e){console.warn('Todum settings fallback',e)}
    try{
      const {data,error}=await client.from('todum_appearance_assets').select('*')
        .eq('season',season).eq('enabled',true).in('page',['global',page]).order('sort_order',{ascending:true});
      if(error)throw error;
      return{season,assets:data||[]};
    }catch(e){console.warn('Todum assets fallback',e);return{season,assets:[]}}
  }

  function candidates(assets,slot,page){
    const exact=assets.filter(a=>a.slot===slot&&a.page===page);
    const global=assets.filter(a=>a.slot===slot&&a.page==='global');
    return exact.length?exact:global;
  }

  function rotatingPick(list,key){
    if(!list.length)return null;
    if(list.length===1)return list[0];
    const storageKey='todum.rotation.'+key;
    let previous=Number(sessionStorage.getItem(storageKey)||'-1');
    let next=(previous+1)%list.length;
    sessionStorage.setItem(storageKey,String(next));
    return list[next];
  }

  function applyPalette(season){
    const p=palettes[season]||palettes.autumn, root=document.documentElement;
    root.dataset.season=season;
    root.style.setProperty('--season-bg',p.bg);
    root.style.setProperty('--season-surface',p.surface);
    root.style.setProperty('--season-ink',p.ink);
    root.style.setProperty('--season-muted',p.muted);
    root.style.setProperty('--season-primary',p.primary);
    root.style.setProperty('--season-primary-2',p.primary2);
    root.style.setProperty('--season-soft',p.soft);
    root.style.setProperty('--season-line',p.line);
    root.style.setProperty('--sidebar-bg',p.sidebar);
    root.style.setProperty('--season-sidebar-text',p.sidebarText);
  }

  async function applyAppearance(page){
    const {season,assets}=await loadAppearance(page);
    applyPalette(season);
    const root=document.documentElement;

    const banners=candidates(assets,'banner',page);
    const decorations=candidates(assets,'sidebar_decoration',page);
    const legacySide=candidates(assets,'sidebar_walter',page);
    const empties=candidates(assets,'empty_state',page);

    const banner=rotatingPick(banners,'banner.'+season+'.'+page);
    const deco=rotatingPick(decorations.length?decorations:legacySide,'sidebar.'+season);
    const empty=rotatingPick(empties,'empty.'+season+'.'+page);

    root.style.setProperty('--season-banner',banner?.public_url?`url("${banner.public_url}")`:'none');
    root.style.setProperty('--sidebar-decoration',deco?.public_url?`url("${deco.public_url}")`:'none');
    root.style.setProperty('--empty-walter',empty?.public_url?`url("${empty.public_url}")`:'none');

    // Diagnostic utile dans la console, sans bloquer l'interface.
    console.info('[Todum Appearance]',{page,season,banner:banner?.public_url||null,sidebarDecoration:deco?.public_url||null});
  }

  window.TodumAppearance={loadAppearance,applyAppearance,autoSeason,applyPalette,palettes};
})();
