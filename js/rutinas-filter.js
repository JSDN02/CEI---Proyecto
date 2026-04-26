/* ==========================================================================
    rutinas-filter.js
    Descripción:
    - Lógica de filtrado para la lista de rutinas
    - Combina búsqueda por nombre, enfoque, dificultad y modalidad
    - Muestra mensaje cuando no hay resultados
   ========================================================================== */

class FiltroRutinas {
    constructor() {
        this.nameInput = document.getElementById('filterName')
        this.enfoque = document.getElementById('filterEnfoque')
        this.difficulty = document.getElementById('filterDifficulty')
        this.modalidad = document.querySelectorAll('input[name="modalidad"]')
        this.applyBtn = document.querySelector('.btn-filter')
        this.resetBtn = document.querySelector('.btn-reset')
        this.gridContainer = document.getElementById('routineGrid')
        this.rutinas = []
        this.filtrosActivos = {
            nombre: '',
            enfoque: [],
            dificultad: 'all',
            modalidad: []
        }
        this.inicializar()
    }

    inicializar() {
        if (this.applyBtn) {
            this.applyBtn.addEventListener('click', (e) => {
                e.preventDefault()
                this.aplicarFiltros()
            })
        }

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', (e) => {
                e.preventDefault()
                this.resetearFiltros()
            })
        }

        if (this.nameInput) {
            this.nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    this.aplicarFiltros()
                }
            })
        }
    }

    setRutinas(rutinas) {
        this.rutinas = rutinas
    }

    obtenerFiltros() {
        const selectedEnfoque = this.enfoque ? this.enfoque.value : 'all'
        return {
            nombre: this.nameInput ? this.nameInput.value.toLowerCase().trim() : '',
            enfoque: selectedEnfoque !== 'all' ? [selectedEnfoque] : [],
            dificultad: this.difficulty ? this.difficulty.value : 'all',
            modalidad: Array.from(this.modalidad)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value)
        }
    }

    aplicarFiltros() {
        this.filtrosActivos = this.obtenerFiltros()
        const cards = this.gridContainer.querySelectorAll('.card-item')

        cards.forEach(card => {
            if (this.cumpleFiltros(card)) {
                card.style.display = ''
                card.classList.add('filtro-activo')
            } else {
                card.style.display = 'none'
                card.classList.remove('filtro-activo')
            }
        })

        this.mostrarMensajeVacio()
    }

    cumpleFiltros(cardElement) {
        const boton = cardElement.querySelector('.ver-rutina')
        if (!boton) return false

        const rutinaSlugg = boton.dataset.rutinaId
        const rutina = this.rutinas.find(r => r.slug === rutinaSlugg)
        if (!rutina) return true

        if (this.filtrosActivos.nombre) {
            const nombreCoincide = rutina.card.nombre_display
                .toLowerCase()
                .includes(this.filtrosActivos.nombre) ||
                rutina.titulo
                    .toLowerCase()
                    .includes(this.filtrosActivos.nombre)
            if (!nombreCoincide) return false
        }

        if (this.filtrosActivos.enfoque.length > 0) {
            const tieneEnfoque = this.filtrosActivos.enfoque.some(enfoqueSeleccionado =>
                rutina.card.enfoque.some(enf =>
                    enf.nombre.toLowerCase() === enfoqueSeleccionado.toLowerCase()
                )
            )
            if (!tieneEnfoque) return false
        }

        if (this.filtrosActivos.dificultad !== 'all') {
            const dificultadMap = {
                beg: 'principiante',
                int: 'intermedio',
                adv: 'avanzado'
            }
            const dificultadEsperada = dificultadMap[this.filtrosActivos.dificultad]
            const dificultadRutina = rutina.card.dificultad.toLowerCase()
            if (!dificultadRutina.includes(dificultadEsperada)) return false
        }

        if (this.filtrosActivos.modalidad.length > 0) {
            const tieneModalidad = this.filtrosActivos.modalidad.some(modalidadSeleccionada => {
                const modalidadTag = rutina.card.modalidad.tag.toLowerCase()
                if (modalidadSeleccionada === 'gym') {
                    return modalidadTag.includes('versatil') ||
                        modalidadTag.includes('gym') ||
                        modalidadTag === 'versatil'
                }
                if (modalidadSeleccionada === 'home') {
                    return modalidadTag.includes('calistenics') ||
                        modalidadTag.includes('calisthenics') ||
                        modalidadTag.includes('calistenia') ||
                        modalidadTag.includes('versatil') ||
                        modalidadTag === 'versatil'
                }
                return false
            })
            if (!tieneModalidad) return false
        }

        return true
    }

    mostrarMensajeVacio() {
        const cardVisuales = Array.from(this.gridContainer.querySelectorAll('.card-item'))
            .filter(card => card.style.display !== 'none').length

        let mensajeVacio = document.getElementById('mensajeVacio')

        if (cardVisuales === 0) {
            if (!mensajeVacio) {
                mensajeVacio = document.createElement('div')
                mensajeVacio.id = 'mensajeVacio'
                mensajeVacio.className = 'mensaje-vacio'
                mensajeVacio.innerHTML = `
                    <div class="mensaje-vacio-content">
                        <i class="ri-search-2-line"></i>
                        <h3>No se encontraron rutinas</h3>
                        <p>Intenta ajustar los criterios de búsqueda</p>
                    </div>
                `
                this.gridContainer.appendChild(mensajeVacio)
            }
            mensajeVacio.style.display = 'grid'
        } else if (mensajeVacio) {
            mensajeVacio.style.display = 'none'
        }
    }

    resetearFiltros() {
        this.filtrosActivos = {
            nombre: '',
            enfoque: [],
            dificultad: 'all',
            modalidad: []
        }

        if (this.nameInput) this.nameInput.value = ''
        if (this.enfoque) this.enfoque.value = 'all'
        if (this.difficulty) this.difficulty.value = 'all'
        if (this.modalidad) {
            this.modalidad.forEach(checkbox => {
                checkbox.checked = false
            })
        }

        const cards = this.gridContainer.querySelectorAll('.card-item')
        cards.forEach(card => {
            card.style.display = ''
            card.classList.remove('filtro-activo')
        })

        const mensajeVacio = document.getElementById('mensajeVacio')
        if (mensajeVacio) {
            mensajeVacio.style.display = 'none'
        }
    }
}

/* ==========================================================================
    Inicialización
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    window.filtroRutinas = new FiltroRutinas()
})
