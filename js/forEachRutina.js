// Configuración
const JSON_URL = 'js/rutinas.json';
const grid = document.getElementById('routineGrid');
grid.addEventListener('click', (e) => {
    // Buscamos si el clic fue en el botón o algo dentro de él
    const boton = e.target.closest('.ver-rutina');

    if (boton) {
        // Extraemos la "marca" que dejamos antes
        const idRutina = boton.dataset.rutinaId;
        // CAMBIO: El nombre debe coincidir con la función definida abajo
        verDetalle(idRutina);
    }
});

async function cargarRutinas() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        renderizarRutinas(data.rutinas);

        // Pasar las rutinas al filtrador si está disponible
        if (window.filtroRutinas) {
            window.filtroRutinas.setRutinas(data.rutinas);
        }

    } catch (error) {
        console.error("Error al cargar el protocolo:", error);
    }
}

function renderizarRutinas(rutinas) {
    const contenedor = document.getElementById('routineGrid');
    if (!contenedor) return;

    rutinas.forEach(rutina => {
        // 1. Creamos el elemento contenedor y le asignamos la clase
        const card = document.createElement('div');
        card.classList.add('card-item'); // Cambiado a 'card-item' para evitar conflicto con el article

        // 2. Definimos la función de tags dentro o fuera del bucle (fuera es mejor para rendimiento)
        function generarTags(modalidad) {
            if (modalidad.tipo === "Versátil") {
                return `<span class="tag gym">Gimnasio</span><span class="tag calisthenics">Calistenia</span>`;
            }
            return `<span class="tag ${modalidad.tag}">${modalidad.tipo}</span>`;
        }

        // 3. Inyectamos el HTML
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
        `;

        // 4. Aplicar la imagen de fondo al header usando el DOM
        const header = card.querySelector('.card-header');
        header.style.backgroundImage = `linear-gradient(to top, #000000, transparent), url('${rutina.card.IMG_background}')`;

        // 5. Añadimos al contenedor
        contenedor.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', cargarRutinas);

function verDetalle(id) {
    // Ajustado para entrar a la carpeta 'rutinas'
    window.location.href = `rutinas/detalle.html?id=${id}`;
}













function verDetalle(id) {
    // Ajustado para entrar a la carpeta 'rutinas'
    window.location.href = `rutinas/detalle.html?id=${id}`;
}