(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      d.head.appendChild(d.createElement("script")).src = A;
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ["initNamespace", namespace]);
      } else p(cal, ar);
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");

Cal("init", "free-discovery", { origin: "https://app.cal.com" });
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;
Cal.ns["free-discovery"]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });

const videoModal = document.getElementById('videoModal');
const videoContainer = document.getElementById('videoContainer');

function openVideoModal() {
  videoContainer.innerHTML = '<wistia-player media-id="sv53ju3n2d" aspect="1.7777777777777777" auto-play="true"></wistia-player>';
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  videoContainer.innerHTML = '';
  videoModal.classList.remove('active');
  document.body.style.overflow = '';
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideoModal();
});

document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});
