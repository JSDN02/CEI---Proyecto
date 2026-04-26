/* ==========================================================================
    rutinas-list.js
    Descripción:
    - Carga las rutinas desde data/rutinas.json
    - Renderiza las cards dinámicas en la página de rutinas
    - Navega al detalle de rutina al hacer clic
   ========================================================================== */

const JSON_URL = '../data/rutinas.json'
const grid = document.getElementById('routineGrid')

if (grid) {
    grid.addEventListener('click', (e) => {
        const boton = e.target.closest('.ver-rutina')
        if (!boton) return

        const idRutina = boton.dataset.rutinaId
        verDetalle(idRutina)
    })
}

async function cargarRutinas() {
    try {
        const response = await fetch(JSON_URL)
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

        const data = await response.json()
        renderizarRutinas(data.rutinas)

        if (window.filtroRutinas) {
            window.filtroRutinas.setRutinas(data.rutinas)
        }
    } catch (error) {
        console.error('Error al cargar el protocolo:', error)
    }
}

function renderizarRutinas(rutinas) {
    const contenedor = document.getElementById('routineGrid')
    if (!contenedor) return

    rutinas.forEach(rutina => {
        const card = document.createElement('div')
        card.classList.add('card-item')

        function generarTags(modalidad) {
            if (modalidad.tipo === 'Versátil') {
                return `<span class="tag gym">Gimnasio</span><span class="tag calisthenics">Calistenia</span>`
            }
            return `<span class="tag ${modalidad.tag}">${modalidad.tipo}</span>`
        }

        card.innerHTML = `
            <article class="card">
                <header class="card-header">
                    <div class="card-banner-content">
                        <div class="badge">${rutina.card.dificultad}</div>
                        <h3>${rutina.card.nombre_display}</h3>
                    </div>
                </header>

                <section class="card-content">
                    <div class="tags">${generarTags(rutina.card.modalidad)}</div>
                    <div class="stats-grid">
                        ${rutina.card.enfoque.map(stat => `
                            <div class="stat-item">
                                <div class="stat-header">${stat.nombre}</div>
                                <div class="progress-bar">
                                    <div class="progress" style="--progress-width: ${stat.valor}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <footer class="card-action">
                    <button class="btn btn-gradient btn-card ver-rutina" data-rutina-id="${rutina.slug}">
                        VER RUTINA <i class="ri-arrow-right-fill"></i>
                    </button>
                    <a href="${rutina.card.descarga}" class="btn btn-download btn-card" target="_blank" rel="noopener">
                        <i class="ri-download-2-fill"></i> DESCARGAR
                    </a>
                </footer>
            </article>
        `

        const header = card.querySelector('.card-header')
        if (header) {
            header.style.backgroundImage = `linear-gradient(to top, #000000, transparent), url('../${rutina.card.IMG_background}')`
        }

        contenedor.appendChild(card)
    })
}

document.addEventListener('DOMContentLoaded', cargarRutinas)

function verDetalle(id) {
    window.location.href = `rutinas/detalle-rutina.html?id=${id}`
}













