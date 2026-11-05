/*
 * Barra de navegación de las páginas internas de escolar.com.ar
 * Reemplaza la barra con los 4 enlaces por: logo chico (vuelve al inicio) + botón "Volver" inteligente.
 *
 * Uso: agregar en cada página, antes de </body>:
 *     <script src="/volver.js" defer></script>
 * Si la página todavía tiene la barra vieja, la quita.
 *
 * La barra vive en un Shadow DOM: los estilos de cada página no la afectan y ella no afecta a la página.
 */
(function () {
  if (window.__barraSitio) return;
  window.__barraSitio = true;

  var INICIO = '/';
  var PAGINAS_INICIO = ['/', '/index.html', '/matematica.html', '/lengua.html', '/diseno.html', '/recursos.html'];
  var TXT_INICIO = 'Volver al inicio';

  var CSS_SHADOW =
    ':host{all:initial}' +
    '.barra{display:flex;align-items:center;gap:16px;box-sizing:border-box;width:100%;min-height:48px;' +
    'background:#2c3e50;padding:6px 16px;box-shadow:0 3px 8px rgba(0,0,0,.25);' +
    'font:700 15px/1.3 Nunito,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}' +
    '.logo{display:flex;flex:none;line-height:0}' +
    '.logo img{display:block;height:36px;width:auto}' +
    '.volver{min-width:0;color:#f1c40f;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' +
    'padding:7px 4px 7px 16px;border-left:1px solid #7f8c8d}' +
    '.logo2{display:flex;flex:none;line-height:0;margin-left:auto}' +
    '.logo2 img{display:block;height:36px;width:auto}' +
    'a:hover{text-decoration:underline}' +
    'a:focus-visible{outline:3px solid #f1c40f;outline-offset:2px;border-radius:4px}';

  // Fuera del Shadow DOM: no imprimir la barra (las páginas tienen "Imprimir ficha")
  var CSS_PAGINA = '@media print{#barra-sitio{display:none!important}}';

  function esInicio(path) { return PAGINAS_INICIO.indexOf(path) > -1; }

  function tieneEnlaces(h, a, b) {
    return h.querySelector('a[href$="' + a + '"]') && h.querySelector('a[href$="' + b + '"]');
  }

  function quitarBarraVieja() {
    var viejo = document.getElementById('header-navegacion');
    if (viejo) { viejo.remove(); return; }
    [].slice.call(document.querySelectorAll('header')).forEach(function (h) {
      if (tieneEnlaces(h, 'matematica.html', 'lengua.html') || tieneEnlaces(h, 'primer-ciclo.html', 'segundo-ciclo.html')) h.remove();
    });
  }

  function init() {
    quitarBarraVieja();

    var st = document.createElement('style'); st.textContent = CSS_PAGINA; document.head.appendChild(st);

    var host = document.createElement('div');
    host.id = 'barra-sitio';
    host.setAttribute('role', 'banner');
    var root = host.attachShadow({ mode: 'open' });
    root.innerHTML =
      '<style>' + CSS_SHADOW + '</style>' +
      '<div class="barra">' +
      '<a class="logo" href="' + INICIO + '" aria-label="Ir al inicio de Escolar"><img src="/logo.png" alt="Escolar"></a>' +
      '<a class="volver" id="bs-volver" href="' + INICIO + '">⬅ ' + TXT_INICIO + '</a>' +
      '<a class="logo2" href="https://actividades.com.ar" aria-label="Actividades.com.ar"><img src="/logo2.png" alt="Actividades.com.ar"></a>' +
      '</div>';
    // Si el <body> de la página es flex o grid, la barra no puede ser un hijo suyo (ocuparía una columna
    // y se achicaría): se coloca justo antes del <body>, como bloque propio a todo el ancho.
    var dispBody = getComputedStyle(document.body).display;
    if (/flex|grid/.test(dispBody)) document.documentElement.insertBefore(host, document.body);
    else document.body.insertBefore(host, document.body.firstChild);
    document.documentElement.classList.add('barra-sitio');   // las páginas con cabecera propia pueden bajarla 48px

    // Pegada arriba y a todo el ancho, aunque el <body> de la página tenga margen o relleno.
    function fijar(prop, val) { host.style.setProperty(prop, val, 'important'); }
    host.style.display = 'block';   // sin !important a propósito: así la regla de impresión (display:none!important) le gana
    function ajustar() {
      // Se mide y se corrige hasta quedar exactamente en la esquina superior izquierda del documento,
      // sin suponer cómo arma cada página su <body> (márgenes, relleno, centrado con flex, etc.).
      fijar('z-index', '2147483000'); fijar('padding', '0'); fijar('transform', 'none');
      fijar('position', 'relative'); fijar('top', 'auto');          // medir sin el efecto de "sticky"
      fijar('width', document.documentElement.clientWidth + 'px');
      var ml = 0, mt = 0;
      fijar('margin', '0');
      for (var i = 0; i < 6; i++) {
        var r = host.getBoundingClientRect();
        var dx = r.left + (window.pageXOffset || 0), dy = r.top + (window.pageYOffset || 0);
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) break;
        ml -= dx; mt -= dy;
        fijar('margin', mt + 'px 0 0 ' + ml + 'px');
      }
      fijar('position', 'sticky'); fijar('top', '0');
    }
    ajustar();
    window.addEventListener('load', ajustar);
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(ajustar, 120); });

    var btn = root.getElementById('bs-volver');

    // ¿Llegué desde otra página del sitio?
    var ref = null;
    try {
      var u = new URL(document.referrer);
      if (u.origin === location.origin && u.href.split('#')[0] !== location.href.split('#')[0]) ref = u;
    } catch (e) {}
    if (!ref) return;                         // sin página anterior dentro del sitio: queda "Volver al inicio"

    btn.href = ref.pathname + ref.search + ref.hash;   // útil para abrir en pestaña nueva / copiar enlace

    if (esInicio(ref.pathname)) {
      btn.textContent = '⬅ ' + TXT_INICIO;
    } else {
      fetch(ref.href, { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw 0; return r.text(); })
        .then(function (html) {
          var t = new DOMParser().parseFromString(html, 'text/html').querySelector('title');
          t = t ? t.textContent.replace(/\s+/g, ' ').trim() : '';
          btn.textContent = '⬅ Volver a ' + (t || 'la página anterior');
          btn.title = btn.textContent;
        })
        .catch(function () { btn.textContent = '⬅ Volver a la página anterior'; });
    }

    // Volver con el historial: así la página anterior conserva su posición y su propio "Volver".
    // Si en esta página se agregaron entradas al historial (enlaces #, etc.), se usa el enlace normal.
    var largo0 = history.length;
    btn.addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (history.length === largo0) { e.preventDefault(); history.back(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
