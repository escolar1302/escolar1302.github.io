/* ============================================================
   catalogo-core.js
   Lee cuentos.js (CUENTOS, RECORRIDOS, GENEROS, CARPETA_PDF) y lo
   convierte en una estructura uniforme que usan las dos páginas
   alternativas (index_A.html e index_B.html).
   NO hay que tocar cuentos.js: se sigue cargando igual que ahora.
   Va en la misma carpeta que cuentos.js y se carga DESPUÉS de él.
   ============================================================ */
(function(){
  "use strict";

  const norm = s => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  function lev(a, b){
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = Array.from({length: b.length + 1}, (_, j) => j);
    for (let i = 1; i <= a.length; i++){
      const cur = [i];
      for (let j = 1; j <= b.length; j++)
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }

  const CARPETA = (typeof CARPETA_PDF !== "undefined") ? CARPETA_PDF : "pdf/";
  const GENS = (typeof GENEROS !== "undefined" && Array.isArray(GENEROS)) ? GENEROS.map(String) : [];
  const GK = GENS.map(norm);

  // Una paleta por género (en el orden de la lista GENEROS)
  const PALETA = ["#8E44AD", "#16A085", "#34495E", "#2980B9", "#E67E22", "#C0392B", "#27AE60", "#D4A017", "#7F8C8D"];
  const colorGenero = g => {
    const i = GENS.indexOf(g);
    return i >= 0 ? PALETA[i % PALETA.length] : "#90A4AE";
  };

  function resolverGenero(g){
    const k = norm(g);
    if (!k) return "";
    const i = GK.indexOf(k);
    if (i >= 0) return GENS[i];
    if (k.length >= 5){
      const c = GK.map((x, j) => x.indexOf(k) === 0 ? j : -1).filter(j => j >= 0);
      if (c.length === 1) return GENS[c[0]];
    }
    let mejor = -1, dm = 99, empate = false;
    GK.forEach((x, j) => { const d = lev(k, x); if (d < dm){ dm = d; mejor = j; empate = false; } else if (d === dm) empate = true; });
    return (mejor >= 0 && dm <= 2 && !empate && k.length >= 4) ? GENS[mejor] : "";
  }

  const DOCS = [
    {clave: "cuento",         etiqueta: "Cuento",                   corta: "Cuento",          grupo: "aula"},
    {clave: "texto2",         etiqueta: "Texto 2",                  corta: "Texto 2",         grupo: "aula", extra: 2},
    {clave: "texto3",         etiqueta: "Texto 3",                  corta: "Texto 3",         grupo: "aula", extra: 3},
    {clave: "secuencia",      etiqueta: "Secuencia",                corta: "Secuencia",       grupo: "aula"},
    {clave: "fichas",         etiqueta: "Fichas",                   corta: "Fichas",          grupo: "aula"},
    {clave: "secuencia_guia", etiqueta: "Guía docente · secuencia", corta: "Guía secuencia",  grupo: "docente"},
    {clave: "fichas_guia",    etiqueta: "Guía docente · fichas",    corta: "Guía fichas",     grupo: "docente"}
  ];

  const esObj = o => o && typeof o === "object" && !Array.isArray(o);
  const textoDe = (c, campo, k) => (esObj(c[campo]) && typeof c[campo][k] === "string") ? c[campo][k].trim() : "";

  function cantidadTextos(c){
    let n = Number(c.textos);
    n = (Number.isInteger(n) && n >= 1 && n <= 3) ? n : 1;
    const nombra = k => [c.enlaces, c.excepciones, c.etiquetas, c.autores].some(o => esObj(o) && k in o) ||
                        (Array.isArray(c.faltan) && c.faltan.indexOf(k) !== -1);
    if (nombra("texto2")) n = Math.max(n, 2);
    if (nombra("texto3")) n = Math.max(n, 3);
    return n;
  }
  function mostrarDoc(c, d){
    if (Array.isArray(c.solo)) return c.solo.indexOf(d.clave) !== -1;
    return !d.extra || d.extra <= cantidadTextos(c);
  }

  // Documentos de un cuento / recorrido, ya resueltos (dirección, si es externo, si falta)
  function docsDe(c, esReco){
    if (esReco && !c.slug) return [];
    return DOCS.filter(d => mostrarDoc(c, d)).map(function(d){
      const pronto = Array.isArray(c.faltan) && c.faltan.indexOf(d.clave) !== -1;
      const ext = esObj(c.enlaces) && c.enlaces[d.clave];
      const nombre = (esObj(c.excepciones) && c.excepciones[d.clave]) || (c.slug + "_" + d.clave + ".pdf");
      const etiq = textoDe(c, "etiquetas", d.clave) || ((esReco && d.clave === "cuento") ? "Cuentos" : d.etiqueta);
      return {
        clave: d.clave, grupo: d.grupo,
        etiqueta: etiq,
        corta: textoDe(c, "etiquetas", d.clave) || ((esReco && d.clave === "cuento") ? "Cuentos" : d.corta),
        pronto: pronto,
        externo: !!ext,
        href: pronto ? "" : (ext || (CARPETA + encodeURIComponent(nombre))),
        autor: textoDe(c, "autores", d.clave)
      };
    });
  }

  const auto = c => (typeof c.autoevaluacion === "string" && c.autoevaluacion.trim()) ? c.autoevaluacion.trim() : "";

  // ---- Cuentos ----
  const cuentos = [], porSlug = new Map();
  (typeof CUENTOS !== "undefined" && Array.isArray(CUENTOS) ? CUENTOS : []).forEach(function(c){
    if (!c || !c.slug || !c.titulo || porSlug.has(c.slug)) return;
    const it = {
      tipo: "cuento", slug: c.slug, titulo: c.titulo,
      autor: typeof c.autor === "string" ? c.autor.trim() : "",
      autoresExtra: esObj(c.autores) ? Object.keys(c.autores).map(k => String(c.autores[k]).trim()).filter(Boolean) : [],
      genero: resolverGenero(c.genero != null ? c.genero : c["género"]),
      temas: Array.isArray(c.temas) ? c.temas.map(String) : (typeof c.temas === "string" ? [c.temas] : []),
      docs: docsDe(c, false),
      auto: auto(c),
      recos: []
    };
    it.color = colorGenero(it.genero);
    porSlug.set(c.slug, it);
    cuentos.push(it);
  });

  // ---- Recorridos ----
  const recorridos = [];
  (typeof RECORRIDOS !== "undefined" && Array.isArray(RECORRIDOS) ? RECORRIDOS : []).forEach(function(r, i){
    if (!r || !r.titulo) return;
    const miembros = (Array.isArray(r.cuentos) ? r.cuentos : []).map(s => porSlug.get(s)).filter(Boolean);
    const it = {
      tipo: "reco", idx: i, slug: r.slug || ("recorrido_" + i), titulo: r.titulo,
      descripcion: r.descripcion || "", miembros: miembros,
      docs: docsDe(r, true), auto: auto(r), color: "#2c3e50"
    };
    miembros.forEach(m => m.recos.push(it));
    recorridos.push(it);
  });

  // ---- Utilidades para las páginas ----
  const textoBusqueda = it => norm([it.titulo, it.autor, it.genero, it.descripcion || ""]
      .concat(it.temas || []).concat(it.autoresExtra || [])
      .concat((it.docs || []).map(d => d.etiqueta))
      .concat((it.miembros || []).map(m => m.titulo + " " + m.autor)).join(" "));
  cuentos.concat(recorridos).forEach(it => { it._busq = textoBusqueda(it); });

  window.Catalogo = {
    cuentos: cuentos, recorridos: recorridos, generos: GENS,
    norm: norm, colorGenero: colorGenero,
    docOf: (it, clave) => (it.docs || []).filter(d => d.clave === clave)[0] || null,
    pasa: (it, q) => norm(q).split(" ").filter(Boolean).every(t => it._busq.indexOf(t) !== -1),
    // ¿Tiene material de este tipo (sin contar los "próximamente")?
    tiene: (it, claves) => (it.docs || []).some(d => claves.indexOf(d.clave) !== -1 && !d.pronto),
    // Crea un enlace a un documento ya resuelto
    enlace: function(d, cls, texto){
      if (d.pronto){
        const s = document.createElement("span");
        s.className = cls + " pronto"; s.textContent = (texto || d.etiqueta) + " (próximamente)";
        return s;
      }
      const a = document.createElement("a");
      a.className = cls + (d.grupo === "docente" ? " docente" : "");
      a.href = d.href; a.target = "_blank"; a.rel = "noopener";
      a.textContent = (texto || d.etiqueta) + (d.externo ? " ↗" : "");
      if (d.externo) a.title = "Se abre en otro sitio";
      return a;
    }
  };
})();
