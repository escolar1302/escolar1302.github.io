# Hallazgos verificables de la auditoría

Complemento de `auditoria-diseno-usabilidad-2026-11.md`, en un formato pensado para revisarlo con un agente de código.

Este documento se generó con IA (Claude) y describe hallazgos, no órdenes de cambio. Conviene comprobar cada uno antes de actuar. Qué se arregla lo decide el dueño de los sitios.

## Referencia

- Fecha de las comprobaciones: 2026-11-10.
- `escolar1302.github.io`: commit `77063bc`.
- `actividades`: commit `f02ca5d`.
- Los comandos se corren con bash desde la raíz del repo indicado. Si el código cambió, los números de línea y los conteos pueden no coincidir.

## Grado de certeza

- **en vivo:** probado en el sitio publicado con un navegador.
- **comando:** el comando confirma el hecho descripto en el código.
- **lectura:** se dedujo de leer el código o el comando da una aproximación. Falta probarlo en uso.

## Resumen

| ID | Repo | Severidad | Certeza | Hallazgo |
| --- | --- | --- | --- | --- |
| ZONA-01 | escolar1302.github.io | Alta | en vivo | Zona problemas guarda el progreso de todas las páginas en la misma clave |
| ZONA-02 | escolar1302.github.io | Alta | comando | Las opciones de Zona problemas son `div` con `onclick` |
| ZONA-03 | escolar1302.github.io | Media | comando | Zona problemas no declara `lang` |
| AUTO-01 | escolar1302.github.io | Alta | comando | Las opciones de las autoevaluaciones son `div` con `onclick` |
| AUTO-02 | escolar1302.github.io | Alta | comando | La respuesta correcta se indica solo con color |
| AUTO-03 | escolar1302.github.io | Media | comando | "Limpiar" borra el progreso sin confirmar |
| AUTO-04 | escolar1302.github.io | Media | comando | Las autoevaluaciones no enlazan al cuento |
| FICHA-01 | escolar1302.github.io | Alta | lectura | Fichas con el botón "Abrir" oculto: el acordeón solo abre con clic en un `div` |
| FICHA-02 | escolar1302.github.io | Alta | lectura | La casilla para seleccionar fichas es un `div` con `onclick` |
| FICHA-03 | escolar1302.github.io | Media | comando | La consigna dice "Presionar ▸ Abrir", pero el botón está oculto |
| LENG-01 | escolar1302.github.io | Alta | comando | El índice de `2c_lengua_2` manda a ciudadseva.com |
| LENG-02 | escolar1302.github.io | Media | comando | Iframes de YouTube con ancho fijo de 560 px |
| DIS-01 | escolar1302.github.io | Alta | comando | Diseño curricular no tiene ninguna regla de foco |
| DIS-02 | escolar1302.github.io | Alta | comando | Las celdas seleccionables de diseño curricular son `div` con `onclick` |
| DIS-03 | escolar1302.github.io | Alta | comando | En diseño curricular el color va por ciclo y no por área |
| JUEGO-01 | escolar1302.github.io | Alta | en vivo | Repertorios oculta los controles táctiles desde 601 px |
| JUEGO-02 | escolar1302.github.io | Alta | lectura | Concartas solo funciona arrastrando |
| JUEGO-03 | escolar1302.github.io | Media | comando | "Reiniciar" del rosco no confirma |
| NAV-01 | escolar1302.github.io | Media | comando | El sitemap anuncia `/buscar.html`, que no existe |
| NAV-02 | escolar1302.github.io | Media | comando | `volver.js` descarga la página anterior para leer su título |
| PESO-01 | escolar1302.github.io | Media | comando | Páginas HTML de más de 1 MB |
| PESO-02 | escolar1302.github.io | Media | comando | `logo1.png` pesa 520 KB |
| COLOR-01 | escolar1302.github.io | Alta | lectura | Fondos #27AE60 (contraste 2,87:1 con blanco) |
| COLOR-02 | escolar1302.github.io | Alta | lectura | Fondos #E67E22 (contraste 2,85:1 con blanco) |
| COLOR-03 | escolar1302.github.io | Alta | lectura | Fondos #FF7043 (contraste 2,74:1 con blanco) |
| TOOL-01 | escolar1302.github.io | Media | comando | Numeración y operaciones no guardan el estado |
| ACT-01 | actividades | Alta | comando | PDF de más de 5 MB sin aviso de peso |
| ACT-02 | actividades | Alta | en vivo | Los enlaces de los paneles cerrados reciben foco |
| ACT-03 | actividades | Media | comando | `actividades` no tiene `h1` ni `<main>` |
| HUER-01 | escolar1302.github.io | Media | lectura | 65 páginas sin enlaces entrantes |
| ALT-01 | escolar1302.github.io | Media | comando | 280 de 665 imágenes sin atributo `alt` |
| MOVIL-01 | escolar1302.github.io | Media | en vivo | Herramientas y Secuencias se desbordan a 375 px |

## Detalle

### ZONA-01: Zona problemas guarda el progreso de todas las páginas en la misma clave

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: en vivo
- Resultado esperado: 19 archivos
- Recomendación: Usar una clave por página, por ejemplo con `location.pathname`.
- Nota: Probado el 2026-11-10: responder bien la primera ficha de `zona_ca1_a.html` hizo que la primera ficha de `zona_ca2_a.html` se mostrara como "¡RESUELTO!". El texto escrito solo se copia si la tarjeta de esa posición tiene campo de texto.

Comprobar:

