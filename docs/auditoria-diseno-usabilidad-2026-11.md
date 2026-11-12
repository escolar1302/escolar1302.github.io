# Auditoría de diseño y usabilidad — escolar.com.ar

## Para empezar

Hola! Te dejo una auditoría de diseño y usabilidad de escolar.com.ar, para que decidas qué hacer con cada hallazgo. Este PR no cambia nada del sitio: solo agrega documentos. No hace falta mergearlo; si se mergea, quedan publicados en la web. La hice con IA y no se probó con docentes ni alumnos, así que puede tener errores.

Si le pedís a Claude "buscá solicitudes de cambio y guiame en cómo resolverlas", esta es la revisión que te propongo hacer con él:

1. Leer `docs/auditoria-diseno-usabilidad-2026-11.md` y `docs/auditoria-hallazgos-para-agentes-2026-11.md`. El segundo tiene cada hallazgo con código, archivos, comando para comprobarlo y grado de certeza.
2. Comprobar contra el código actual de `main` todos los hallazgos de severidad Alta, y probar los marcados como "lectura". El informe ya tuvo errores, así que ninguno se da por cierto.
3. Mostrarte una tabla con cada hallazgo: si se confirma o no, qué impacto tiene para docentes y alumnos, cuánto cuesta arreglarlo y qué recomienda. Ordenada por lo que conviene hacer primero.
4. Recorrer los hallazgos con vos, de a uno, y anotar cuáles querés resolver.
5. No modificar archivos, no hacer commits y no mergear ni cerrar este PR hasta que vos lo indiques. Cada arreglo que elijas conviene que vaya en su propio PR.

Un dato a tener en cuenta: las 38 autoevaluaciones se exportaron desde `constructor_lengua_choice.html`, así que corregir el constructor no cambia las páginas ya exportadas.

Relevamiento del 8 de noviembre de 2026, con comprobaciones del 10 de noviembre.

## Resumen ejecutivo

El sitio tiene mucho contenido valioso y una portada bien resuelta, pero detrás de la home la experiencia es despareja. Las 261 páginas de escolar.com.ar salen de unas 15 plantillas, cada una con sus propios colores, fuentes y forma de responder. Varias tienen errores que afectan a los alumnos hoy. Como los problemas vienen de las plantillas, una corrección en pocas plantillas llega a cientos de páginas.

Los ocho problemas más importantes, ordenados por impacto:

1. **Las respuestas se mezclan entre páginas.** Las 19 fichas de Zona problemas guardan el progreso en el mismo lugar, así que lo respondido en una zona aparece en otra. El arreglo es de una línea.
2. **Gran parte de las actividades no se puede usar con teclado.** En autoevaluaciones y Zona problemas las opciones, y en fichas y diseño curricular las casillas de selección, son `div` con onclick. Afecta a más de 100 páginas.
3. **Los colores de marca no se leen bien.** El verde y el naranja con texto blanco dan entre 2,7 y 2,9:1, cuando el mínimo es 4,5:1. Están en los botones principales de casi todo el sitio. Hay reemplazos más oscuros del mismo tono.
4. **El error se marca solo con color.** En 38 autoevaluaciones la respuesta correcta se indica "en verde", sin texto ni explicación.
5. **No se puede buscar por grado.** Un docente que busca "problemas de 4°" tiene que adivinar en qué sección están. El sitio no tiene buscador ni filtro por grado.
6. **Dos juegos fallan en tablet.** Repertorios oculta sus controles táctiles a partir de 601 px y Concartas solo funciona arrastrando. La página de Herramientas, y la de Secuencias enlazada desde la home, se desbordan a lo ancho en celular.
7. **Hay 65 páginas publicadas sin enlaces desde el sitio, muchas de ellas versiones viejas o de prueba.** Siguen siendo indexables. También hay cuentos repetidos en dos carpetas y actividades que no enlazan al cuento que evalúan.
8. **Archivos pesados.** Hay páginas de hasta 2,8 MB por imágenes embebidas y un logo de 520 KB.

Los puntos 1, 3, 4 y 6 (Repertorios), más las confirmaciones antes de borrar, son cambios chicos que no alteran la estructura del sitio y se pueden hacer primero. La unificación visual (una hoja de estilos compartida) y el filtro por grado son los cambios de mayor impacto a mediano plazo, y son una decisión del dueño del sitio.

