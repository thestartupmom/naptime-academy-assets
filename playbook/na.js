/* Naptime Playbook pages. The theme sets window.PB_BODY, this fetches it into #na-root. */
(function(){var me=document.currentScript&&document.currentScript.src||'';var base=me.replace(/na\.js(\?.*)?$/,'');
function attach(root){root.classList.add('js');}
function boot(){var root=document.getElementById('na-root');if(!root||root.getAttribute('data-na')==='1')return;root.setAttribute('data-na','1');
fetch(base+(window.PB_BODY||'index-body.html')).then(function(r){if(!r.ok)throw new Error(r.status);return r.text();}).then(function(html){root.innerHTML=html;attach(root);})
.catch(function(e){root.innerHTML='<p style="text-align:center;padding:60px 20px;font-family:sans-serif">This page could not load. Please refresh.</p>';});}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}else{boot();}})();