```bash
grep -l 'mat_progreso_alumno' zona_problemas/zona_c*.html zona_problemas/mixtos_zona_1_a.html zona_problemas/mixtos_zona_1_b.html zona_problemas/mixtos_zona_2_a.html
```

<details><summary>Resultado (19)</summary>

- `zona_problemas/zona_ca1_a.html`
- `zona_problemas/zona_ca1_b.html`
- `zona_problemas/zona_ca2_a.html`
- `zona_problemas/zona_ca2_b.html`
- `zona_problemas/zona_ca3_a.html`
- `zona_problemas/zona_ca3_b.html`
- `zona_problemas/zona_ca4_a.html`
- `zona_problemas/zona_ca4_b.html`
- `zona_problemas/zona_ca4_c.html`
- `zona_problemas/zona_cm1_a.html`
- `zona_problemas/zona_cm1_b.html`
- `zona_problemas/zona_cm2_a.html`
- `zona_problemas/zona_cm2_b.html`
- `zona_problemas/zona_cm3_a.html`
- `zona_problemas/zona_cm3_b.html`
- `zona_problemas/zona_cm4_a.html`
- `zona_problemas/mixtos_zona_1_a.html`
- `zona_problemas/mixtos_zona_1_b.html`
- `zona_problemas/mixtos_zona_2_a.html`

</details>

### ZONA-02: Las opciones de Zona problemas son `div` con `onclick`

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: comando
- Resultado esperado: 19 archivos
- Recomendación: Usar `<button>` o radios con `<label>`.

Comprobar:

```bash
grep -l 'class="opcion-btn" onclick' zona_problemas/zona_c*.html zona_problemas/mixtos_zona_1_a.html zona_problemas/mixtos_zona_1_b.html zona_problemas/mixtos_zona_2_a.html
```

<details><summary>Resultado (19)</summary>

- `zona_problemas/zona_ca1_a.html`
- `zona_problemas/zona_ca1_b.html`
- `zona_problemas/zona_ca2_a.html`
- `zona_problemas/zona_ca2_b.html`
- `zona_problemas/zona_ca3_a.html`
- `zona_problemas/zona_ca3_b.html`
- `zona_problemas/zona_ca4_a.html`
- `zona_problemas/zona_ca4_b.html`
- `zona_problemas/zona_ca4_c.html`
- `zona_problemas/zona_cm1_a.html`
- `zona_problemas/zona_cm1_b.html`
- `zona_problemas/zona_cm2_a.html`
- `zona_problemas/zona_cm2_b.html`
- `zona_problemas/zona_cm3_a.html`
- `zona_problemas/zona_cm3_b.html`
- `zona_problemas/zona_cm4_a.html`
- `zona_problemas/mixtos_zona_1_a.html`
- `zona_problemas/mixtos_zona_1_b.html`
- `zona_problemas/mixtos_zona_2_a.html`

</details>

### ZONA-03: Zona problemas no declara `lang`

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 19 archivos
- Recomendación: Agregar `lang="es"` y un `h1`.
- Nota: Tampoco tienen `h1`.

Comprobar:

```bash
grep -L '<html[^>]*lang=' zona_problemas/zona_c*.html zona_problemas/mixtos_zona_1_a.html zona_problemas/mixtos_zona_1_b.html zona_problemas/mixtos_zona_2_a.html
```

<details><summary>Resultado (19)</summary>

- `zona_problemas/zona_ca1_a.html`
- `zona_problemas/zona_ca1_b.html`
- `zona_problemas/zona_ca2_a.html`
- `zona_problemas/zona_ca2_b.html`
- `zona_problemas/zona_ca3_a.html`
- `zona_problemas/zona_ca3_b.html`
- `zona_problemas/zona_ca4_a.html`
- `zona_problemas/zona_ca4_b.html`
- `zona_problemas/zona_ca4_c.html`
- `zona_problemas/zona_cm1_a.html`
- `zona_problemas/zona_cm1_b.html`
- `zona_problemas/zona_cm2_a.html`
- `zona_problemas/zona_cm2_b.html`
- `zona_problemas/zona_cm3_a.html`
- `zona_problemas/zona_cm3_b.html`
- `zona_problemas/zona_cm4_a.html`
- `zona_problemas/mixtos_zona_1_a.html`
- `zona_problemas/mixtos_zona_1_b.html`
- `zona_problemas/mixtos_zona_2_a.html`

</details>

### AUTO-01: Las opciones de las autoevaluaciones son `div` con `onclick`

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: comando
- Resultado esperado: 38 archivos
- Recomendación: Usar `<button>`, como la plantilla de `autoeva/feing.html`.
- Nota: Las 38 páginas se exportaron desde `constructor_lengua_choice.html`. Corregir el constructor no cambia las ya exportadas.

Comprobar:

```bash
grep -l 'onclick="seleccionarOpcion(' $(grep -l 'id="datos-actividad"' autoeva/*.html)
```

<details><summary>Resultado (38)</summary>