Lo que ya funciona bien y conviene conservar:

- La home con acordeones y contadores.
- La barra de navegación compartida (`volver.js`).
- Las vistas de impresión pensadas para el aula.
- Las herramientas con vista previa.
- Dos componentes modelo: el juego de multiplicación y la autoevaluación "Recorrido interactivo".

## Alcance y método

Se revisaron las 261 páginas HTML de escolar.com.ar. La revisión combinó cuatro fuentes.

| Fuente | Qué cubre | Páginas |
| --- | --- | --- |
| Análisis estático del código | Título, idioma, viewport, encabezados, alt, labels, enlaces rotos, huérfanas, tipografías, colores, peso | 261 |
| Medición en vivo a 375 px de ancho | Desborde horizontal, texto chico, contraste, tamaño de controles, imágenes rotas | 261 |
| Revisión del código por plantilla, hecha con IA | Plantillas, consignas, flujo de actividades y juegos, feedback, duplicados | 1 o 2 páginas completas por plantilla, y búsquedas en el resto |
| Recorrido en el navegador, en escritorio y móvil | Home, hubs y una muestra por familia | Muestra |

Criterios: heurísticas de usabilidad de Nielsen, WCAG 2.2 nivel AA (contraste 4,5:1, objetivos táctiles de 24 px) y buenas prácticas para sitios usados por docentes y por chicos de 6 a 12 años en tablet o celular.

Límites: esta auditoría se hizo con IA (Claude) y no reemplaza la mirada de una persona especialista. No hubo pruebas con docentes ni alumnos, ni datos de analítica. No se abrió cada página una por una: la lectura detallada fue por plantilla. Las páginas "huérfanas" son las que ningún enlace `<a href>` del sitio apunta; alguna puede abrirse desde JavaScript.

## Auditoría de diseño

La home y la barra de navegación tienen una identidad cuidada y coherente: Nunito, tarjetas suaves, naranja para Matemática y verde para Lengua, y mascotas. Fuera de la home esa identidad se pierde, porque cada plantilla define sus propios colores, fuente y botones. El problema de diseño más repetido es el contraste: el naranja y el verde de marca, usados como fondo de botones con texto blanco, no llegan al mínimo de legibilidad.

### 1. Contraste insuficiente en los colores de marca (Alta)

Texto blanco sobre los colores de acción del sitio. WCAG AA exige 4,5:1.

| Par de colores | Contraste | Dónde aparece | Reemplazo sugerido |
| --- | --- | --- | --- |
| Blanco sobre verde #27AE60 | 2,87:1 | Botones de autoevaluaciones, Lengua, rosco y dados. También el texto "¡Correcto!" en verde sobre blanco | #1B7A43 (5,4:1) |
| Blanco sobre naranja #E67E22 | 2,85:1 | "Comprobar" en 19 páginas de Zona, "Descargar corrección", herramientas | #B35400 (5,0:1) |
| Blanco sobre naranja #FF7043 | 2,74:1 | Botón flotante de imprimir (unas 60 páginas), "Dejar una sugerencia" | #C2410C (5,2:1) |
| Blanco sobre #F39C12 / #2ECC71 | 2,19 y 2,10:1 | Juegos (pausa, comenzar) | Los mismos oscuros de arriba |
| Gris #607D8B sobre fondos claros | 3,9 a 4,0:1 | Instrucciones de unas 55 fichas, a 13 px | #455A64 (6,6 a 7,2:1) |
| #E65100 sobre blanco | 3,79:1 | Títulos de grupo en la home y títulos de ficha | #BF360C (5,6:1) |

### 2. Sin sistema visual compartido (Alta)

- **Tipografías:** se usan Roboto en 137 páginas, Arial en 99 y Nunito en 96, además de Segoe UI, Inter, Lora, Poppins y Trebuchet. Muchas plantillas declaran Roboto pero no la cargan, así que en Windows se ven en Segoe UI o Arial.
- **Colores:** la mediana es de 19 colores distintos por página, y hay páginas con hasta 119. En la familia de Lengua conviven cinco esquemas: verde #27AE60, verde lima #7CB342, azul #036FB0, gris y un tema oscuro con violeta.
- **Código de color contradictorio:** en diseño curricular el color va por ciclo y no por área.
- **Botones:** los radios van de 8 a 999 px. En la barra de Zona problemas hay seis botones de seis colores, y en los juegos cada uno tiene su estilo.
- **CSS:** casi todo está en línea. Solo hay 7 hojas de estilo en todo el sitio, ninguna compartida.

