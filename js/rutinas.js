// Configuración
const JSON_URL = 'js/rutinas.json';


async function cargarRutinas() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        renderizarRutinas(data.rutinas);

    } catch (error) {
        console.error("Error al cargar el protocolo:", error);
    }
}

function renderizarRutinas(rutinas) {
    const contenedor = document.getElementById('routineGrid'); 
    if (!contenedor) return;

    // Limpiamos las tarjetas estáticas de prueba antes de cargar las del JSON
    // contenedor.innerHTML = '';

    rutinas.forEach(rutina => {
        const card = document.createElement('div');
        // CORRECCIÓN AQUÍ: Se usa ( ) en lugar de =
        card.classList.add('card'); 
        
        card.innerHTML = `
            <div class="card-banner">
                <div class="badge-pro">${rutina.card.dificultad}</div>
                <h3>${rutina.card.nombre_display}</h3> 
            </div>

            <div class="card-content">
                <div class="tags">
                    <span class="tag ${rutina.card.modalidad.tag}">${rutina.card.modalidad.tipo}</span>
                </div>

                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-header">${rutina.card.enfoque[0].nombre}</div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${rutina.card.enfoque[0].valor}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-header">${rutina.card.enfoque[1].nombre}</div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${rutina.card.enfoque[1].valor}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-header">${rutina.card.enfoque[2].nombre}</div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${rutina.card.enfoque[2].valor}%"></div>
                        </div>
                    </div>
                </div>

                <button class="btn btn-gradient btn-card" onclick="verDetalle('${rutina.card.enlace}')">
                    VER RUTINA <i class="ri-arrow-right-fill"></i>
                </button>
                <a href="${rutina.card.descarga}" class="btn btn-download btn-card" target="_blank">
                    <i class="ri-download-2-fill"></i> DESCARGAR
                </a>
            </div>
        `;
        
        contenedor.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', cargarRutinas);

function verDetalle(id) {
    console.log("Navegando a la rutina:", id);
}