- `autoeva/aladino_y_la_lampara_maravillosa.html`
- `autoeva/algo_muy_grave.html`
- `autoeva/auto_un_dia_de_estos.html`
- `autoeva/caza_mayor1.html`
- `autoeva/caza_mayor2.html`
- `autoeva/cuanto_se_divertian.html`
- `autoeva/el_almohadon_de_plumas.html`
- `autoeva/el_barril_de_amontillado.html`
- `autoeva/el_collar.html`
- `autoeva/el_corazon_delator.html`
- `autoeva/el_fantasma_de_canterville_i.html`
- `autoeva/el_fantasma_de_canterville_ii.html`
- `autoeva/el_fantasma_de_canterville_iii.html`
- `autoeva/el_fantasma_de_canterville_iv.html`
- `autoeva/el_fantasma_de_canterville_v.html`
- `autoeva/el_fantasma_de_canterville_vi.html`
- `autoeva/el_fantasma_de_canterville_vii.html`
- `autoeva/el_gato_con_botas.html`
- `autoeva/el_gato_negro.html`
- `autoeva/el_hombre_sin_cabeza.html`
- `autoeva/el_hombre_sin_cabeza0.html`
- `autoeva/el_hombre_sin_cabeza1.html`
- `autoeva/el_loro_pelado.html`
- `autoeva/el_principe_rana.html`
- `autoeva/el_traje_nuevo_del_emperador.html`
- `autoeva/la_abeja_haragana.html`
- `autoeva/la_bella_y_la_bestia.html`
- `autoeva/la_guerra_de_los_yacares.html`
- `autoeva/la_muerta.html`
- `autoeva/la_pata_de_mono.html`
- `autoeva/las_joyas1.html`
- `autoeva/las_medias_de_los_flamencos_a.html`
- `autoeva/lentitud1.html`
- `autoeva/se_caso_con_una_rana.html`
- `autoeva/teseo_y_el_minotauro.html`
- `autoeva/teseo_y_el_minotauro1.html`
- `autoeva/una_liebre_inteligente.html`
- `autoeva/una_muerte1.html`

</details>

### AUTO-02: La respuesta correcta se indica solo con color

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: comando
- Resultado esperado: 38 archivos
- Recomendación: Agregar el texto "Respuesta correcta: C".
- Nota: Misma nota sobre el constructor.

Comprobar:

```bash
grep -l 'La correcta está marcada en verde' autoeva/*.html
```

<details><summary>Resultado (38)</summary>

- `autoeva/aladino_y_la_lampara_maravillosa.html`
- `autoeva/algo_muy_grave.html`
- `autoeva/auto_un_dia_de_estos.html`
- `autoeva/caza_mayor1.html`
- `autoeva/caza_mayor2.html`
- `autoeva/cuanto_se_divertian.html`
- `autoeva/el_almohadon_de_plumas.html`
- `autoeva/el_barril_de_amontillado.html`
- `autoeva/el_collar.html`
- `autoeva/el_corazon_delator.html`
- `autoeva/el_fantasma_de_canterville_i.html`
- `autoeva/el_fantasma_de_canterville_ii.html`
- `autoeva/el_fantasma_de_canterville_iii.html`
- `autoeva/el_fantasma_de_canterville_iv.html`
- `autoeva/el_fantasma_de_canterville_v.html`
- `autoeva/el_fantasma_de_canterville_vi.html`
- `autoeva/el_fantasma_de_canterville_vii.html`
- `autoeva/el_gato_con_botas.html`
- `autoeva/el_gato_negro.html`
- `autoeva/el_hombre_sin_cabeza.html`
- `autoeva/el_hombre_sin_cabeza0.html`
- `autoeva/el_hombre_sin_cabeza1.html`
- `autoeva/el_loro_pelado.html`
- `autoeva/el_principe_rana.html`
- `autoeva/el_traje_nuevo_del_emperador.html`
- `autoeva/la_abeja_haragana.html`
- `autoeva/la_bella_y_la_bestia.html`
- `autoeva/la_guerra_de_los_yacares.html`
- `autoeva/la_muerta.html`
- `autoeva/la_pata_de_mono.html`
- `autoeva/las_joyas1.html`
- `autoeva/las_medias_de_los_flamencos_a.html`
- `autoeva/lentitud1.html`
- `autoeva/se_caso_con_una_rana.html`
- `autoeva/teseo_y_el_minotauro.html`
- `autoeva/teseo_y_el_minotauro1.html`
- `autoeva/una_liebre_inteligente.html`
- `autoeva/una_muerte1.html`

</details>

### AUTO-03: "Limpiar" borra el progreso sin confirmar

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 38 archivos
- Recomendación: Pedir confirmación o permitir deshacer.
- Nota: Zona problemas sí confirma.

Comprobar:

```bash
grep -L 'confirm(' $(grep -l 'function limpiarActividad' autoeva/*.html)
```

<details><summary>Resultado (38)</summary>

- `autoeva/aladino_y_la_lampara_maravillosa.html`
- `autoeva/algo_muy_grave.html`
- `autoeva/auto_un_dia_de_estos.html`
- `autoeva/caza_mayor1.html`
- `autoeva/caza_mayor2.html`
- `autoeva/cuanto_se_divertian.html`
- `autoeva/el_almohadon_de_plumas.html`
- `autoeva/el_barril_de_amontillado.html`
- `autoeva/el_collar.html`
- `autoeva/el_corazon_delator.html`
- `autoeva/el_fantasma_de_canterville_i.html`
- `autoeva/el_fantasma_de_canterville_ii.html`
- `autoeva/el_fantasma_de_canterville_iii.html`
- `autoeva/el_fantasma_de_canterville_iv.html`
- `autoeva/el_fantasma_de_canterville_v.html`
- `autoeva/el_fantasma_de_canterville_vi.html`
- `autoeva/el_fantasma_de_canterville_vii.html`
- `autoeva/el_gato_con_botas.html`
- `autoeva/el_gato_negro.html`
- `autoeva/el_hombre_sin_cabeza.html`
- `autoeva/el_hombre_sin_cabeza0.html`
- `autoeva/el_hombre_sin_cabeza1.html`
- `autoeva/el_loro_pelado.html`
- `autoeva/el_principe_rana.html`
- `autoeva/el_traje_nuevo_del_emperador.html`
- `autoeva/la_abeja_haragana.html`
- `autoeva/la_bella_y_la_bestia.html`
- `autoeva/la_guerra_de_los_yacares.html`
- `autoeva/la_muerta.html`
- `autoeva/la_pata_de_mono.html`
- `autoeva/las_joyas1.html`
- `autoeva/las_medias_de_los_flamencos_a.html`
- `autoeva/lentitud1.html`
- `autoeva/se_caso_con_una_rana.html`
- `autoeva/teseo_y_el_minotauro.html`
- `autoeva/teseo_y_el_minotauro1.html`
- `autoeva/una_liebre_inteligente.html`
- `autoeva/una_muerte1.html`