Recomendación: crear un `/estilos/base.css` con las variables de color por área (ya corregidas para contraste), Nunito, la escala tipográfica y un componente de botón, y cargarlo desde las plantillas. `volver.js` ya muestra que un recurso compartido funciona: está en 245 páginas.

### 3. Legibilidad de textos largos (Media)

- Los cuentos ocupan hasta 900 o 1100 px de ancho, sin interlineado definido, lo que da más de 100 caracteres por línea. Algunos están justificados.
- El contenido pegado de Google Docs trae `font-family:Arial; font-size:11pt; color:#000` en línea, y la plantilla de análisis de texto no lo neutraliza.
- Recomendación: `max-width: 70ch`, `line-height: 1.6`, texto alineado a la izquierda y limpiar los estilos en línea al importar.

### 4. Peso de las páginas e imágenes (Media)

- 42 páginas pesan más de 100 KB de HTML. Las más pesadas, por imágenes base64 embebidas: `1ciclo/images000/numeracion2.html` 2,8 MB, `repaso/index.html` 2,6 MB, `1c_lengua/silabas.html` 1,5 MB y `2c_lengua/egcb.html` 788 KB.
- El logo `logo1.png` pesa 520 KB y se muestra a 72 px de alto.
- El sitio tiene 568 PNG y ningún WebP. La mascota está embebida en base64 en 18 páginas, en vez de cargarse una sola vez como archivo.
- Recomendación: pasar las imágenes a archivos WebP y redimensionar el logo a unos 200 px.

### 5. Responsive (Media)

La home, Zona problemas y diseño curricular se ven bien a 375 px. Los casos que fallan son puntuales:

- 2 iframes de YouTube con 560 px fijos.
- Tablas sin `overflow-x` en trayectorias y multiplicación.
- 32 páginas sin ninguna media query.
- En diseño curricular el botón flotante tapa el último control.

### 6. Lo que funciona bien

- La home: dos niveles de acordeón con contadores, recuerda qué sección estaba abierta y tiene modo oscuro y foco visible.
- `volver.js` da una barra uniforme en 245 páginas. Está aislada en Shadow DOM, tiene contraste de 6,6:1 y no se imprime.
- Las vistas de impresión (Fotocopia, Carpeta, A4 real) están pensadas para el aula, con `@media print` cuidado.
- `juego_multiplicacion` y la plantilla "Recorrido interactivo" son los mejores modelos de componente para replicar.

## Auditoría de usabilidad

Para un docente, llegar a un recurso es fácil desde la home si sabe en qué sección buscar. Es difícil si busca por grado. Una vez en la actividad, los problemas más graves son tres:

- Gran parte de las actividades no se puede usar con teclado.
- El feedback de error depende del color.
- Hay errores de estado: progreso mezclado entre páginas y botones que borran todo sin confirmar.

En los juegos, el uso en tablet falla en dos casos concretos.

### 1. Encontrar un recurso (Alta)

- **No hay búsqueda ni filtro por grado.** La home organiza por área y por tipo de recurso. El grado aparece solo en Diseño curricular. Para encontrar "problemas de 4°" hay que probar Zona problemas o Listos para imprimir, que se organizan por campo. Las herramientas usan rangos numéricos ("Hasta 1000").
- El sitemap anuncia `/buscar.html`, pero esa página no existe.
- **Recomendación:** etiquetar cada recurso con grado o ciclo y agregar en la home un filtro de chips (1° a 7°) que filtre las tarjetas existentes. No hace falta servidor.

### 2. Navegación y orientación (Media)

- `volver.js` resuelve bien el regreso: logo al inicio y botón "Volver" con el título de la página anterior. Pero:
  - No hay breadcrumb. Desde una ficha de Zona no hay enlace al índice de Zona.
  - El texto del botón depende de `<title>` poco cuidados: puede decir "Volver a Nueva página" o "Volver a Generador Docente - Matemática Pro".
  - Para leer ese título, descarga completa la página anterior.
