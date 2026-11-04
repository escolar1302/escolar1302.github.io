# Instrucciones para Claude

Sitio estático de recursos escolares (juegos, actividades y herramientas en HTML), publicado
con GitHub Pages desde la rama `main` (https://escolar1302.github.io/, relacionado con escolar.com.ar).

## Publicación

- Todo lo que llega a `main` se publica en el sitio. Hacer `git push` solo cuando yo lo pida.
- No borrar `.nojekyll`: el sitio se publica sin Jekyll.
- El repositorio es público y, al existir `.nojekyll`, esta carpeta `.claude/` también se publica
  en el sitio. No guardar aquí datos privados.

## Estructura

- `index.html`: página principal.
- Carpetas por tema o juego (`lengua`, `multiplicacion`, `problemas`, `juegos`, `herramientas`, etc.),
  cada una con sus propias páginas HTML.
- Páginas sueltas en la raíz (`lengua.html`, `matematica.html`, `editor.html`, `galeria.html`, etc.).
- `pie.html`: pie compartido de las páginas.

## Cómo trabajo

Trabajo mayormente solo y en más de una computadora. En algunos repositorios colabora otra persona.

## Git

### Al empezar a trabajar

Cada vez que empiezo a trabajar, antes de hacer cualquier otra cosa:

1. Ejecutar `git fetch` y comparar la copia local con el remoto.
2. Avisarme si la copia local está atrasada, adelantada o si divergió del remoto.
3. Avisarme si hay pull requests abiertos.

### Trabajar siempre en lo último

Siempre tenemos que trabajar sobre la última versión. Antes de empezar un cambio, si la copia
local está atrasada, hacer `git pull` y decírmelo. Si no se puede actualizar sin conflictos
(hay trabajo local que choca con el remoto o las ramas divergieron), parar y preguntarme.

### Cuando pregunto por el estado

Decirme qué existe en mi computadora y todavía no está en el remoto, y al revés. Incluir commits
sin subir, commits sin bajar y archivos nuevos o modificados.

### Vocabulario

- "Bajar" significa `git pull`.
- "Subir" significa `git push`.

### Pull requests

- Si hay pull requests abiertos, avisarme.
- Referirse a ellos como "solicitudes de cambio pedidas por <usuario>", usando el autor del pull request.