</details>

### AUTO-04: Las autoevaluaciones no enlazan al cuento

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 38 archivos
- Recomendación: Agregar un enlace "Leer el cuento".

Comprobar:

```bash
grep -LE 'Leer el (texto|cuento)' $(grep -l 'id="datos-actividad"' autoeva/*.html)
```

<details><summary>Resultado (38)</summary>

- `autoeva/aladino_y_la_lampara_maravillosa.html`
- `autoeva/algo_muy_grave.html`
- `autoeva/auto_un_dia_de_estos.html`
- `autoeva/caza_mayor1.html`
- `autoeva/caza_mayor2.html`
- `autoeva/cuanto_se_divertian.html`
- `autoeva/el_almohadon_de_plumas.html`
- `autoeva/el_barril_de_amontillado.html`
- `autoeva/el_collar.html`
- `autoeva/el_corazon_delator.html`
- `autoeva/el_fantasma_de_canterville_i.html`
- `autoeva/el_fantasma_de_canterville_ii.html`
- `autoeva/el_fantasma_de_canterville_iii.html`
- `autoeva/el_fantasma_de_canterville_iv.html`
- `autoeva/el_fantasma_de_canterville_v.html`
- `autoeva/el_fantasma_de_canterville_vi.html`
- `autoeva/el_fantasma_de_canterville_vii.html`
- `autoeva/el_gato_con_botas.html`
- `autoeva/el_gato_negro.html`
- `autoeva/el_hombre_sin_cabeza.html`
- `autoeva/el_hombre_sin_cabeza0.html`
- `autoeva/el_hombre_sin_cabeza1.html`
- `autoeva/el_loro_pelado.html`
- `autoeva/el_principe_rana.html`
- `autoeva/el_traje_nuevo_del_emperador.html`
- `autoeva/la_abeja_haragana.html`
- `autoeva/la_bella_y_la_bestia.html`
- `autoeva/la_guerra_de_los_yacares.html`
- `autoeva/la_muerta.html`
- `autoeva/la_pata_de_mono.html`
- `autoeva/las_joyas1.html`
- `autoeva/las_medias_de_los_flamencos_a.html`
- `autoeva/lentitud1.html`
- `autoeva/se_caso_con_una_rana.html`
- `autoeva/teseo_y_el_minotauro.html`
- `autoeva/teseo_y_el_minotauro1.html`
- `autoeva/una_liebre_inteligente.html`
- `autoeva/una_muerte1.html`

</details>

### FICHA-01: Fichas con el botón "Abrir" oculto: el acordeón solo abre con clic en un `div`

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: lectura
- Resultado esperado: 28 archivos
- Recomendación: Hacer del encabezado un `<button aria-expanded>`.
- Nota: En las páginas donde el botón "Abrir" está visible, sí se puede abrir con teclado. La imposibilidad se dedujo del código; no se probó con teclado real.

Comprobar:

```bash
grep -rlE 'btn-toggle-card *\{ *display: *none' --include=*.html .
```

<details><summary>Resultado (28)</summary>

- `1ciclo/images000/numeracion2.html`
- `1ciclo/index.html`
- `1ciclo/numeracion2/Numeraci_n_y_operaciones.html`
- `1ciclo/numeracion2.html`
- `1c_lengua/bingo.html`
- `1c_lengua/pares_palabras.html`
- `1c_lengua/silabas.html`
- `2c_lengua_2/gato_textos.html`
- `analisis/index.html`
- `multdiv/con_imagenes.html`
- `multdiv/index.html`
- `numera/index.html`
- `numera/numeracion2.html`
- `para_libros/el_jardin.html`
- `para_libros/esa_boca.html`
- `para_libros/la_abeja_haragana.html`
- `para_libros/la_piedra_sopa.html`
- `para_libros/mobuto.html`
- `para_libros/traje_nuevo_del_emperador.html`
- `problemas3/index.html`
- `pruebas/prueba2.html`
- `racionales/index.html`
- `recursos/index.html`
- `repaso/30tapitas.html`
- `repaso/index.html`
- `repertorio-sumas/index.html`
- `sumares/index.html`
- `zona_problemas/mixtos_zona_1_c.html`

</details>

### FICHA-02: La casilla para seleccionar fichas es un `div` con `onclick`

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: lectura
- Resultado esperado: 57 archivos
- Recomendación: Usar `<input type="checkbox">` con etiqueta.
- Nota: No se probó con teclado real.

Comprobar:

```bash
grep -rl "checkbox.className = 'custom-checkbox'" --include=*.html .
```