- Las actividades de Lengua no enlazan al cuento que evalúan. Así pasa en 0 de 38 autoevaluaciones y en el índice de `2c_lengua_2`, que manda a ciudadseva.com aunque el cuento esté en el sitio.
- **Títulos y nombres:**
  - 5 páginas sin `<title>` y 63 sin un único h1.
  - Títulos repetidos: "Juegos - Grupo 1" en cuatro páginas.
  - Erratas: "Lentidud", "La abeja harabana".
- **Recomendación:** breadcrumb declarado por página (Inicio › Lengua › Autoevaluables) en `volver.js`, y un enlace "Leer el cuento" en cada actividad.

### 3. Uso con teclado y lectores de pantalla (Alta)

En el HTML estático, 23 páginas tienen elementos clicables que no son botones, y en ellas no se puede responder ni abrir contenido con teclado. Lo mismo ocurre en las plantillas que generan las opciones por JavaScript:

- Opciones de las 38 autoevaluaciones y de las 19 páginas de Zona problemas.
- Acordeones de las 28 páginas de fichas con el botón "Abrir" oculto, casillas de selección de 57 páginas de fichas y celdas del diseño curricular.
- Letras del rosco y pilones de sumas con cartas.

También faltan otros apoyos:

- 280 de 665 imágenes no tienen alt, entre ellas ilustraciones con contenido matemático.
- 38 páginas tienen más campos que etiquetas `<label>`.
- Los mensajes de feedback no se anuncian con `aria-live`.
- 35 páginas no tienen `lang`.
- No hay enlace para saltar al contenido.

**Recomendación:** reemplazar `div onclick` por `<button>`, usar `aria-expanded` en los acordeones y `aria-live` en el feedback. Arreglado en 4 plantillas, cubre más de 100 páginas.

### 4. Feedback y corrección en las actividades (Alta)

- **Solo color:** al errar, las autoevaluaciones dicen "La correcta está marcada en verde". Un alumno con daltonismo no la distingue.
- **Sin explicación:** la plantilla principal de autoevaluación no explica por qué una respuesta está mal. Recorrido interactivo sí lo hace.
- **Sin segunda oportunidad:** cada pregunta queda bloqueada al primer clic, en las autoevaluaciones y en multiplicación.
- **Corrección laxa:** en Zona se eliminan los espacios, así que "5 5" cuenta como 55.
- **Recomendación:** texto "Respuesta correcta: C" con ícono, una línea de explicación por pregunta y "Intentar de nuevo" por pregunta.

### 5. Estado y pérdida de datos (Alta)

- **Progreso cruzado:** las 19 páginas de Zona problemas guardan en la misma clave de localStorage. Probado en vivo: responder bien la primera ficha de `zona_ca1_a` hace que la primera ficha de `zona_ca2_a` se muestre como "¡RESUELTO!".
- **Borrado sin confirmar:**
  - "Limpiar" de las autoevaluaciones (arriba de todo).
  - "Reiniciar" del rosco (junto a "Paso").
- **Pérdida al recargar:** las herramientas de numeración y operaciones pierden lo configurado. El editor y "palabra" sí guardan.
- **Computadoras compartidas:** el progreso queda guardado en el navegador y el alumno siguiente lo hereda. Conviene un botón visible "Empezar como otro alumno".

### 6. Juegos en tablet y celular (Alta)

- **Repertorios no se puede jugar en tablet:** los controles táctiles se ocultan a partir de 601 px de ancho.
- **Concartas solo arrastrando:** no tiene la opción de tocar para elegir.
- **Objetivos táctiles chicos:** 32 px en el rosco y 48 px en dados.
- **Audio:** no se puede silenciar.
- **Instrucciones:** repertorios, sumas con cartas y palabra no tienen consigna. Los bancos de imágenes piden "Clic derecho › Copiar imagen", que no existe en pantallas táctiles.

### 7. Consignas y lenguaje (Media)

- **Instrucciones que no coinciden con la interfaz:** 4 páginas dicen "Presionar ▸ Abrir", pero ese botón está oculto.
- **Botones e íconos poco claros:** los botones solo con emoji (↗️ 🖨️ 📋 🗑️) no dicen qué hacen. Los círculos de colores de nivel (🟠🟣🟢) no tienen leyenda.
- **Tono inconsistente:** se mezcla tuteo y voseo ("Intenta", "Toca" frente a "Probá", "Elegí").
- **Mensajes del navegador:** unas 45 páginas usan `alert()` o `prompt()` para avisos de copiado y validaciones. Conviene reemplazarlos por avisos dentro de la página.

