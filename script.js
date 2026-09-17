
const btn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
if(btn&&nav){
  btn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');btn.setAttribute('aria-expanded','false');
  }));
}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());



const cmsFiles = {
  home: '/content/forside.json',
  about: '/content/om-mig.json',
  journalistik: '/content/journalistik.json',
  presse: '/content/presse.json',
  langaaen: '/content/langaaen.json',
  foredrag: '/content/foredrag.json',
  contact: '/content/kontakt.json',
  site: '/content/site.json'
};

async function fetchJson(path){
  const r = await fetch(path,{cache:'no-store'});
  if(!r.ok) throw new Error(path);
  return r.json();
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
async function loadCms(){
  try{
    const data = {};
    for (const [key,path] of Object.entries(cmsFiles)) {
      data[key] = await fetchJson(path);
    }

    document.querySelectorAll('[data-cms]').forEach(el=>{
      const [group,...rest]=el.dataset.cms.split('.');
      let value=data[group];
      for(const key of rest) value=value?.[key];
      if(value===undefined||value===null)return;
      if(Array.isArray(value)){
        el.innerHTML=value.map(p=>`<p>${escapeHtml(p)}</p>`).join('');
      } else el.textContent=value;
    });

    document.querySelectorAll('[data-cms-image]').forEach(el=>{
      const [group,...rest]=el.dataset.cmsImage.split('.');
      let value=data[group];
      for(const key of rest)value=value?.[key];
      if(value)el.src=value;
    });

    document.querySelectorAll('[data-cms-alt]').forEach(el=>{
      const [group,...rest]=el.dataset.cmsAlt.split('.');
      let value=data[group];
      for(const key of rest)value=value?.[key];
      if(value)el.alt=value;
    });

    const renderCards=(selector,items)=>{
      const host=document.querySelector(selector);
      if(!host||!Array.isArray(items))return;
      host.innerHTML=items.map(i=>`<div class="card"><h3>${escapeHtml(i.title)}</h3><p>${escapeHtml(i.text)}</p></div>`).join('');
    };
    renderCards('[data-cms-cards="presse.services"]',data.presse?.services);
    renderCards('[data-cms-cards="langaaen.principles"]',data.langaaen?.principles);
    renderCards('[data-cms-cards="foredrag.audiences"]',data.foredrag?.audiences);

    const list=document.querySelector('[data-cms-list="journalistik.services"]');
    if(list&&Array.isArray(data.journalistik?.services)){
      list.innerHTML=data.journalistik.services.map(x=>`<li>${escapeHtml(x)}</li>`).join('');
    }

    document.querySelectorAll('[data-cms-email]').forEach(el=>{
      if(data.site?.email){el.textContent=data.site.email;el.href='mailto:'+data.site.email;}
    });
  }catch(e){console.warn('CMS loading failed',e);}
}
loadCms();
