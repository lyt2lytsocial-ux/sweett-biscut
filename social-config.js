/* Sweett Biscut official social links.
   Add the exact official profile URL when available. Blank values gracefully route to the Social Hub. */
window.SWEETT_BISCUT_SOCIAL = {
  tiktok: "",
  instagram: "",
  facebook: "",
  youtube: ""
};

(function(){
  const cfg = window.SWEETT_BISCUT_SOCIAL || {};
  document.querySelectorAll('[data-social]').forEach(el => {
    const key = el.getAttribute('data-social');
    const url = cfg[key];
    if(url){
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.classList.add('is-connected');
    } else {
      el.classList.add('is-pending');
      el.title = 'Official profile link pending';
    }
  });
})();