### 8. Páginas de prueba y versiones viejas publicadas (Media)

Según el análisis estático, 65 páginas no reciben enlaces del sitio. Muchas son versiones anteriores o borradores, y siguen públicas e indexables porque no hay `robots.txt`:

- `00.html` (accesos directos personales).
- `pruebas/prueba.html` ("Nueva página").
- `parapro.html`.
- `caza_mayor2.html`, idéntica a `caza_mayor1.html`.
- `palabra1/`, `rosco/index1.html`, `numeracion/index1-2.html`.
- Carpetas completas: `prob_4/`, `problemas/`, `aditivo/`, `trayectorias/`.

Un docente que llega a una versión vieja desde Google ve contenido desactualizado. También hay 6 enlaces rotos, 5 de ellos dentro de páginas huérfanas. El listado completo está en el anexo.

### 9. Lo que funciona bien

- Las herramientas tienen vista previa, opción de imprimir o guardar PDF, historial para no repetir problemas y un video guía.
- Las actividades abiertas de Lengua guardan solas y preparan una entrega descargable.
- "Palabra" acepta palabras sin tilde y sinónimos, confirma antes de reiniciar y repasa los errores al final.
- Los 7 capítulos de Canterville tienen navegación anterior/siguiente accesible.

## Hallazgos por familia de páginas (escolar.com.ar)

Las 261 páginas salen de unas 15 plantillas, y cada una tiene sus propios colores, fuente y forma de responder. Si se arregla una plantilla, el cambio llega a muchas páginas a la vez: las tres plantillas más repetidas (opción múltiple, fichas en acordeón y Zona problemas) suman 97 páginas.

| Familia | Páginas | Plantilla principal | Problema más grave | Sin enlaces entrantes |
| --- | --- | --- | --- | --- |
| Autoevaluaciones y secuencias (`autoeva`, `secuencias`, páginas raíz de Lengua) | 60 | Opción múltiple exportada del constructor (38 páginas) | Las opciones son `div` con onclick, así que no se pueden responder con teclado. Cuando hay error, la respuesta correcta se marca solo con color | 19 |
| Cuentos y fichas de Lengua (`2c_lengua`, `2c_lengua_2`, `para_libros`, `analisis_texto`) | 79 | Fichas en acordeón (40) y actividad abierta con entrega (28) | La actividad no enlaza al cuento: el índice manda a ciudadseva.com. Hay páginas de hasta 788 KB por imágenes base64 | 9 |
| Matemática (`zona_problemas`, `numera`, `multdiv`, `1ciclo`, etc.) | 61 | Zona problemas (19) y constructor de fichas (15) | Las 19 páginas de Zona guardan el progreso en la misma clave (`mat_progreso_alumno`), así que las respuestas de una zona aparecen en otra | 18 |
| Juegos e interactivos | 26 | Sin plantilla común; 4 páginas son embebidos de Wordwall | Repertorios oculta los controles táctiles en pantallas de 601 px o más, así que en tablet no se puede jugar. Concartas solo funciona arrastrando | 7 |
| Home, herramientas y diseño curricular | 35 | Home con acordeones; 14 páginas de diseño curricular | No se puede buscar ni filtrar por grado. En diseño curricular el foco no se ve y las celdas no se pueden seleccionar con teclado | 12 |

### Autoevaluaciones

- **Alta.** En 38 páginas las opciones son `<div onclick>`, sin `tabindex` ni estilo de foco. Ejemplo: `autoeva/el_gato_negro.html`. La plantilla "Recorrido interactivo" (`aladino2026`, `feing`) ya usa `<button>` y `aria-live`, así que sirve de modelo.
- **Alta.** El feedback de error dice "La correcta está marcada en verde", pero el fondo verde y el rojo tienen 1,03:1 de contraste entre sí. Hay que agregar el texto "Respuesta correcta: C".
- **Media.** "Limpiar" borra todo sin confirmar y está arriba de todo. Cada pregunta queda bloqueada después del primer clic.
- **Media.** Ninguna de las 38 enlaza al texto del cuento. Cada página carga unos 72 KB del constructor completo sin usarlo.
- **Media.** Las variantes `el_hombre_sin_cabeza`, `…0` y `…1` comparten el progreso. En computadoras compartidas de la escuela, el alumno siguiente hereda lo que respondió el anterior (probable).