<details><summary>Resultado (57)</summary>

- `1ciclo/images000/numeracion2.html`
- `1ciclo/index.html`
- `1ciclo/numeracion2/Numeraci_n_y_operaciones.html`
- `1ciclo/numeracion2.html`
- `1c_lengua/bingo.html`
- `1c_lengua/pares_palabras.html`
- `1c_lengua/silabas.html`
- `2c_lengua/almohadon_plumas.html`
- `2c_lengua/amontillado.html`
- `2c_lengua/ayllm.html`
- `2c_lengua/canterville.html`
- `2c_lengua/ciencia_ficcion.html`
- `2c_lengua/collar.html`
- `2c_lengua/corazon_delator.html`
- `2c_lengua/cuanto_se_divertian.html`
- `2c_lengua/cuentos-transformaciones.html`
- `2c_lengua/desvan.html`
- `2c_lengua/egcb.html`
- `2c_lengua/ehsc.html`
- `2c_lengua/elp.html`
- `2c_lengua/epr.html`
- `2c_lengua/etnde.html`
- `2c_lengua/gato_negro.html`
- `2c_lengua/joyas.html`
- `2c_lengua/las_medias_de_los_flamencos.html`
- `2c_lengua/la_muerta.html`
- `2c_lengua/lbyl1b.html`
- `2c_lengua/lbylb.html`
- `2c_lengua/lentitud.html`
- `2c_lengua/lgdly.html`
- `2c_lengua/lgdly1.html`
- `2c_lengua/lrdla.html`
- `2c_lengua/lva.html`
- `2c_lengua/poe.html`
- `2c_lengua/principe-caso-rana.html`
- `2c_lengua/tyem.html`
- `2c_lengua/uli.html`
- `2c_lengua_2/gato_textos.html`
- `analisis/index.html`
- `multdiv/con_imagenes.html`
- `multdiv/index.html`
- `numera/index.html`
- `numera/numeracion2.html`
- `para_libros/el_jardin.html`
- `para_libros/esa_boca.html`
- `para_libros/la_abeja_haragana.html`
- `para_libros/la_piedra_sopa.html`
- `para_libros/mobuto.html`
- `para_libros/traje_nuevo_del_emperador.html`
- `problemas3/index.html`
- `pruebas/prueba2.html`
- `racionales/index.html`
- `recursos/index.html`
- `repaso/30tapitas.html`
- `repaso/index.html`
- `repertorio-sumas/index.html`
- `sumares/index.html`

</details>

### FICHA-03: La consigna dice "Presionar ▸ Abrir", pero el botón está oculto

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 4 archivos
- Recomendación: Corregir el texto o mostrar el botón.

Comprobar:

```bash
for f in $(grep -rln 'Presionar.*Abrir' --include=*.html .); do grep -qE 'btn-toggle-card *\{ *display: *none' "$f" && echo "$f"; done
```

<details><summary>Resultado (4)</summary>

- `2c_lengua_2/gato_textos.html`
- `multdiv/con_imagenes.html`
- `pruebas/prueba2.html`
- `repaso/30tapitas.html`

</details>

### LENG-01: El índice de `2c_lengua_2` manda a ciudadseva.com

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: comando
- Resultado esperado: 28 enlaces
- Recomendación: Enlazar a las versiones internas cuando existan.
- Nota: Es decisión editorial: puede haber razones para usar la fuente externa.

Comprobar:

```bash
grep -o 'ciudadseva[^"]*' 2c_lengua_2/index.html
```

Resultado:

- `ciudadseva.com/texto/el-gato-negro/`
- `ciudadseva.com/texto/el-corazon-delator/`
- `ciudadseva.com/texto/el-barril-de-amontillado/`
- `ciudadseva.com/texto/el-loro-pelado/`
- `ciudadseva.com/texto/la-guerra-de-los-yacares/`
- `ciudadseva.com/texto/las-medias-de-los-flamencos/`

### LENG-02: Iframes de YouTube con ancho fijo de 560 px

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 3 archivos
- Recomendación: Usar un contenedor 16:9 fluido.
- Nota: `nuevo1.html` parece un borrador. El desborde en celular no se midió en cada una.

Comprobar:

```bash
grep -lE 'width="560"' 2c_lengua/*.html
```

Resultado:

- `2c_lengua/corazon_delator.html`
- `2c_lengua/nuevo1.html`
- `2c_lengua/uli.html`

### DIS-01: Diseño curricular no tiene ninguna regla de foco

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: comando
- Resultado esperado: 14 archivos
- Recomendación: Agregar `:focus-visible` y quitar `outline:none`.
- Nota: Los acordeones son `<button>`, así que funcionan con teclado, pero el foco no se ve.

Comprobar:

```bash
grep -L 'focus' diseno/*.html
```

<details><summary>Resultado (14)</summary>

- `diseno/1lengua.html`
- `diseno/1matematica.html`
- `diseno/2lengua.html`
- `diseno/2matematica.html`
- `diseno/3lengua.html`
- `diseno/3matematica.html`
- `diseno/4lengua.html`
- `diseno/4matematica.html`
- `diseno/5lengua.html`
- `diseno/5matematica.html`
- `diseno/6lengua.html`
- `diseno/6matematica.html`
- `diseno/7lengua.html`
- `diseno/7matematica.html`

</details>

### DIS-02: Las celdas seleccionables de diseño curricular son `div` con `onclick`

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: comando
- Resultado esperado: 14 archivos
- Recomendación: Usar casillas reales.

Comprobar:

