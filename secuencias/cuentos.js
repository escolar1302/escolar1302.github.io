// ============================================================
//  CATÁLOGO DE CUENTOS
//  Para agregar un cuento nuevo: copiá un bloque { ... }, pegalo
//  al final de la lista CUENTOS (antes del "];") y cambiá los datos.
//  Todos los bloques terminan con coma, también el último.
//  (Más detalle y modelos para copiar: instrucciones.html)
//
//  DATOS DE CADA CUENTO
//  slug     Prefijo común de los archivos (obligatorio).
//  titulo   Título que se muestra (obligatorio).
//  autor    Autor/a. Para textos sin autor conocido: "Anónimo".
//  genero   UNO solo, de la lista GENEROS de más abajo.
//  temas    Los que quieras, entre corchetes: ["deseos", "sueños"]
//  (autor, genero y temas son opcionales: lo que falte, no se muestra)
//
//  Los PDF se buscan con esta lógica de nombres:
//     slug_cuento.pdf
//     slug_secuencia.pdf
//     slug_fichas.pdf
//     slug_secuencia_guia.pdf
//     slug_fichas_guia.pdf
//
//  Si algún archivo tiene un nombre distinto, se puede indicar con
//  excepciones: { secuencia_guia: "nombre_real.pdf" }
//  Si el cuento no se puede alojar acá (derechos de autor), en vez
//  del PDF se enlaza a su página original con "enlaces". Aplica a
//  cualquiera de los 5 documentos, y el botón muestra una flecha ↗:
//  enlaces: { cuento: "https://sitio.com/el-cuento" }
//  Si todavía falta algún archivo, ponelo en "faltan" y la página
//  lo muestra como "Próximamente":
//  faltan: ["fichas_guia"]
//  Si el cuento tiene autoevaluación, agregá su dirección y aparece un
//  botón azul "Autoevaluación" (se abre en la misma pestaña):
//  autoevaluacion: "https://www.escolar.com.ar/autoevaluaciones/el_cuento.html"
//
//  Para revisar errores de tipeo: abrí la página con ?revisar al final
//  de la dirección (index.html?revisar). Ahí se listan los problemas.
// ============================================================

// Carpeta (relativa a index.html) donde están los PDF
const CARPETA_PDF = "pdf/";

// Vista con la que se abre la página:
// "todos", "genero", "autor", "tema" o "recorridos"
const VISTA_INICIAL = "todos";

// ------------------------------------------------------------
//  GÉNEROS: lista CERRADA. Cada cuento usa uno de estos.
//  El orden de acá es el orden en que se muestran las secciones.
//  Para sumar un género nuevo, agregalo a esta lista (con coma).
//  Un género mal escrito se corrige solo si se parece a uno de la
//  lista; si no, el cuento queda en "Sin clasificar" y aparece
//  como error en ?revisar.
// ------------------------------------------------------------
const GENEROS = [
  "Maravilloso o tradicional",
  "Fábula y cuentos de animales",
  "Terror",
  "Policial",
  "Ciencia ficción",
  "Fantástico",
  "Realista",
  "Humor",
];