### Cuentos y fichas de Lengua

- **Alta.** El encabezado de las tarjetas y la casilla para imprimir son `div` con onclick. En 28 páginas el botón "Abrir" está oculto, así que no se pueden abrir con teclado; en las demás sí. Los botones ↗️ 🖨️ 📋 🗑️ son solo emoji y no tienen `aria-label`.
- **Alta.** Las imágenes base64 y los restos de copiado desde Gemini (`data-path-to-node`, hasta 1748 por página) inflan el peso: `egcb.html` 788 KB, `collar.html` 570 KB. El PDF `teseoyelminotauro.pdf` pesa 13,9 MB.
- **Media.** Al abrir la página todas las tarjetas aparecen plegadas, cuento incluido. El texto largo ocupa hasta 900 px de ancho, sin interlineado definido, y algunos están justificados.
- **Media.** Los mismos cuentos están en dos carpetas con nombres distintos (`joyas`/`las_joyas`, `collar`/`el_collar`). Los archivos usan siglas (`egcb`, `ehsc`, `tyem`). Hay erratas en títulos: "Al muy grave", "La abeja harabana", "La medias de los flamencos".
- **Media.** Dos iframes de YouTube tienen 560 px fijos (`corazon_delator`, `uli`).

### Matemática

- **Alta.** Las 19 páginas de Zona problemas comparten la clave `mat_progreso_alumno` de localStorage y restauran las respuestas por posición de tarjeta. El arreglo es usar una clave por página.
- **Alta.** Hay entre 36 y 68 opciones `div onclick` por página. Las 19 páginas de Zona no tienen `lang` ni `h1`: empiezan en h3.
- **Media.** En 4 páginas la consigna dice "Presionar ▸ Abrir", pero ese botón está oculto con `.btn-toggle-card{display:none}`.
- **Media.** La barra de Zona muestra seis botones del mismo peso visual y de colores distintos (Digital, Fotocopia, Carpeta, Copiar/Editar, Limpiar, Imprimir). No distingue las vistas de las acciones, y "Limpiar" en rojo está junto a "Imprimir".
- **Media.** `repaso/index.html` pesa 2,6 MB y `1ciclo/images000/numeracion2.html` 2,8 MB, por imágenes embebidas.
- **Media.** Muchas imágenes con contenido matemático no tienen alt: trayectorias 16 de 16, repaso 35 de 36, recursos 20 de 29.
- **Baja.** Hay títulos genéricos ("Zona 1", "Actividad de Matemática") y versiones visibles en el título ("v7.3", "v1.4.1").

### Juegos e interactivos

- **Alta.** `juego-repertorios/index.html:90` oculta `#controles-touch` con `min-width:601px`: en una tablet de 768 px no hay ni flechas ni gestos. Conviene decidirlo con `(pointer:coarse)` y no por el ancho.
- **Alta.** Concartas solo funciona arrastrando, con un polyfill beta de unpkg. Sumas con cartas, en cambio, deja tocar para elegir.
- **Media.** Repertorios, sumas con cartas y palabra no tienen ninguna consigna. El rosco publicado perdió la ayuda que sí tiene `rosco/index1.html`.
- **Media.** El audio no se puede silenciar (repertorios y la cuenta regresiva del rosco). "Reiniciar" del rosco está junto a "Paso" y borra todo sin confirmar.
- **Media.** Las letras del rosco miden 32 px en móvil y las fichas de dados 48 px. Lo recomendable para chicos es al menos 44 a 48 px.
- **Baja.** Se mezcla tuteo y voseo ("Intenta de nuevo" con "Probá"). Cuatro páginas se titulan "Juegos - Grupo 1". Los iframes de Wordwall no tienen `title`.

### Home, herramientas y diseño curricular