```bash
grep -l 'class="content-cell" onclick' diseno/*.html
```

<details><summary>Resultado (14)</summary>

- `diseno/1lengua.html`
- `diseno/1matematica.html`
- `diseno/2lengua.html`
- `diseno/2matematica.html`
- `diseno/3lengua.html`
- `diseno/3matematica.html`
- `diseno/4lengua.html`
- `diseno/4matematica.html`
- `diseno/5lengua.html`
- `diseno/5matematica.html`
- `diseno/6lengua.html`
- `diseno/6matematica.html`
- `diseno/7lengua.html`
- `diseno/7matematica.html`

</details>

### DIS-03: En diseño curricular el color va por ciclo y no por área

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: comando
- Resultado esperado: 14 líneas: 1° a 3° naranja, 4° a 7° verde
- Recomendación: Colorear por área, como la home.
- Nota: Puede ser intencional.

Comprobar:

```bash
grep -H -- '--primary-color:' diseno/*.html | sed 's/ *--primary-color: */ /'
```

<details><summary>Resultado (14)</summary>

- `diseno/1lengua.html: #e67e22;`
- `diseno/1matematica.html: #e67e22;`
- `diseno/2lengua.html: #e67e22;`
- `diseno/2matematica.html: #e67e22;`
- `diseno/3lengua.html: #e67e22;`
- `diseno/3matematica.html: #e67e22;`
- `diseno/4lengua.html: #27ae60;`
- `diseno/4matematica.html: #27ae60;`
- `diseno/5lengua.html: #27ae60;`
- `diseno/5matematica.html: #27ae60;`
- `diseno/6lengua.html: #27ae60;`
- `diseno/6matematica.html: #27ae60;`
- `diseno/7lengua.html: #27ae60;`
- `diseno/7matematica.html: #27ae60;`

</details>

### JUEGO-01: Repertorios oculta los controles táctiles desde 601 px

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: en vivo
- Resultado esperado: Línea 90-91
- Recomendación: Decidirlo con `(pointer:coarse)`.
- Nota: Probado a 768 px: `#controles-touch` queda en `display:none`. El único otro control es el teclado (línea 448).

Comprobar:

```bash
grep -n -A1 'min-width: 601px' juego-repertorios/index.html
```

Resultado:

- `90:        @media (min-width: 601px) {`
- `91-            #controles-touch { display: none !important; }`

### JUEGO-02: Concartas solo funciona arrastrando

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: lectura
- Resultado esperado: 5 listeners de arrastre y ninguno de clic en las cartas
- Recomendación: Permitir tocar para elegir.
- Nota: Usa `mobile-drag-drop` para touch. No se probó en un dispositivo real.

Comprobar:

```bash
grep -n "addEventListener('drag\|addEventListener('drop" concartas/index.html
```

Resultado:

- `260:      carta.addEventListener('dragstart', (e) => {`
- `266:  segundoNumero.addEventListener('dragenter', (e) => {`
- `272:  segundoNumero.addEventListener('dragover', (e) => {`
- `278:  segundoNumero.addEventListener('dragleave', () => {`
- `283:  segundoNumero.addEventListener('drop', (e) => {`

### JUEGO-03: "Reiniciar" del rosco no confirma

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: La función existe y hay 0 `confirm(`
- Recomendación: Pedir confirmación.

Comprobar:

```bash
grep -n 'function reiniciarTema' rosco/index.html; grep -c 'confirm(' rosco/index.html
```

Resultado:

- `1721:    function reiniciarTema() {`
- `0`

### NAV-01: El sitemap anuncia `/buscar.html`, que no existe

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: Línea 31 y archivo inexistente
- Recomendación: Quitarla del sitemap.
- Nota: Ninguno de los dos sitios tiene buscador ni filtro por grado.

Comprobar:

```bash
grep -n 'buscar.html' sitemap.xml; ls buscar.html 2>&1
```

Resultado:

- `31:       <loc>https://escolar.com.ar/buscar.html</loc>`
- `ls: cannot access 'buscar.html': No such file or directory`

### NAV-02: `volver.js` descarga la página anterior para leer su título

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: Línea 112
- Recomendación: Declarar el destino por página.

Comprobar:

```bash
grep -n 'fetch(' volver.js
```

Resultado:

- `112:      fetch(ref.href, { credentials: 'same-origin' })`

### PESO-01: Páginas HTML de más de 1 MB

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 3 archivos
- Recomendación: Pasar las imágenes base64 a archivos.

Comprobar:

```bash
find . -name '*.html' -not -path './.git/*' -size +1M
```

Resultado:

- `1ciclo/images000/numeracion2.html`
- `1c_lengua/silabas.html`
- `repaso/index.html`

### PESO-02: `logo1.png` pesa 520 KB

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 520162 bytes
- Recomendación: Exportarlo a unos 200 px.

Comprobar:

```bash
ls -l logo1.png | awk '{print $5, $NF}'
```

Resultado:

- `520162 logo1.png`

### COLOR-01: Fondos #27AE60 (contraste 2,87:1 con blanco)

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: lectura
- Resultado esperado: 37 archivos con el valor directo
- Recomendación: Usar #1B7A43 (5,4:1).
- Nota: Solo encuentra el color escrito directo; las páginas que lo usan por variable CSS no aparecen. No todo fondo lleva texto blanco.

Comprobar:

```bash
grep -rliE 'background(-color)?: *#27ae60' --include=*.html .
```

<details><summary>Resultado (37)</summary>

