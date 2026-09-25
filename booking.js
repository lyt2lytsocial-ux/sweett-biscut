(()=>{
 const form=document.getElementById('bookingRequestForm'); if(!form)return;
 const status=document.getElementById('bookingStatus');
 const value=n=>String(new FormData(form).get(n)||'').trim();
 const build=()=>{
   const rows=[['Name',value('name')],['Organization / venue',value('organization')],['Email',value('email')],['Phone',value('phone')],['Event type',value('type')],['Event date',value('date')],['City / state',value('location')],['Venue',value('venue')],['Audience size',value('audience')],['Requested run time',value('runtime')],['Event details',value('details')]].filter(([,v])=>v);
   return 'SWEETT BISCUT BOOKING REQUEST\n\n'+rows.map(([k,v])=>`${k}: ${v}`).join('\n');
 };
 document.getElementById('copyBookingRequest')?.addEventListener('click',async()=>{const text=build();try{await navigator.clipboard.writeText(text);status.textContent='Booking request copied. It is ready to paste into the official booking channel once connected.'}catch{status.textContent='Copy was blocked by the browser. Select the information manually and copy it.'}});
 document.getElementById('shareBookingRequest')?.addEventListener('click',async()=>{const text=build();if(navigator.share){try{await navigator.share({title:'Sweett Biscut Booking Request',text})}catch(e){if(e.name!=='AbortError')status.textContent='Sharing was not available.'}}else{try{await navigator.clipboard.writeText(text);status.textContent='Sharing is not supported here, so the request was copied instead.'}catch{status.textContent='Sharing is not supported in this browser.'}}});
})();
