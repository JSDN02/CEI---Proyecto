/**
 * Filtrador de Rutinas
 * Maneja la lógica de filtrado de rutinas basada en criterios de búsqueda
 */

class FiltroRutinas {
    constructor() {
        // Elementos del DOM
        this.nameInput = document.getElementById('filterName');
        this.enfoque = document.querySelectorAll('input[name="enfoque"]');
        this.difficulty = document.getElementById('filterDifficulty');
        this.modalidad = document.querySelectorAll('input[name="modalidad"]');
        this.applyBtn = document.querySelector('.btn-filter');
        this.resetBtn = document.querySelector('.btn-reset');

        // Contenedor de las cards
        this.gridContainer = document.getElementById('routineGrid');

        // Array de todas las rutinas (se llena cuando se renderiza)
        this.rutinas = [];

        // State actual de filtros
        this.filtrosActivos = {
            nombre: '',
            enfoque: [],
            dificultad: 'all',
            modalidad: []
        };

        this.inicializar();
    }

    inicializar() {
        // Event listeners
        if (this.applyBtn) {
            this.applyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.aplicarFiltros();
            });
        }

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetearFiltros();
            });
        }

        // Permitir Enter en el input de nombre
        if (this.nameInput) {
            this.nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.aplicarFiltros();
                }
            });
        }
    }

    /**
     * Guarda las rutinas para referencia
     * Se llama desde forEachRutina.js
     */
    setRutinas(rutinas) {
        this.rutinas = rutinas;
    }

    /**
     * Obtiene los valores de los filtros actuales
     */
    obtenerFiltros() {
        const filtros = {
            nombre: this.nameInput ? this.nameInput.value.toLowerCase().trim() : '',
            enfoque: Array.from(this.enfoque)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value),
            dificultad: this.difficulty ? this.difficulty.value : 'all',
            modalidad: Array.from(this.modalidad)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value)
        };

        return filtros;
    }

    /**
     * Aplica los filtros y actualiza la visualización de cards
     */
    aplicarFiltros() {
        this.filtrosActivos = this.obtenerFiltros();

        // Obtener todas las cards
        const cards = this.gridContainer.querySelectorAll('.card-item');

        cards.forEach(card => {
            if (this.cumpleFiltros(card)) {
                card.style.display = '';
                card.classList.add('filtro-activo');
            } else {
                card.style.display = 'none';
                card.classList.remove('filtro-activo');
            }
        });

        // Mostrar mensaje si no hay resultados
        this.mostrarMensajeVacio();
    }

    /**
     * Verifica si una card cumple con los filtros actuales
     */
    cumpleFiltros(cardElement) {
        // Obtener el slug de la rutina del botón
        const boton = cardElement.querySelector('.ver-rutina');
        if (!boton) return false;

        const rutinaSlugg = boton.dataset.rutinaId;
        const rutina = this.rutinas.find(r => r.slug === rutinaSlugg);

        if (!rutina) return true; // Si no encuentra la rutina, no la filtra

        // 1. FILTRO POR NOMBRE
        if (this.filtrosActivos.nombre) {
            const nombreCoincide = rutina.card.nombre_display
                .toLowerCase()
                .includes(this.filtrosActivos.nombre) ||
                rutina.titulo
                    .toLowerCase()
                    .includes(this.filtrosActivos.nombre);

            if (!nombreCoincide) return false;
        }

        // 2. FILTRO POR ENFOQUE
        if (this.filtrosActivos.enfoque.length > 0) {
            const tieneEnfoque = this.filtrosActivos.enfoque.some(enfoqueSeleccionado => {
                return rutina.card.enfoque.some(enf =>
                    enf.nombre.toLowerCase() === enfoqueSeleccionado.toLowerCase()
                );
            });

            if (!tieneEnfoque) return false;
        }

        // 3. FILTRO POR DIFICULTAD
        if (this.filtrosActivos.dificultad !== 'all') {
            const dificultadMap = {
                'beg': 'principiante',
                'int': 'intermedio',
                'adv': 'avanzado'
            };

            const dificultadEsperada = dificultadMap[this.filtrosActivos.dificultad];
            const dificultadRutina = rutina.card.dificultad.toLowerCase();

            if (!dificultadRutina.includes(dificultadEsperada)) return false;
        }

        // 4. FILTRO POR MODALIDAD
        if (this.filtrosActivos.modalidad.length > 0) {
            const tieneModalidad = this.filtrosActivos.modalidad.some(modalidadSeleccionada => {
                // Mapear los valores del checkbox a los tags del JSON
                let tagBuscado = modalidadSeleccionada;
                if (modalidadSeleccionada === 'gym') {
                    // Si busca gym, puede ser versatil o gym
                    return rutina.card.modalidad.tag.includes('versatil') ||
                        rutina.card.modalidad.tag.includes('gym') ||
                        rutina.card.modalidad.tag === 'versatil';
                } else if (modalidadSeleccionada === 'home') {
                    // Si busca home, debe ser calistenia o versatil
                    return rutina.card.modalidad.tag.includes('calistenia') ||
                        rutina.card.modalidad.tag.includes('versatil') ||
                        rutina.card.modalidad.tag === 'versatil';
                }
                return false;
            });

            if (!tieneModalidad) return false;
        }

        return true;
    }

    /**
     * Muestra un mensaje cuando no hay resultados
     */
    mostrarMensajeVacio() {
        const tarjetasVisibles = this.gridContainer.querySelectorAll('.card-item[style=""]').length +
            this.gridContainer.querySelectorAll('.card-item:not([style*="display"])').length;

        let mensajeVacio = document.getElementById('mensajeVacio');

        // Contar tarjetas que no están ocultas
        const cardVisuales = Array.from(this.gridContainer.querySelectorAll('.card-item'))
            .filter(card => card.style.display !== 'none').length;

        if (cardVisuales === 0) {
            if (!mensajeVacio) {
                mensajeVacio = document.createElement('div');
                mensajeVacio.id = 'mensajeVacio';
                mensajeVacio.className = 'mensaje-vacio';
                mensajeVacio.innerHTML = `
                    <div class="mensaje-vacio-content">
                        <i class="ri-search-2-line"></i>
                        <h3>No se encontraron rutinas</h3>
                        <p>Intenta ajustar los criterios de búsqueda</p>
                    </div>
                `;
                this.gridContainer.appendChild(mensajeVacio);
            }
            mensajeVacio.style.display = 'grid';
        } else {
            if (mensajeVacio) {
                mensajeVacio.style.display = 'none';
            }
        }
    }

    /**
     * Resetea todos los filtros a su estado inicial
     */
    resetearFiltros() {
        // Limpiar inputs
        if (this.nameInput) {
            this.nameInput.value = '';
        }

        // Desmarcar checkboxes de enfoque
        this.enfoque.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Resetear select de dificultad
        if (this.difficulty) {
            this.difficulty.value = 'all';
        }

        // Desmarcar checkboxes de modalidad
        this.modalidad.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Mostrar todas las cards
        this.filtrosActivos = {
            nombre: '',
            enfoque: [],
            dificultad: 'all',
            modalidad: []
        };

        const cards = this.gridContainer.querySelectorAll('.card-item');
        cards.forEach(card => {
            card.style.display = '';
            card.classList.remove('filtro-activo');
        });

        // Ocultar mensaje de vacío
        const mensajeVacio = document.getElementById('mensajeVacio');
        if (mensajeVacio) {
            mensajeVacio.style.display = 'none';
        }
    }
}

// Inicializar el filtro cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.filtroRutinas = new FiltroRutinas();
});
