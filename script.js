
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
