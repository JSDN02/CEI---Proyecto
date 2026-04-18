// js/ejercicios-detalle.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el ID de la URL
    const params = new URLSearchParams(window.location.search);
    const idEjercicio = params.get('id');

    if (idEjercicio) {
        cargarDetalle(idEjercicio);
    } else {
        console.error("No se encontró ID en la URL");
        // Opcional: redirigir a inicio
    }
});

async function cargarDetalle(id) {
    try {
        const response = await fetch('../../data/ejercicios.json');
        const data = await response.json();

        // Encontrar el ejercicio que coincide con el ID (slug)
        const ejercicio = data.ejercicios.find(e => e.slug === id);

        if (ejercicio) {
            renderizarDetalle(ejercicio);
        } else {
            console.error("Ejercicio no encontrado con slug:", id);
        }
    } catch (error) {
        console.error("Error al cargar detalle:", error);
    }
}

function renderizarDetalle(ejercicio) {
    // 1. Renderizado de Header
    const heroText = document.querySelector('.hero__text-detalle');
    if (heroText) {
        heroText.innerHTML = `
            <p class="text-phrase">${ejercicio.nombre}</p>
            <h1 class="h1-standard">${ejercicio.nombre}</h1>
            <p><b>Grupo muscular:</b> ${ejercicio.grupo_muscular}.</p>
            <p><b>Nivel:</b> ${ejercicio.nivel}.</p>
            <p><b>Implementos:</b> ${ejercicio.implementos.join(', ')}.</p>
        `;
    }

    // Setear background dinámico
    const heroDetalle = document.querySelector('.hero-detalle');
    if (heroDetalle && ejercicio.imagenes && ejercicio.imagenes.length > 0) {
        heroDetalle.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, .8), transparent), url('${ejercicio.imagenes[0]}')`;
    }

    // 2. Renderizado de Descripción
    const trainingContent = document.querySelector('.training__content');
    if (trainingContent) {
        trainingContent.innerHTML = `
            <h2 class="training__title">
                ${ejercicio.nombre}
            </h2>
            <p class="training__description">${ejercicio.descripcion}</p>
        `;
    }

    // 3. Renderizado de Imágenes
    const imagenesContent = document.querySelector('.training__content:nth-child(2)');
    if (imagenesContent && ejercicio.imagenes) {
        let imagenesHTML = '<h2 class="training__title">Imágenes ilustrativas</h2>';
        ejercicio.imagenes.forEach(img => {
            imagenesHTML += `<img src="${img}" alt="${ejercicio.nombre}" style="max-width: 100%; margin: 10px;">`;
        });
        imagenesContent.innerHTML = imagenesHTML;
    }

    // 4. Renderizado de Variaciones
    const contenedorVariaciones = document.getElementById('detalle-container-variaciones');
    if (contenedorVariaciones && ejercicio.variaciones) {
        contenedorVariaciones.innerHTML = ''; // Limpiamos antes de inyectar

        let htmlVariaciones = '<h2>Variaciones</h2>';

        ejercicio.variaciones.forEach(variacion => {
            htmlVariaciones += `
                <div class="detail__routine">
                    <h3>${variacion.tipo} (${variacion.dificultad})</h3>
                    <div class="table-container">
                        <p>${variacion.descripcion}</p>
                    </div>
                </div>
            `;
        });

        contenedorVariaciones.innerHTML = htmlVariaciones;
    }

    // Inicializar accordion después de renderizar
    if (typeof initializeAccordion === 'function') {
        window.rutinaColor = '#ff7a00';
        initializeAccordion();
    }
}