- `00.html`
- `2c_lengua/index.html`
- `2c_lengua/index1.html`
- `autoeva/index.html`
- `cartas_espanolas/index.html`
- `concartas/index.html`
- `dados/index.html`
- `herramientas/comprension.html`
- `juego-repertorios/index.html`
- `juego-repertorios/index1.html`
- `letras/index.html`
- `parapro.html`
- `para_libros/index.html`
- `para_libros/index1.html`
- `recursos/antpos.html`
- `sumas_cartas/index.html`
- `sumas_cartas/modo-juego.html`
- `sumas_cartas/modo-juego2.html`
- `zona_problemas/mixtos_zona_1_a.html`
- `zona_problemas/mixtos_zona_1_b.html`
- `zona_problemas/mixtos_zona_2_a.html`
- `zona_problemas/zona_ca1_a.html`
- `zona_problemas/zona_ca1_b.html`
- `zona_problemas/zona_ca2_a.html`
- `zona_problemas/zona_ca2_b.html`
- `zona_problemas/zona_ca3_a.html`
- `zona_problemas/zona_ca3_b.html`
- `zona_problemas/zona_ca4_a.html`
- `zona_problemas/zona_ca4_b.html`
- `zona_problemas/zona_ca4_c.html`
- `zona_problemas/zona_cm1_a.html`
- `zona_problemas/zona_cm1_b.html`
- `zona_problemas/zona_cm2_a.html`
- `zona_problemas/zona_cm2_b.html`
- `zona_problemas/zona_cm3_a.html`
- `zona_problemas/zona_cm3_b.html`
- `zona_problemas/zona_cm4_a.html`

</details>

### COLOR-02: Fondos #E67E22 (contraste 2,85:1 con blanco)

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: lectura
- Resultado esperado: 10 archivos con el valor directo
- Recomendación: Usar #B35400 (5,0:1).
- Nota: Misma limitación. Además, en Zona problemas el color se asigna por JavaScript.

Comprobar:

```bash
grep -rliE 'background(-color)?: *#e67e22' --include=*.html .
```

<details><summary>Resultado (10)</summary>

- `00.html`
- `dados/index.html`
- `herramientas/numeracion.html`
- `herramientas/operaciones.html`
- `recursos/antpos.html`
- `sumas_cartas/index.html`
- `sumas_cartas/modo-juego.html`
- `sumas_cartas/modo-juego2.html`
- `zona_problemas/index.html`
- `zona_problemas/index1.html`

</details>

### COLOR-03: Fondos #FF7043 (contraste 2,74:1 con blanco)

- Repo: `escolar1302.github.io`
- Severidad: Alta
- Certeza: lectura
- Resultado esperado: 4 archivos con el valor directo
- Recomendación: Usar #C2410C (5,2:1).
- Nota: Misma limitación. Unas 60 páginas lo usan por variable CSS en el botón flotante de imprimir (`--accent-color`).

Comprobar:

```bash
grep -rliE 'background(-color)?: *#ff7043' --include=*.html .
```

<details><summary>Resultado (4)</summary>

- `autoeva/efc_cap01.html`
- `autoeva/efc_cap02.html`
- `autoeva/el-collar1.html`
- `index.html`

</details>

### TOOL-01: Numeración y operaciones no guardan el estado

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 2 archivos
- Recomendación: Guardar el formulario en `localStorage`.

Comprobar:

```bash
grep -L 'localStorage' herramientas/numeracion.html herramientas/operaciones.html
```

Resultado:

- `herramientas/numeracion.html`
- `herramientas/operaciones.html`

### ACT-01: PDF de más de 5 MB sin aviso de peso

- Repo: `actividades`
- Severidad: Alta
- Certeza: comando
- Resultado esperado: 3 archivos
- Recomendación: Comprimirlos y mostrar el peso.

Comprobar:

```bash
find . -name '*.pdf' -not -path './.git/*' -size +5M -exec ls -l {} + | awk '{print $5, $NF}'
```

Resultado:

- `10858866 ./lengua/alfabetizacion/iniciales_mpls.pdf`
- `10607797 ./lengua/alfabetizacion/inicio_vocales.pdf`
- `5876961 ./lengua/alfabetizacion/memotest.pdf`

### ACT-02: Los enlaces de los paneles cerrados reciben foco

- Repo: `actividades`
- Severidad: Alta
- Certeza: en vivo
- Resultado esperado: `max-height: 0` y 0 usos de `inert` o `hidden`
- Recomendación: Usar `hidden` o `inert` al cerrar.
- Nota: Probado: un enlace dentro de un panel cerrado recibió foco.

Comprobar:

```bash
grep -n 'max-height: 0' index.html; grep -cE 'inert|\.hidden|setAttribute\(.hidden' index.html
```

Resultado:

- `117:            max-height: 0;`
- `0`

### ACT-03: `actividades` no tiene `h1` ni `<main>`

- Repo: `actividades`
- Severidad: Media
- Certeza: comando
- Resultado esperado: 0 y 0
- Recomendación: Agregarlos.

Comprobar:

```bash
grep -c '<h1' index.html; grep -c '<main' index.html
```

Resultado:

- `0`
- `0`

### HUER-01: páginas sin enlaces entrantes

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: lectura
- Recomendación: revisar una por una y decidir si se borran, se enlazan o se marcan `noindex`.
- Nota: el análisis solo mira enlaces `<a href>`. Una página puede abrirse desde JavaScript, un marcador o un enlace externo. No borrar nada solo por estar en esta lista. `lengua.html`, `diseno.html` y `recursos.html` son redirecciones, y `pie.html` es un fragmento que se inyecta.

