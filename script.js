const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(toggle&&nav){
  toggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',open?'true':'false');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  }));
}

const moreBtn=document.querySelector('.float-more');
const moreMenu=document.getElementById('mobileMoreMenu');
if(moreBtn&&moreMenu){
  const closeMore=()=>{moreMenu.hidden=true;moreBtn.setAttribute('aria-expanded','false')};
  moreBtn.addEventListener('click',()=>{
    const willOpen=moreMenu.hidden;
    moreMenu.hidden=!willOpen;
    moreBtn.setAttribute('aria-expanded',willOpen?'true':'false');
  });
  moreMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMore));
  document.addEventListener('click',e=>{if(!moreMenu.hidden&&!moreMenu.contains(e.target)&&!moreBtn.contains(e.target))closeMore()});
}

const eventPreview=document.getElementById('homeUpcomingEvents');
function renderHomeUpcomingEvents(){
  if(!eventPreview)return;
  const events=Array.isArray(window.SWEETT_BISCUT_EVENTS)?window.SWEETT_BISCUT_EVENTS:[];
  const now=new Date(); now.setHours(0,0,0,0);
  const upcoming=events.filter(e=>e&&e.date&&new Date(e.date+'T12:00:00')>=now).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if(!upcoming.length){
    eventPreview.innerHTML='<div class="home-event-empty"><b>New dates coming soon.</b><span>Open the calendar anytime for the latest posted appearances.</span></div>';
  } else {
    eventPreview.innerHTML=upcoming.map(e=>{
      const d=new Date(e.date+'T12:00:00');
      const mon=d.toLocaleDateString(undefined,{month:'short'}).toUpperCase();
      const day=d.getDate();
      return `<a class="home-event-item" href="calendar.html"><span class="home-event-date"><b>${esc(mon)}</b><strong>${day}</strong></span><span class="home-event-info"><b>${esc(e.title||'Sweett Biscut Appearance')}</b><small>${esc([e.time,e.venue,e.address].filter(Boolean).join(' • '))}</small></span><span class="home-event-arrow">›</span></a>`;
    }).join('');
  }
}
renderHomeUpcomingEvents();
window.addEventListener('sweettbiscut:events-ready',renderHomeUpcomingEvents);
