let events = window.SWEETT_BISCUT_EVENTS || [];
let view = new Date();
view.setDate(1);

const grid = document.getElementById('calendarGrid');
const label = document.getElementById('monthLabel');
const list = document.getElementById('eventList');
const empty = document.getElementById('calendarEmpty');
const detail = document.getElementById('eventDetail');
const detailBody = document.getElementById('eventDetailBody');
const closeDetail = document.getElementById('closeEventDetail');
const todayBtn = document.getElementById('todayMonth');

function key(y,m,d){return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function esc(s=''){return String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function formatDate(date){return new Date(date+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
function googleCalendarUrl(e){
  const d=e.date.replaceAll('-','');
  const details=[e.description,e.venue,e.address].filter(Boolean).join('\n\n');
  const loc=[e.venue,e.address].filter(Boolean).join(', ');
  const params=new URLSearchParams({action:'TEMPLATE',text:e.title,dates:`${d}/${d}`,details,location:loc});
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
function downloadIcs(e){
  const d=e.date.replaceAll('-','');
  const uid=`${Date.now()}-${Math.random().toString(36).slice(2)}@sweettbiscut`;
  const text=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sweett Biscut//Appearances//EN','BEGIN:VEVENT',`UID:${uid}`,`DTSTART;VALUE=DATE:${d}`,`DTEND;VALUE=DATE:${d}`,`SUMMARY:${(e.title||'Sweett Biscut Appearance').replace(/,/g,'\\,')}`,`LOCATION:${([e.venue,e.address].filter(Boolean).join(', ')).replace(/,/g,'\\,')}`,`DESCRIPTION:${(e.description||'').replace(/\n/g,'\\n').replace(/,/g,'\\,')}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob=new Blob([text],{type:'text/calendar'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`sweett-biscut-${e.date}.ics`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function showEvent(e){
  if(!detail||!detailBody)return;
  detailBody.innerHTML=`
    <div class="event-detail-date">${esc(formatDate(e.date))}${e.time?` • ${esc(e.time)}`:''}</div>
    <h2>${esc(e.title)}</h2>
    ${e.flyer?`<img class="event-flyer" src="${esc(e.flyer)}" alt="Event flyer for ${esc(e.title)}">`:''}
    ${e.venue?`<p><strong>Venue:</strong> ${esc(e.venue)}</p>`:''}
    ${e.address?`<p><strong>Location:</strong> ${esc(e.address)}</p>`:''}
    ${e.description?`<p>${esc(e.description)}</p>`:''}
    <div class="event-detail-actions">
      ${e.directionsUrl?`<a class="btn blue" target="_blank" rel="noopener" href="${esc(e.directionsUrl)}">Directions</a>`:''}
      ${e.infoUrl?`<a class="btn orange" target="_blank" rel="noopener" href="${esc(e.infoUrl)}">More Info</a>`:''}
      <a class="btn pink" target="_blank" rel="noopener" href="${googleCalendarUrl(e)}">Google Calendar</a>
      <button class="btn yellow" id="downloadIcsBtn" type="button">Add to Calendar</button>
    </div>`;
  detail.hidden=false; document.body.classList.add('modal-open');
  detail.querySelector('#downloadIcsBtn').onclick=()=>downloadIcs(e);
}
function render(){
  const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),prevDays=new Date(y,m,0).getDate(),start=first.getDay();
  label.textContent=view.toLocaleDateString(undefined,{month:'long',year:'numeric'}); grid.innerHTML='';
  for(let i=0;i<42;i++){
    let d,cm=m,cy=y,muted=false;
    if(i<start){d=prevDays-start+i+1;cm=m-1;muted=true;if(cm<0){cm=11;cy--}}
    else if(i>=start+days){d=i-start-days+1;cm=m+1;muted=true;if(cm>11){cm=0;cy++}}
    else d=i-start+1;
    const cell=document.createElement('div'); cell.className='cal-day'+(muted?' muted':'');
    const today=new Date(); if(cy===today.getFullYear()&&cm===today.getMonth()&&d===today.getDate())cell.classList.add('today');
    cell.innerHTML=`<span class="daynum">${d}</span>`;
    const dayEvents=events.filter(e=>e.date===key(cy,cm,d));
    dayEvents.forEach(e=>{const el=document.createElement('button');el.className='event-dot';el.type='button';el.textContent=e.title;el.onclick=()=>showEvent(e);cell.appendChild(el)});
    grid.appendChild(cell);
  }
  renderList();
}
function renderList(){
  const now=new Date(); now.setHours(0,0,0,0);
  const upcoming=events.filter(e=>new Date(e.date+'T12:00:00')>=now).sort((a,b)=>a.date.localeCompare(b.date));
  list.innerHTML=''; empty.style.display=upcoming.length?'none':'block';
  upcoming.forEach(e=>{const item=document.createElement('article');item.className='event-item';item.innerHTML=`<div><b>${esc(e.title)}</b><div>${esc(formatDate(e.date))}${e.time?' • '+esc(e.time):''}</div>${(e.venue||e.address)?`<small>${esc([e.venue,e.address].filter(Boolean).join(' • '))}</small>`:''}</div><button type="button" class="event-open">View Details</button>`;item.querySelector('button').onclick=()=>showEvent(e);list.appendChild(item)});
}
document.getElementById('prevMonth').onclick=()=>{view.setMonth(view.getMonth()-1);render()};
document.getElementById('nextMonth').onclick=()=>{view.setMonth(view.getMonth()+1);render()};
if(todayBtn) todayBtn.onclick=()=>{view=new Date();view.setDate(1);render()};
if(closeDetail) closeDetail.onclick=()=>{detail.hidden=true;document.body.classList.remove('modal-open')};
if(detail) detail.addEventListener('click',e=>{if(e.target===detail){detail.hidden=true;document.body.classList.remove('modal-open')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&detail&&!detail.hidden){detail.hidden=true;document.body.classList.remove('modal-open')}});
render();

window.addEventListener("sweettbiscut:events-ready", () => { events = window.SWEETT_BISCUT_EVENTS || []; render(); });
