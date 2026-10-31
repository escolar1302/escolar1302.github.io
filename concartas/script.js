document.addEventListener('DOMContentLoaded', () => {
  const primerNumero = document.getElementById('primerNumero');
  const segundoNumero = document.getElementById('segundoNumero');
  const mensaje = document.getElementById('mensaje');
  const enviar = document.getElementById('enviar');

  // 1. Generar un número aleatorio del 1 al 9
  const numeroAleatorio = Math.floor(Math.random() * 9) + 1;
  primerNumero.src = `https://elventanauta.com/jorge/cartas/0${numeroAleatorio}.jpg`;

  // 2. Funciones estándar de arrastrar y soltar (Drag & Drop)
  // Nota: La librería 'mobile-drag-drop' en el HTML hace que esto funcione en celular automáticamente.

  window.drag = (event) => {
    // Guardamos el ID de la carta que estamos moviendo
    event.dataTransfer.setData('text', event.target.id);
    event.dataTransfer.effectAllowed = 'copy'; // Importante para móviles
  };

  window.allowDrop = (event) => {
    event.preventDefault(); // Necesario para permitir soltar
  };

  let cartaSeleccionada = null;

  window.drop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    
    // Solo permitimos soltar si viene un dato válido
    if (!data) return;

    const cartaOriginal = document.getElementById(data);
    
    // Limpiamos si ya había una carta puesta
    segundoNumero.innerHTML = ''; 

    // Creamos una copia de la carta para ponerla en el recuadro
    const clon = cartaOriginal.cloneNode(true);
    clon.style.width = '100%'; // Que ocupe todo el recuadro
    clon.draggable = false;    // Ya no se puede mover una vez puesta
    
    segundoNumero.appendChild(clon);
    
    // Guardamos el valor numérico para comprobar después
    // El ID es "carta5", así que sacamos el "5"
    cartaSeleccionada = parseInt(data.replace('carta', ''), 10);
    
    // Ocultar mensaje de error si lo hubiera
    mensaje.classList.add('hidden');
  };

  // 3. Lógica del botón comprobar
  enviar.addEventListener('click', () => {
    if (cartaSeleccionada === null) {
      mensaje.textContent = "Arrastra una carta al recuadro vacío.";
      mensaje.classList.remove('hidden');
    } else {
      const resultado = numeroAleatorio + cartaSeleccionada;

      if (resultado === 10) {
        // Redirigir a correcto.html
        window.location.href = "correcto.html";
      } else {
        mensaje.textContent = "¡Inténtalo de nuevo! Esa suma no da 10.";
        mensaje.classList.remove('hidden');
        
        // Efecto visual de error
        segundoNumero.style.borderColor = "#e74c3c";
        setTimeout(() => {
            segundoNumero.style.borderColor = "#888";
        }, 1000);
      }
    }
  });
});