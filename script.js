
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


async function loadCmsContent(){
  try{
    const response=await fetch('/content/site.json',{cache:'no-store'});
    if(!response.ok) return;
    const data=await response.json();
    document.querySelectorAll('[data-cms]').forEach(el=>{
      const path=el.dataset.cms.split('.');
      let value=data;
      for(const key of path){ value=value?.[key]; }
      if(value===undefined || value===null) return;
      if(Array.isArray(value)){
        el.innerHTML=value.map(p=>`<p>${escapeHtml(p)}</p>`).join('');
      } else {
        el.textContent=value;
      }
    });
    document.querySelectorAll('[data-cms-email]').forEach(el=>{
      const email=data.site?.email;
      if(email){el.textContent=email;el.href='mailto:'+email;}
    });
  }catch(e){console.warn('CMS content could not be loaded',e);}
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
loadCmsContent();

async function loadExtraCmsContent(){
  try{
    const response=await fetch('/content/site.json',{cache:'no-store'});
    if(!response.ok)return;
    const data=await response.json();

    document.querySelectorAll('[data-cms-image]').forEach(el=>{
      let value=data;
      for(const key of el.dataset.cmsImage.split('.')) value=value?.[key];
      if(value) el.src=value;
    });
    document.querySelectorAll('[data-cms-alt]').forEach(el=>{
      let value=data;
      for(const key of el.dataset.cmsAlt.split('.')) value=value?.[key];
      if(value) el.alt=value;
    });

    const renderCards=(selector,items)=>{
      const host=document.querySelector(selector);
      if(!host||!Array.isArray(items)) return;
      host.innerHTML=items.map(item=>`<div class="card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>`).join('');
    };

    renderCards('[data-cms-cards="presse.services"]',data.presse?.services);
    renderCards('[data-cms-cards="langaaen.principles"]',data.langaaen?.principles);
    renderCards('[data-cms-cards="foredrag.audiences"]',data.foredrag?.audiences);

    const list=document.querySelector('[data-cms-list="journalistik.services"]');
    if(list&&Array.isArray(data.journalistik?.services)){
      list.innerHTML=data.journalistik.services.map(item=>`<li>${escapeHtml(item)}</li>`).join('');
    }
  }catch(err){console.warn(err);}
}
loadExtraCmsContent();
