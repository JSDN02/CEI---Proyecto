/* ==========================================================================
    ejercicios-list.js
    Descripción:
    - Carga los ejercicios desde data/ejercicios.json
    - Renderiza cards dinámicas en exerciseGrid
    - Redirige al detalle de cada ejercicio
   ========================================================================== */

const JSON_URL = '../data/ejercicios.json'
const grid = document.getElementById('exerciseGrid')

if (grid) {
    grid.addEventListener('click', (e) => {
        const botonDetalle = e.target.closest('.ver-ejercicio')
        if (!botonDetalle) return

        const idEjercicio = botonDetalle.dataset.ejercicioId
        verDetalle(idEjercicio)
    })
} else {
    console.warn('No se encontró el contenedor #exerciseGrid')
}

async function cargarEjercicios() {
    try {
        const response = await fetch(JSON_URL)
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

        const data = await response.json()
        renderizarEjercicios(data.ejercicios)

        if (window.filtroEjercicios) {
            window.filtroEjercicios.actualizarCards()
            window.filtroEjercicios.aplicarFiltros()
        }
    } catch (error) {
        console.error('Error al cargar los ejercicios:', error)
    }
}

function resolveEjercicioAssetPath(path) {
    if (!path) return ''
    if (path.startsWith('http') || path.startsWith('/')) return path
    return `../${path.replace(/^(\.\.\/)+/, '')}`
}

function renderizarEjercicios(ejercicios) {
    const contenedor = document.getElementById('exerciseGrid')
    if (!contenedor) return

    ejercicios.forEach(ejercicio => {
        const card = document.createElement('div')
        card.classList.add('card-item')
        card.setAttribute('data-name', ejercicio.nombre.toLowerCase())
        card.setAttribute('data-group', ejercicio.grupo_muscular.split(',')[0].toLowerCase().trim())
        card.setAttribute('data-difficulty', ejercicio.nivel.toLowerCase() === 'principiante' ? 'beg' : ejercicio.nivel.toLowerCase() === 'intermedio' ? 'int' : 'adv')

        const modalidades = Array.isArray(ejercicio.modalidades) ? ejercicio.modalidades : ['home']
        card.setAttribute('data-modalities', modalidades.join(','))

        const etiquetaModalidades = modalidades.map(mod =>
            `<span class="tag ${mod === 'gym' ? 'gym' : 'calisthenics'}">${mod === 'gym' ? 'Gimnasio' : 'Calistenia'}</span>`
        ).join('')

        const gruposMusculares = ejercicio.grupo_muscular.split(',').map(grupo => grupo.toLowerCase().trim())
        const statsHTML = gruposMusculares.map(grupo => `
            <div class="stat-item">
                <div class="stat-header">${grupo}</div>
                <div class="progress-bar">
                    <div class="progress" style="--progress-width: 100%"></div>
                </div>
            </div>
        `).join('')

        card.innerHTML = `
            <article class="card">
                <header class="card-header">
                    <div class="card-banner-content">
                        <div class="badge">${ejercicio.nivel}</div>
                        <h3>${ejercicio.nombre}</h3>
                    </div>
                </header>

                <section class="card-content">
                    <div class="tags">
                        ${etiquetaModalidades}
                    </div>
                    <div class="stats-grid">
                        ${statsHTML}
                    </div>
                </section>

                <footer class="card-action">
                    <button class="btn btn-gradient btn-card ver-ejercicio" data-ejercicio-id="${ejercicio.slug}">
                        VER EJERCICIO <i class="ri-arrow-right-fill"></i>
                    </button>
                </footer>
            </article>
        `

        const header = card.querySelector('.card-header')
        if (ejercicio.imagenes && ejercicio.imagenes.length > 0 && header) {
            const primeraImagen = ejercicio.imagenes[0]
            const imagenUrl = typeof primeraImagen === 'string'
                ? primeraImagen
                : primeraImagen.webp || primeraImagen.jpg || ''

            const resolvedImageUrl = resolveEjercicioAssetPath(imagenUrl)
            if (resolvedImageUrl) {
                header.style.backgroundImage = `linear-gradient(to top, #000000, transparent), url('${resolvedImageUrl}')`
            }
        }

        contenedor.appendChild(card)
    })

    document.dispatchEvent(new Event('ejerciciosRenderizados'))
}

document.addEventListener('DOMContentLoaded', cargarEjercicios)

function verDetalle(id) {
    window.location.href = `ejercicios/detalle-ejercicio.html?id=${id}`
}