- **Alta.** En diseño curricular el color va por ciclo: naranja de 1° a 3°, verde de 4° a 7°. En la home, en cambio, el naranja es Matemática y el verde es Lengua.
- **Alta.** En diseño curricular, las celdas seleccionables son `div` con onclick. Los acordeones son botones, pero tienen `outline:none` y no hay ninguna regla de foco, así que el foco no se ve. El h1 queda pegado al borde izquierdo y el botón flotante tapa el "+" del último acordeón.
- **Media.** En numeración y operaciones, al recargar se pierde la configuración y lo editado. El editor sí guarda solo.
- **Media.** El armador de problemas descarga un JSON de 2,0 MB en cada visita.

## Plan de mejoras priorizado

La mayoría de los problemas se repiten en muchas páginas porque salen de unas pocas plantillas. Por eso conviene arreglar la plantilla y volver a exportar, en lugar de corregir página por página. El orden propuesto va de lo que rompe la experiencia hoy y cuesta poco a lo estructural.

| # | Mejora | Impacto | Esfuerzo | Alcance |
| --- | --- | --- | --- | --- |
| 1 | Clave de localStorage por página en Zona problemas | Alto: hoy se mezclan respuestas entre zonas | Muy bajo (1 línea por plantilla) | 19 páginas |
| 2 | Mostrar los controles táctiles de Repertorios con `(pointer:coarse)` | Alto: hoy no se puede jugar en tablet | Muy bajo | 1 juego |
| 3 | Oscurecer los 4 colores de acción (verde, dos naranjas, gris de ayuda) | Alto: legibilidad en todo el sitio | Bajo (buscar y reemplazar valores) | Más de 150 páginas |
| 4 | Agregar "Respuesta correcta: C" al feedback de error | Alto: daltonismo y comprensión | Bajo | 38 páginas |
| 5 | Confirmación en "Limpiar" y "Reiniciar" | Medio | Bajo | Unas 40 páginas |
| 6 | Corregir la consigna "Presionar ▸ Abrir" y las erratas de títulos | Medio | Bajo | Unas 15 páginas |
| 7 | Despublicar o marcar `noindex` en páginas de prueba y versiones viejas, y agregar `robots.txt` | Medio: evita que se llegue a contenido viejo | Bajo | Hasta 65 páginas, a revisar una por una |
| 8 | `<button>` en lugar de `div onclick`, más `aria-expanded` y `aria-live` | Alto: teclado y lectores de pantalla | Medio (4 plantillas, luego reexportar) | Más de 100 páginas |
| 9 | Enlace "Leer el cuento" en cada actividad de Lengua | Medio | Medio | Unas 70 páginas |
| 10 | Sacar las imágenes base64 a archivos WebP y redimensionar el logo | Medio: carga en celular | Medio | Unas 40 páginas |
| 11 | Hoja de estilos compartida (`base.css`) con colores por área, Nunito y botón | Alto: consistencia visual | Alto | Todo el sitio, plantilla por plantilla |
| 12 | Etiqueta de grado en cada recurso y filtro por grado en la home | Alto: encontrar recursos | Alto (requiere decidir el grado de cada recurso) | Home |
| 13 | Breadcrumb declarado por página en `volver.js` | Medio | Medio | 245 páginas, con un cambio central |

Las mejoras 1 a 7 se pueden hacer en una o dos tandas cortas y no cambian la estructura del sitio. De la 8 a la 13 conviene pensarlas con más tiempo: tocan las plantillas y la organización de los contenidos.

Preguntas abiertas para el dueño:

- ¿Las páginas de versiones viejas (`index1`, `…0`, `palabra1`) se pueden borrar, o se mantienen por enlaces externos?
- El constructor de las autoevaluaciones es `constructor_lengua_choice.html`. Corregirlo no cambia las 38 páginas ya exportadas: ¿se pueden volver a exportar, o hay que editarlas a mano?
- ¿Hay datos de uso (Google Analytics está en 210 páginas) para priorizar por tráfico?

## Anexo: resultados de los chequeos automáticos

Las mediciones se hicieron el 8 de noviembre de 2026 sobre las 261 páginas de escolar.com.ar publicadas: el código de la rama `main` y el sitio en vivo a 375 px de ancho.