const CUENTOS = [
  { slug: "el_loro_pelado", titulo: "El loro pelado",
  autor: "Horacio Quiroga", genero: "Fábula y cuentos de animales",
  autoevaluacion: "/autoeva/el_loro_pelado.html" },
  { slug: "las_medias_de_los_flamencos", titulo: "Las medias de los flamencos",
    autor: "Horacio Quiroga", genero: "Fábula y cuentos de animales",
  autoevaluacion: "/autoeva/las_medias_de_los_flamencos_a.html"   },
  { slug: "el_robo_del_tesoro_sonado", titulo: "El robo del tesoro soñado",
    autor: "Anónimo", genero: "Fantástico" },
  { slug: "la_sentencia", titulo: "La sentencia",
    autor: "Wu Ch'eng-en", genero: "Fantástico" },
  { slug: "la_casa_encantada", titulo: "La casa encantada",
    autor: "Anónimo", genero: "Fantástico" },
  { slug: "cuanto_se_divertian", titulo: "Cuánto se divertían",
    autor: "Isaac Asimov", genero: "Ciencia ficción",
    enlaces: { cuento: "https://ciudadseva.com/texto/cuanto-se-divertian/" },
    autoevaluacion: "/autoeva/cuanto_se_divertian.html" },
{ slug: "caza_mayor", titulo: "Caza mayor",
  autor: "Isaac Asimov", genero: "Ciencia ficción",
  enlaces: { cuento: "https://lecturia.org/cuentos-y-relatos/isaac-asimov-caza-mayor/5245/" },
  autoevaluacion: "/autoeva/caza_mayor1.html" },
{ slug: "lentitud", titulo: "Lentitud",
  autor: "Ricardo Mariño", genero: "Ciencia ficción",
  textos: 2,
  etiquetas: { texto2: "Texto informativo" },
  enlaces: { cuento: "https://imaginaria.com.ar/06/9/marino2.htm" },
  autoevaluacion: "/autoeva/lentitud1.html" },
{ slug: "el_collar", titulo: "El collar",
  autor: "Guy de Maupassant", genero: "Realista",
  textos: 2,
  etiquetas: { texto2: "Biografía" },
  autoevaluacion: "/autoeva/el_collar.html" },
{ slug: "la_muerta", titulo: "La muerta",
  autor: "Guy de Maupassant", genero: "Fantástico",
  autoevaluacion: "/autoeva/la_muerta.html" },
{ slug: "las_joyas", titulo: "Las joyas",
  autor: "Guy de Maupassant", genero: "Realista",
  autoevaluacion: "/autoeva/las_joyas1.html" },
  { slug: "el_barril_de_amontillado", titulo: "El barril de amontillado",
  autor: "Edgar Allan Poe", genero: "Terror",
  textos: 2,
  etiquetas: { texto2: "Biografía breve" },
  autoevaluacion: "/autoeva/el_barril_de_amontillado.html" },
  { slug: "el_corazon_delator", titulo: "El corazón delator",
  autor: "Edgar Allan Poe", genero: "Terror",
  autoevaluacion: "/autoeva/el_corazon_delator.html" },
  { slug: "el_gato_negro", titulo: "El gato negro",
  autor: "Edgar Allan Poe", genero: "Terror",
  autoevaluacion: "/autoeva/el_gato_negro.html" },
  { slug: "el_principe_que_se_caso_con_una_rana", titulo: "El príncipe que se casó con una rana",
  autor: "Recopilación Ítalo Calvino", genero: "Maravilloso o tradicional",
  textos: 2,
  etiquetas: { texto2: "El cuento maravilloso" },
  autoevaluacion: "/autoeva/se_caso_con_una_rana.html" },
{ slug: "el_principe_rana", titulo: "El principe rana",
  autor: "Hermanos Grimm", genero: "Maravilloso o tradicional",
  autoevaluacion: "/autoeva/el_principe_rana.html" },
{ slug: "la_bella_y_la_bestia", titulo: "La Bella y la Bestia",
  autor: "Jeanne-Marie Leprince de Beaumont (adaptación de Ana Premuzic y Jimena Dib)", genero: "Maravilloso o tradicional",
  autoevaluacion: "/autoeva/la_bella_y_la_bestia.html" },
{ slug: "una_muerte", titulo: "Una Muerte",
  autor: "Héctor Germán Oesterheld", genero: "Ciencia ficción",
  textos: 2,
  etiquetas: { texto2: "Extraído de" },
  enlaces: { texto2: "https://llevatetodo.com/una-muerte/" },
  autoevaluacion: "/autoeva/una_muerte1.html" },
{ slug: "una_liebre_inteligente", titulo: "Una liebre inteligente",
  autor: "Compilado por Nazanin Amirian", genero: "Fábula y cuentos de animales",
  autoevaluacion: "/autoeva/una_liebre_inteligente.html" },
  { slug: "algo_muy_grave_va_a_suceder_en_este_pueblo", titulo: "Algo muy grave va a suceder en este pueblo",
  autor: "Gabriel García Márquez", genero: "Realista",
  textos: 2,
  etiquetas: { texto2: "Biografía" },
  enlaces: { cuento: "https://ciudadseva.com/texto/algo-muy-grave-va-a-suceder-en-este-pueblo/" },
  autoevaluacion: "/autoeva/algo_muy_grave.html" },
  { slug: "un_dia_de_estos", titulo: "Un día de estos",
  autor: "Gabriel García Márquez", genero: "Realista",
  enlaces: { cuento: "https://ciudadseva.com/texto/un-dia-de-estos/" },
  autoevaluacion: "/autoeva/auto_un_dia_de_estos.html" },
  { slug: "la_ventana_abierta", titulo: "La ventana abierta",
  autor: "Saki", genero: "Humor",
  enlaces: { cuento: "https://ciudadseva.com/texto/la-ventana-abierta/" } },
	{ slug: "el_traje_nuevo_del_emperador", titulo: "El traje nuevo del emperador",
  autor: "Hans Christian Andersen", genero: "Maravilloso o tradicional",
  textos: 2,
  etiquetas: { texto2: "Escuchar audio" },
  enlaces: { texto2: "https://escolar.com.ar/para_libros/traje_emperador/el_traje_nuevo.mp3" },
  autoevaluacion: "https://escolar.com.ar/autoeva/el_traje_nuevo_del_emperador.html" },
];

// ------------------------------------------------------------
//  RECORRIDOS: agrupan cuentos del catálogo en un orden elegido.
//  "cuentos" lleva los slug de los cuentos de arriba, en orden.
//  Un recorrido puede tener además sus propios documentos (por
//  ejemplo un compilado): en ese caso lleva "slug" y los PDF se
//  buscan igual que los de un cuento (slug_cuento.pdf, etc.).
// ------------------------------------------------------------
const RECORRIDOS = [
  { slug: "cuentos_con_suenos", titulo: "Cuentos con sueños",
    descripcion: "Actividades transversales para trabajar los tres cuentos.",
    cuentos: ["el_robo_del_tesoro_sonado", "la_sentencia", "la_casa_encantada"] },
{ slug: "recorrido_maupassant", titulo: "Recorrido Maupassant",
  descripcion: "Trabajo transversal sobre los 3 cuentos del sitio",
  cuentos: ["la_muerta", "el_collar", "las_joyas"],
  solo: ["secuencia", "secuencia_guia"] },
{ titulo: "Ciencia ficción",
  descripcion: "Cuentos para imaginar el futuro",
  cuentos: ["caza_mayor", "cuanto_se_divertian", "lentitud", "una_muerte"] },
  { slug: "recorrido_edgar_allan_poe", titulo: "Recorrido Edgar Allan Poe",
  cuentos: ["el_barril_de_amontillado", "el_corazon_delator", "el_gato_negro"],
  solo: ["secuencia", "secuencia_guia"] },
{ slug: "cuento_maravilloso", titulo: "Cuento Maravilloso",
  cuentos: ["el_principe_que_se_caso_con_una_rana", "el_principe_rana", "la_bella_y_la_bestia"],
  solo: ["secuencia", "secuencia_guia"] },
];
