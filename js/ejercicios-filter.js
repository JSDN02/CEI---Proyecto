/* ==========================================================================
    ejercicios-filter.js
    Descripción:
    - Filtra la lista de ejercicios por nombre, grupo, nivel y modalidad
    - Refresca las cards cuando se renderiza la lista
    - Muestra mensaje cuando no hay resultados
   ========================================================================== */

class FiltroEjercicios {
    constructor() {
        this.nameInput = document.getElementById('filterName')
        this.groupSelect = document.getElementById('filterMusculo')
        this.difficulty = document.getElementById('difficulty')
        this.modalityInputs = document.querySelectorAll('.aside__filters input[type="checkbox"]')
        this.applyBtn = document.querySelector('.aside__filters .btn-filter')
        this.resetBtn = document.querySelector('.aside__filters .btn-reset')
        this.gridContainer = document.getElementById('exerciseGrid')
        this.cards = []

        window.filtroEjercicios = this
        this.inicializar()
        this.actualizarCards()
    }

    inicializar() {
        if (this.applyBtn) {
            this.applyBtn.addEventListener('click', (event) => {
                event.preventDefault()
                this.aplicarFiltros()
            })
        }

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', (event) => {
                event.preventDefault()
                this.resetearFiltros()
            })
        }

        if (this.nameInput) {
            this.nameInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault()
                    this.aplicarFiltros()
                }
            })
        }

        document.addEventListener('ejerciciosRenderizados', () => {
            this.actualizarCards()
            this.aplicarFiltros()
        })
    }

    obtenerFiltros() {
        return {
            nombre: this.nameInput ? this.nameInput.value.toLowerCase().trim() : '',
            grupo: this.groupSelect ? this.groupSelect.value.toLowerCase() : 'all',
            dificultad: this.difficulty ? this.difficulty.value.toLowerCase() : 'all',
            modalidades: Array.from(this.modalityInputs)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value.toLowerCase())
        }
    }

    aplicarFiltros() {
        this.actualizarCards()
        const filtros = this.obtenerFiltros()

        this.cards.forEach(card => {
            const visible = this.cumpleFiltros(card, filtros)
            card.style.display = visible ? '' : 'none'
            if (visible) {
                card.classList.add('filtro-activo')
            } else {
                card.classList.remove('filtro-activo')
            }
        })

        this.mostrarMensajeVacio()
    }

    cumpleFiltros(card, filtros) {
        const nombreCard = (card.dataset.name || card.querySelector('h3')?.textContent || '').toLowerCase()
        const grupoCard = (card.dataset.group || '').toLowerCase()
        const dificultadCard = (card.dataset.difficulty || '').toLowerCase()
        const modalidadesCard = (card.dataset.modalities || '')
            .toLowerCase()
            .split(',')
            .map(value => value.trim())
            .filter(Boolean)

        if (filtros.nombre && !nombreCard.includes(filtros.nombre)) {
            return false
        }

        if (filtros.grupo !== 'all' && grupoCard !== filtros.grupo) {
            return false
        }

        if (filtros.dificultad !== 'all' && dificultadCard !== filtros.dificultad) {
            return false
        }

        if (filtros.modalidades.length > 0) {
            const coincideModalidad = filtros.modalidades.some(modalidad => modalidadesCard.includes(modalidad))
            if (!coincideModalidad) {
                return false
            }
        }

        return true
    }

    mostrarMensajeVacio() {
        const tarjetasVisibles = Array.from(this.cards).filter(card => card.style.display !== 'none').length
        let mensajeVacio = document.getElementById('mensajeVacioEjercicios')

        if (tarjetasVisibles === 0) {
            if (!mensajeVacio && this.gridContainer) {
                mensajeVacio = document.createElement('div')
                mensajeVacio.id = 'mensajeVacioEjercicios'
                mensajeVacio.className = 'mensaje-vacio'
                mensajeVacio.innerHTML = `
                    <div class="mensaje-vacio-content">
                        <i class="ri-search-2-line"></i>
                        <h3>No se encontraron ejercicios</h3>
                        <p>Prueba con otros filtros o ajusta los criterios.</p>
                    </div>
                `
                this.gridContainer.appendChild(mensajeVacio)
            }
            if (mensajeVacio) mensajeVacio.style.display = 'grid'
        } else if (mensajeVacio) {
            mensajeVacio.style.display = 'none'
        }
    }

    actualizarCards() {
        this.cards = this.gridContainer ? Array.from(this.gridContainer.querySelectorAll('.card-item')) : []
    }

    resetearFiltros() {
        if (this.nameInput) this.nameInput.value = ''
        if (this.groupSelect) this.groupSelect.value = 'all'
        if (this.difficulty) this.difficulty.value = 'all'

        this.modalityInputs.forEach(checkbox => {
            checkbox.checked = false
        })

        this.aplicarFiltros()
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new FiltroEjercicios()
})