| Chequeo | Páginas afectadas (de 261) |
| --- | --- |
| Sin meta description | 253 |
| Con algún control menor a 24 px (1530 de 6982 controles) | 223 |
| Sin enlaces entrantes (huérfanas) | 65 |
| Sin exactamente un h1 | 63 |
| Más del 15 % del texto bajo 4,5:1 de contraste (medición aproximada) | 79 |
| Más del 30 % del texto por debajo de 14 px | 47 |
| Más de 100 KB de HTML | 42 |
| Más campos que etiquetas `<label>` | 38 |
| Anchos fijos de 100 px o más | 37 |
| Sin atributo `lang` | 35 |
| Sin media queries | 32 |
| Con imágenes sin alt (280 de 665 imágenes) | 29 |
| Elementos no-botón con onclick en el HTML | 23 |
| Sin barra de navegación (`volver.js`) | 16 |
| Desborde horizontal a 375 px | 15 |
| Con imágenes que no cargan | 9 |
| Sin `<title>` | 5 |
| Sin meta viewport | 5 |

### Desborde horizontal en móvil (ancho del documento a 375 px)

- Enlazadas desde el sitio:
  - `herramientas/index.html` (424 px)
  - `secuencias/index.html` (643 px)
  - `repaso/30tapitas.html` (396 px)
  - Varios juegos por 11 px: `dados`, `letras`, `cartas_espanolas` y `sumas_cartas`.
- Huérfanas: `herramientas/acentuacion*.html` (1132 px), `2c_lengua/nuevo1.html` (568 px), `secuencias/index_c.html` (631 px), `trayectorias/index.html` (473 px), `trayectorias/index0.html` (456 px).

### Imágenes que no cargan

- `concartas/index.html`: las 10 cartas, que vienen de un dominio externo.
- Una imagen cada una en `juego-repertorios`, `sumas_cartas/modo-juego` y `palabra1`.

### Enlaces rotos

- `galeria.html` → `images/oso-guarda 1.png`
- `1ciclo/images000/numeracion2.html` → `../primer-ciclo.html` y `../segundo-ciclo.html`
- `2c_lengua/images3/el_fantasma_de_canterville.html` → `../primer-ciclo.html`, `../segundo-ciclo.html` e `index.html`

### Páginas sin enlaces entrantes (65)

Las redirecciones (`lengua.html`, `diseno.html`, `recursos.html`) y el fragmento `pie.html` son intencionales. Las demás conviene revisarlas una por una:

- `00.html`, `parapro.html`, `pie.html`, `consignas_lengua.html`, `secuencias.html`
- `pruebas/prueba.html`, `pruebas/prueba2.html`
- `2c_lengua/index1`, `lbyl1b`, `lgdly1`, `nuevo1`, `images3/el_fantasma_de_canterville`
- `2c_lengua_2/inde1x`, `fantasma_de_canterville_capitulo_i`
- `autoeva/algo_muy_grave`, `auto_un_dia_de_estos`, `caza_mayor2`, `efc_cap01`, `efc_cap02`, `el-collar1`, `el_hombre_sin_cabeza0`, `el_hombre_sin_cabeza1`, `teseo_y_el_minotauro1`
- `aditivo/`, `armador/`, `concartas/` (2), `contenidos-concampos/index1`, `herramientas/acentuacion`, `acentuacion1`, `index0`
- `juego-repertorios/index1`, `juegos/index`, `numeracion/` (3), `numeros/2index`, `operaciones/` (2), `palabra1/`, `paraprompt/`, `para_libros/index1`, `para_libros/traje_emperador/`
- `problemas/`, `prob_4/` (4), `rosco/index1`, `secuencias/index_a` a `index_d`, `instrucciones`, `prompt`, `anteriores/instrucciones`
- `sumas_cartas/modo-juego2`, `trayectorias/` (2), `zona_problemas/index1`, `1ciclo/images000/numeracion2`, `1ciclo/numeracion2/Numeraci_n_y_operaciones`

### Títulos duplicados

- "La Bella y la Bestia" (5)
- "El fantasma de Canterville" (4)
- "El hombre sin cabeza" (4)
- "El traje nuevo del emperador" (4)
- "Juegos - Grupo 1" (4)
- "Secuencias de Lengua" (4)

La medición de contraste y tamaño es automática y aproximada: toma hasta 400 elementos de texto por página y el primer fondo opaco hacia arriba. Sirve para comparar páginas, no como certificación WCAG.
