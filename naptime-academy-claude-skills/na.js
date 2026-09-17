/* Naptime Academy: My Favorite Claude Skills. Loaded by the Kajabi theme, pinned to a commit.
   Fetches na-body.html from the same folder, then runs attach(root): views, walkthroughs, doors, copy. */
(function(){var me=document.currentScript&&document.currentScript.src||'';var base=me.replace(/na\.js(\?.*)?$/,'');
function attach(root){
root = root || document;
var main = root.querySelector('.nsk');
if (!main) return;
var arts = Array.prototype.slice.call(main.querySelectorAll('.sk'));
var ids = arts.map(function(a){ return a.id; });
var baseTitle = document.title;
var mast = root.querySelector('.mast');
var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
function byId(id){
if (!id) return null;
try { return root.querySelector('#' + (window.CSS && CSS.escape ? CSS.escape(id) : id)); } catch (e) { return null; }
}
var tpl = byId('tpl-add');
if (tpl && tpl.content) {
main.querySelectorAll('[data-add]').forEach(function(slot){
var frag = tpl.content.cloneNode(true);
var slug = slot.getAttribute('data-add');
var dl = slot.closest('.sk').querySelector('.glance [data-dl]');
frag.querySelectorAll('[data-fill="slug"]').forEach(function(n){ n.textContent = slug; });
frag.querySelectorAll('[data-fill="dl"]').forEach(function(n){
if (!dl) { n.parentNode.removeChild(n); return; }
var c = dl.cloneNode(true); c.removeAttribute('data-dl'); c.classList.add('btn--sm'); n.appendChild(c);
});
slot.textContent = '';
slot.appendChild(frag);
});
}
main.querySelectorAll('.scrib').forEach(function(n){ n.setAttribute('aria-hidden', 'true'); });
main.querySelectorAll('[data-walk]').forEach(function(w){
var frames = w.querySelectorAll('.walk__frame');
var tabs = w.querySelectorAll('.walk__tab');
var back = w.querySelector('.walk__back');
var next = w.querySelector('.walk__next');
var done = w.querySelector('[data-done]');
var art = w.closest('.sk');
w.querySelectorAll('.screen').forEach(function(n){ n.setAttribute('aria-hidden', 'true'); });
if (done && art && !done.getAttribute('href')) done.setAttribute('href', '#' + art.id + '-try');
var at = 0;
function go(k, fromKey){
var had = document.activeElement;
at = Math.max(0, Math.min(frames.length - 1, k));
frames.forEach(function(f, j){ f.hidden = j !== at; });
tabs.forEach(function(t, j){
t.setAttribute('aria-selected', j === at ? 'true' : 'false');
t.tabIndex = j === at ? 0 : -1;
t.classList.toggle('is-past', j < at);
});
if (back) back.disabled = at === 0;
if (next) next.hidden = at === frames.length - 1;
if (done) done.hidden = at !== frames.length - 1;
if (fromKey && tabs[at]) tabs[at].focus();
else if (had === next && next.hidden && done) done.focus({ preventScroll: true });
else if (had === back && back.disabled && next) next.focus({ preventScroll: true });
}
tabs.forEach(function(t, j){
t.addEventListener('click', function(){ go(j); });
t.addEventListener('keydown', function(e){
if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1, true); }
if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1, true); }
});
});
function keepInView(){ if (w.getBoundingClientRect().top < (mast ? mast.offsetHeight : 0)) w.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); }
if (back) back.addEventListener('click', function(){ go(at - 1); keepInView(); });
if (next) next.addEventListener('click', function(){ go(at + 1); keepInView(); });
w.classList.add('is-ready');
go(0);
});
var groups = main.querySelectorAll('[data-doors]');
function setDoor(door){
groups.forEach(function(g){
g.querySelectorAll('.seg button').forEach(function(b){ b.setAttribute('aria-selected', b.getAttribute('data-door') === door ? 'true' : 'false'); });
g.querySelectorAll('.door').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-door-panel') === door); });
});
try { localStorage.setItem('na_skills_door', door); } catch (e) {}
}
groups.forEach(function(g){
var btns = g.querySelectorAll('.seg button');
btns.forEach(function(b, j){
b.addEventListener('click', function(){ setDoor(b.getAttribute('data-door')); });
b.addEventListener('keydown', function(e){
if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
e.preventDefault();
var t = btns[(j + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
setDoor(t.getAttribute('data-door'));
t.focus();
});
});
});
try { var saved = localStorage.getItem('na_skills_door'); if (saved === 'app' || saved === 'code') setDoor(saved); } catch (e) {}
main.addEventListener('click', function(e){
var b = e.target.closest('.cp'); if (!b) return;
var box = b.closest('.prompt,.cmd'); if (!box) return;
var txt = Array.prototype.filter.call(box.childNodes, function(n){ return n !== b; }).map(function(n){ return n.textContent; }).join('').trim();
var flash = function(label){ b.textContent = label; b.classList.add('copied'); setTimeout(function(){ b.textContent = 'Copy'; b.classList.remove('copied'); }, 1800); };
var fallback = function(){
var ta = document.createElement('textarea');
ta.value = txt; ta.setAttribute('readonly', '');
ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
document.body.appendChild(ta); ta.select();
var ok = false; try { ok = document.execCommand('copy'); } catch (err) {}
document.body.removeChild(ta);
if (ok) { flash('Copied'); return; }
try { var r = document.createRange(); r.setStartBefore(box.firstChild); r.setEndBefore(b); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); } catch (err) {}
flash('Selected');
};
if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) navigator.clipboard.writeText(txt).then(function(){ flash('Copied'); }, fallback);
else fallback();
});
var current = null;
var tabs = main.querySelectorAll('.skillnav__tabs a');
var count = main.querySelector('.skillnav__count b');
var stepPrev = main.querySelector('[data-step="prev"]');
var stepNext = main.querySelector('[data-step="next"]');
var toc = main.querySelector('.toc');
function pageTop(){ return Math.max(0, main.getBoundingClientRect().top + window.pageYOffset - (mast ? mast.offsetHeight : 0)); }
function setStep(a, id, label){ if (!a) return; a.setAttribute('href', '#' + id); a.setAttribute('aria-label', label); }
function syncToc(){
if (!toc) return;
toc.classList.toggle('show', !!current && current.id === toc.getAttribute('data-for') && window.pageYOffset > 560);
}
function show(hash, how){
var el = byId(hash);
var art = el ? el.closest('.sk') : null;
if (art) {
var changed = art !== current;
current = art;
main.setAttribute('data-view', 'skill');
arts.forEach(function(a){ a.classList.toggle('is-on', a === art); });
var i = ids.indexOf(art.id);
tabs.forEach(function(t){
if (t.getAttribute('href') === '#' + art.id) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
});
if (count) count.textContent = String(i + 1);
if (i > 0) setStep(stepPrev, ids[i - 1], 'Previous skill: ' + arts[i - 1].getAttribute('data-name'));
else setStep(stepPrev, 'start', 'Start here');
if (i < ids.length - 1) setStep(stepNext, ids[i + 1], 'Next skill: ' + arts[i + 1].getAttribute('data-name'));
else setStep(stepNext, 'all-skills', 'All skills');
document.title = art.getAttribute('data-name') + ' · My Favorite Claude Skills';
if (el === art) {
window.scrollTo(0, pageTop());
} else {
if (changed) window.scrollTo(0, pageTop());
el.scrollIntoView({ behavior: (reduce || changed || how !== 'click') ? 'auto' : 'smooth', block: 'start' });
}
if (how === 'click' && changed) { var h = art.querySelector('h1'); if (h) h.focus({ preventScroll: true }); }
} else {
var wasSkill = main.getAttribute('data-view') === 'skill';
current = null;
main.setAttribute('data-view', 'overview');
arts.forEach(function(a){ a.classList.remove('is-on'); });
document.title = baseTitle;
if (el) el.scrollIntoView({ behavior: (reduce || wasSkill || how !== 'click') ? 'auto' : 'smooth', block: 'start' });
else if (how !== 'load') window.scrollTo(0, pageTop());
}
syncToc();
}
root.addEventListener('click', function(e){
if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
var a = e.target.closest && e.target.closest('a[href^="#"]');
if (!a) return;
var id = a.getAttribute('href').slice(1);
if (!byId(id)) return;
e.preventDefault();
if (location.hash.slice(1) !== id) {
try { history.pushState(null, '', '#' + id); } catch (err) { location.hash = id; return; }
}
show(id, 'click');
});
window.addEventListener('popstate', function(){ show(location.hash.slice(1), 'pop'); });
window.addEventListener('scroll', syncToc, { passive: true });
if (toc && 'IntersectionObserver' in window) {
var tlinks = toc.querySelectorAll('a');
var io = new IntersectionObserver(function(ents){
ents.forEach(function(en){
if (en.isIntersecting) tlinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
});
}, { rootMargin: '-40% 0px -55% 0px' });
tlinks.forEach(function(a){ var s = byId(a.getAttribute('href').slice(1)); if (s) io.observe(s); });
}
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
var first = location.hash.slice(1);
show(first, 'load');
if (first && document.readyState !== 'complete') {
window.addEventListener('load', function(){ if (location.hash.slice(1) === first) show(first, 'settle'); });
}
}
function boot(){var root=document.getElementById('na-root');if(!root||root.getAttribute('data-na')==='1')return;root.setAttribute('data-na','1');fetch(base+'na-body.html').then(function(r){if(!r.ok)throw new Error(r.status);return r.text();}).then(function(html){root.innerHTML=html;attach(root);}).catch(function(e){root.innerHTML='<p style="text-align:center;padding:60px 20px;font-family:sans-serif">This page could not load. Please refresh.</p>';});}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}else{boot();}})();