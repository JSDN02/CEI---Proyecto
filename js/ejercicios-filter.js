class FiltroEjercicios {
    constructor() {
        this.nameInput = document.getElementById('name');
        this.groupSelect = document.getElementById('filterMusculo');
        this.difficulty = document.getElementById('difficulty');
        this.modalityInputs = document.querySelectorAll('.aside__filters input[type="checkbox"]');
        this.applyBtn = document.querySelector('.aside__filters .btn-filter');
        this.resetBtn = document.querySelector('.aside__filters .btn-reset');
        this.cards = document.querySelectorAll('.content__grid .card');

        this.inicializar();
    }

    inicializar() {
        if (this.applyBtn) {
            this.applyBtn.addEventListener('click', (event) => {
                event.preventDefault();
                this.aplicarFiltros();
            });
        }

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', (event) => {
                event.preventDefault();
                this.resetearFiltros();
            });
        }

        if (this.nameInput) {
            this.nameInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.aplicarFiltros();
                }
            });
        }
    }

    obtenerFiltros() {
        const modalidades = Array.from(this.modalityInputs)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value.toLowerCase());

        return {
            nombre: this.nameInput ? this.nameInput.value.toLowerCase().trim() : '',
            grupo: this.groupSelect ? this.groupSelect.value.toLowerCase() : 'all',
            dificultad: this.difficulty ? this.difficulty.value.toLowerCase() : 'all',
            modalidades
        };
    }

    aplicarFiltros() {
        const filtros = this.obtenerFiltros();

        this.cards.forEach(card => {
            const visible = this.cumpleFiltros(card, filtros);
            card.style.display = visible ? '' : 'none';
        });

        this.mostrarMensajeVacio();
    }

    cumpleFiltros(card, filtros) {
        const nombreCard = (card.dataset.name || card.querySelector('h3')?.textContent || '').toLowerCase();
        const grupoCard = (card.dataset.group || '').toLowerCase();
        const dificultadCard = (card.dataset.difficulty || '').toLowerCase();
        const modalidadesCard = (card.dataset.modalities || '')
            .toLowerCase()
            .split(',')
            .map(value => value.trim())
            .filter(Boolean);

        if (filtros.nombre && !nombreCard.includes(filtros.nombre)) {
            return false;
        }

        if (filtros.grupo !== 'all' && grupoCard !== filtros.grupo) {
            return false;
        }

        if (filtros.dificultad !== 'all' && dificultadCard !== filtros.dificultad) {
            return false;
        }

        if (filtros.modalidades.length > 0) {
            const coincideModalidad = filtros.modalidades.some(modalidad => modalidadesCard.includes(modalidad));
            if (!coincideModalidad) {
                return false;
            }
        }

        return true;
    }

    mostrarMensajeVacio() {
        const tarjetasVisibles = Array.from(this.cards).filter(card => card.style.display !== 'none');
        let mensajeVacio = document.getElementById('mensajeVacioEjercicios');

        if (tarjetasVisibles.length === 0) {
            if (!mensajeVacio) {
                mensajeVacio = document.createElement('div');
                mensajeVacio.id = 'mensajeVacioEjercicios';
                mensajeVacio.className = 'mensaje-vacio';
                mensajeVacio.innerHTML = `
                    <div class="mensaje-vacio-content">
                        <i class="ri-search-2-line"></i>
                        <h3>No se encontraron ejercicios</h3>
                        <p>Prueba con otros filtros o ajusta los criterios.</p>
                    </div>
                `;
                const grid = document.querySelector('.content__grid');
                if (grid) grid.appendChild(mensajeVacio);
            }
            mensajeVacio.style.display = 'grid';
        } else if (mensajeVacio) {
            mensajeVacio.style.display = 'none';
        }
    }

    resetearFiltros() {
        if (this.nameInput) {
            this.nameInput.value = '';
        }

        if (this.groupSelect) {
            this.groupSelect.value = 'all';
        }

        if (this.difficulty) {
            this.difficulty.value = 'all';
        }

        this.modalityInputs.forEach(checkbox => {
            checkbox.checked = false;
        });

        this.cards.forEach(card => {
            card.style.display = '';
        });

        this.mostrarMensajeVacio();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new FiltroEjercicios();
});
