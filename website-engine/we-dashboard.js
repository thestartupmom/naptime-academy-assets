(function(){
var DASH = /^\/products\/the-website-engine\/?$/;
if (!DASH.test(location.pathname) && !window.SSK_CANVAS) return;
var root = document.documentElement;
root.classList.add('ssk-dash');
var KEY = 'we_welcomed_v1';
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen = '1';
try { seen = localStorage.getItem(KEY); } catch (e) {}
var reveal = !seen && !reduce;
if (reveal) root.classList.add('ssk-veil');
function ready(fn){ document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
function $(s, c){ return (c || document).querySelector(s); }
function $$(s, c){ return [].slice.call((c || document).querySelectorAll(s)); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
function lessons(){
return $$('.product-outline-post').map(function(a){
var m = (a.getAttribute('href') || '').match(/\/posts\/(\d+)/), ic = $('.progress-icon', a);
return {post: m ? m[1] : '', done: !!(ic && ic.classList.contains('progress-icon-100')),
title: (($('.media-body', a) || a).textContent || '').trim()};
}).filter(function(l){ return l.post; });
}
function firstName(){
var t = $('.dashboard-welcome-title'); if (!t) return '';
var full = t.getAttribute('data-ssk-name');
if (full == null){
var c = t.cloneNode(true); $$('span', c).forEach(function(s){ s.remove(); });
full = (c.textContent || '').trim(); t.setAttribute('data-ssk-name', full);
}
return /@/.test(full) ? '' : (full.split(/\s+/)[0] || '');
}
function hero(){
var w = $('.dashboard-welcome'); if (!w) return;
var list = lessons(), started = list.some(function(l){ return l.done; });
var t = $('.dashboard-welcome-title', w), name = firstName();
if (t) t.innerHTML = (started ? 'Welcome back' : 'Welcome') + (name ? ', <em>' + esc(name) + '.</em>' : ' <em>in.</em>');
var sub = $('.dashboard-welcome-subtitle', w), btn = $('.dashboard-welcome-btn', w), mb = $('.media-body', w);
if (sub){
var nx = $('.ssk-next', sub);
if (!nx){ nx = document.createElement('span'); nx.className = 'ssk-next'; sub.appendChild(nx); }
var href = btn ? (btn.getAttribute('href') || '') : '', next = null;
list.forEach(function(l){ if (!next && href.indexOf('/posts/' + l.post) > -1) next = l; });
nx.innerHTML = next ? (started ? 'Next up: ' : 'Start with ') + '<b>' + esc(next.title) + '</b>' : 'Two short lessons, then open Claude and say <b>build my website</b>.';
}
if (btn && mb && btn.parentNode !== mb) mb.appendChild(btn);
}
function build(){
$$('.dashboard-text').forEach(function(b){ if ($('.ssk-letter, .ssk-help, .we-bump', b)) b.classList.add('ssk-bare'); });
}
function align(){
var rail = $('#section-product_sidebar'), vid = $('#section-product_body .dashboard-video, #section-product_body .dashboard-img');
if (!rail || !vid) return;
rail.style.marginTop = '';
if (window.innerWidth < 768) return;
var d = vid.getBoundingClientRect().top - rail.getBoundingClientRect().top;
if (d > 0) rail.style.marginTop = Math.round(d) + 'px';
}
function playReveal(){
try { localStorage.setItem(KEY, '1'); } catch (e) {}
var name = firstName();
var o = document.createElement('div');
o.id = 'ssk-reveal'; o.setAttribute('role', 'presentation');
o.innerHTML = '<h2 class="rv-title">You’re in' + (name ? ', <em>' + esc(name) + '.</em>' : '<em>.</em>') + '</h2>' +
'<p class="rv-sub">The Website Engine is yours.</p><button type="button" class="rv-skip">Skip</button>';
document.body.appendChild(o);
root.classList.remove('ssk-veil');
var gone = false;
function finish(){ if (gone) return; gone = true; clearTimeout(t); if (o.parentNode) o.parentNode.removeChild(o); }
var t = setTimeout(finish, 3300);
$('.rv-skip', o).addEventListener('click', finish);
}
ready(function(){
build(); hero(); align();
window.addEventListener('resize', align);
window.addEventListener('load', align);
if (reveal) playReveal(); else root.classList.remove('ssk-veil');
});
window.SSK = { update: function(){ hero(); align(); }, replay: function(){ try { localStorage.removeItem(KEY); } catch (e) {} playReveal(); } };
})();