Comprobar una página:

```bash
grep -rl 'NOMBRE_DEL_ARCHIVO' --include=*.html --include=*.js --include=*.json .
```

<details><summary>Páginas (65)</summary>

- `00.html`
- `consignas_lengua.html`
- `diseno.html`
- `lengua.html`
- `parapro.html`
- `pie.html`
- `recursos.html`
- `secuencias.html`
- `1ciclo/images000/numeracion2.html`
- `1ciclo/numeracion2/Numeraci_n_y_operaciones.html`
- `2c_lengua/index1.html`
- `2c_lengua/lbyl1b.html`
- `2c_lengua/lgdly1.html`
- `2c_lengua/nuevo1.html`
- `2c_lengua/images3/el_fantasma_de_canterville.html`
- `2c_lengua_2/fantasma_de_canterville_capitulo_i.html`
- `2c_lengua_2/inde1x.html`
- `aditivo/index.html`
- `armador/index.html`
- `autoeva/algo_muy_grave.html`
- `autoeva/auto_un_dia_de_estos.html`
- `autoeva/caza_mayor2.html`
- `autoeva/efc_cap01.html`
- `autoeva/efc_cap02.html`
- `autoeva/el-collar1.html`
- `autoeva/el_hombre_sin_cabeza0.html`
- `autoeva/el_hombre_sin_cabeza1.html`
- `autoeva/teseo_y_el_minotauro1.html`
- `concartas/correcto.html`
- `concartas/index.html`
- `contenidos-concampos/index1.html`
- `herramientas/acentuacion.html`
- `herramientas/acentuacion1.html`
- `herramientas/index0.html`
- `juego-repertorios/index1.html`
- `juegos/index.html`
- `numeracion/index.html`
- `numeracion/index1.html`
- `numeracion/index2.html`
- `numeros/2index.html`
- `operaciones/index.html`
- `operaciones/index1.html`
- `palabra1/index.html`
- `paraprompt/lengua_cohesion_coherencia_ortografia.html`
- `para_libros/index1.html`
- `para_libros/traje_emperador/el_traje_nuevo_del_emperador .html`
- `problemas/index.html`
- `prob_4/index.html`
- `prob_4/problemas_base.html`
- `prob_4/problemas_base0.html`
- `prob_4/problemas_base1.html`
- `pruebas/prueba.html`
- `pruebas/prueba2.html`
- `rosco/index1.html`
- `secuencias/index_a.html`
- `secuencias/index_b.html`
- `secuencias/index_c.html`
- `secuencias/index_d.html`
- `secuencias/instrucciones.html`
- `secuencias/prompt.html`
- `secuencias/anteriores/instrucciones.html`
- `sumas_cartas/modo-juego2.html`
- `trayectorias/index.html`
- `trayectorias/index0.html`
- `zona_problemas/index1.html`

</details>

### ALT-01: imágenes sin atributo `alt`

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: comando (análisis del HTML estático; no incluye imágenes generadas por JavaScript)
- Recomendación: describir las imágenes con contenido y usar `alt=""` en las decorativas.

<details><summary>Páginas (29)</summary>

- `1ciclo/numeracion2.html (9 de 20)`
- `1ciclo/images000/numeracion2.html (9 de 20)`
- `1ciclo/numeracion2/Numeraci_n_y_operaciones.html (9 de 20)`
- `1c_lengua/bingo.html (90 de 92)`
- `1c_lengua/pares_palabras.html (20 de 21)`
- `2c_lengua/canterville.html (1 de 3)`
- `2c_lengua/ciencia_ficcion.html (1 de 2)`
- `2c_lengua/collar.html (1 de 2)`
- `2c_lengua/desvan.html (1 de 2)`
- `2c_lengua/egcb.html (1 de 2)`
- `2c_lengua/etnde.html (1 de 2)`
- `2c_lengua/gato_negro.html (1 de 2)`
- `2c_lengua/joyas.html (1 de 2)`
- `2c_lengua/poe.html (1 de 2)`
- `2c_lengua/uli.html (4 de 5)`
- `2c_lengua/images3/el_fantasma_de_canterville.html (1 de 2)`
- `2c_lengua_2/gato_textos.html (8 de 9)`
- `analisis/index.html (1 de 5)`
- `concartas/index.html (9 de 10)`
- `juego-repertorios/index.html (5 de 5)`
- `juego-repertorios/index1.html (5 de 5)`
- `multdiv/con_imagenes.html (8 de 10)`
- `para_libros/traje_nuevo_del_emperador.html (1 de 1)`
- `recursos/index.html (20 de 29)`
- `repaso/30tapitas.html (13 de 15)`
- `repaso/index.html (35 de 36)`
- `trayectorias/index.html (16 de 16)`
- `zona_problemas/index1.html (2 de 4)`
- `zona_problemas/mixtos_zona_1_c.html (6 de 6)`

</details>

### MOVIL-01: desborde horizontal a 375 px

- Repo: `escolar1302.github.io`
- Severidad: Media
- Certeza: en vivo
- Resultado: `herramientas/` mide 424 px de ancho y `secuencias/` 643 px.
- Recomendación: en `secuencias/`, revisar los botones `.gchip`, que se salen de la pantalla. En `herramientas/` no se identificó el elemento que causa el desborde.

Comprobar con el navegador a 375 px, en la consola:

```js
[innerWidth, document.documentElement.scrollWidth]
```
