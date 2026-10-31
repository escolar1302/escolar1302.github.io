document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const container = document.getElementById('problemsGrid');
    const filterNivel = document.getElementById('filterNivel');
    const filterCampo = document.getElementById('filterCampo');
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    const btnCopiar = document.getElementById('btnCopiar');
    const lblMostrados = document.getElementById('countMostrados');
    const lblSeleccionados = document.getElementById('countSeleccionados');

    // Estado de la aplicación
    let selectedIds = new Set(); // Guarda los IDs de los problemas tildados

    // 1. Función Inicial: Renderizar todos los problemas
    renderProblems(bancoDeProblemas);

    // 2. Eventos de Filtrado
    filterNivel.addEventListener('change', aplicarFiltros);
    filterCampo.addEventListener('change', aplicarFiltros);
    
    btnLimpiar.addEventListener('click', () => {
        filterNivel.value = "todos";
        filterCampo.value = "todos";
        aplicarFiltros();
    });

    // 3. Función para aplicar filtros
    function aplicarFiltros() {
        const nivel = filterNivel.value;
        const campo = filterCampo.value;

        const filtrados = bancoDeProblemas.filter(p => {
            const matchNivel = (nivel === "todos") || (p.nivel === nivel);
            const matchCampo = (campo === "todos") || (p.campo === campo);
            return matchNivel && matchCampo;
        });

        renderProblems(filtrados);
    }

    // 4. Función de Renderizado (Dibujar las tarjetas)
    function renderProblems(lista) {
        container.innerHTML = ""; // Limpiar grid
        lblMostrados.textContent = lista.length;

        if (lista.length === 0) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #888;'>No se encontraron problemas con esos filtros.</p>";
            return;
        }

        lista.forEach(prob => {
            const card = document.createElement('div');
            card.className = `problem-card ${selectedIds.has(prob.id) ? 'selected' : ''}`;
            card.onclick = (e) => toggleSelection(prob.id, card, e);

            const isChecked = selectedIds.has(prob.id) ? 'checked' : '';

            card.innerHTML = `
                <div class="checkbox-wrapper">
                    <input type="checkbox" ${isChecked} readonly>
                </div>
                <div class="card-content">
                    <p class="problem-text">${prob.enunciado}</p>
                    <div class="tags">
                        <span class="tag tag-nivel">${prob.nivel}</span>
                        <span class="tag">${prob.campo}</span>
                        <span class="tag">${prob.cifras}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // 5. Manejo de Selección
    function toggleSelection(id, cardElement, event) {
        // Evitar doble evento si se hace clic directo en el checkbox
        if (event.target.type !== 'checkbox') {
            const checkbox = cardElement.querySelector('input');
            checkbox.checked = !checkbox.checked;
        }

        if (selectedIds.has(id)) {
            selectedIds.delete(id);
            cardElement.classList.remove('selected');
        } else {
            selectedIds.add(id);
            cardElement.classList.add('selected');
        }

        updateUISelection();
    }

    function updateUISelection() {
        const count = selectedIds.size;
        lblSeleccionados.textContent = count;
        btnCopiar.disabled = count === 0;
        btnCopiar.innerHTML = count > 0 
            ? `<span class="icon">📋</span> Copiar (${count}) Problemas`
            : `<span class="icon">📋</span> Copiar Seleccionados`;
    }

    // 6. Lógica de Copiado al Portapapeles
    btnCopiar.addEventListener('click', () => {
        if (selectedIds.size === 0) return;

        // Buscar los objetos completos basados en los IDs seleccionados
        const problemasParaCopiar = bancoDeProblemas.filter(p => selectedIds.has(p.id));

        // Formatear texto
        let textoFinal = "ACTIVIDAD DE MATEMÁTICA\n=======================\n\n";
        
        problemasParaCopiar.forEach((p, index) => {
            textoFinal += `${index + 1}. ${p.enunciado}\n\n`;
        });

        // Copiar
        navigator.clipboard.writeText(textoFinal).then(() => {
            const originalText = btnCopiar.innerHTML;
            btnCopiar.innerHTML = "✅ ¡Copiado!";
            setTimeout(() => {
                btnCopiar.innerHTML = originalText;
            }, 2000);
        });
    });
});