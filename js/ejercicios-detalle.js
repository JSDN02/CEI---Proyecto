/* ==========================================================================
    ejercicios-detalle.js
    Descripción:
    - Carga el detalle del ejercicio seleccionado
    - Renderiza hero, descripción, imágenes y variaciones
    - Inicializa el acordeón cuando corresponde
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el ID de la URL
    const params = new URLSearchParams(window.location.search)
    const idEjercicio = params.get('id')

    if (idEjercicio) {
        cargarDetalle(idEjercicio)
    } else {
        console.error('No se encontró ID en la URL')
        // Opcional: redirigir a inicio
    }
})

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

function renderPicture(imagen, alt) {
    if (!imagen) return ''
    if (typeof imagen === 'string') {
        return `<picture><img src="${imagen}" alt="${alt}" style="width:100%; max-width:640px; margin: 10px 0; border-radius: 12px;" loading="lazy"></picture>`
    }

    const sourceWebp = imagen.webp ? `<source type="image/webp" srcset="${imagen.webp}">` : ''
    const fallbackSrc = imagen.jpg || imagen.webp || ''
    const imgTag = fallbackSrc ? `<img src="${fallbackSrc}" alt="${alt}" style="width:100%; max-width:640px; margin: 10px 0; border-radius: 12px;" loading="lazy">` : ''

    return `<picture>${sourceWebp}${imgTag}</picture>`
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
    const heroBg = (ejercicio.imagenes && ejercicio.imagenes.length > 0)
        ? (ejercicio.imagenes[0].jpg || ejercicio.imagenes[0].webp)
        : (ejercicio.variaciones && ejercicio.variaciones[0] && (ejercicio.variaciones[0].imagen.jpg || ejercicio.variaciones[0].imagen.webp))
    if (heroDetalle && heroBg) {
        heroDetalle.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, .8), transparent), url('${heroBg}')`
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

    // 3. Renderizado de Variaciones
    const contenedorVariaciones = document.getElementById('detalle-container-variaciones');
    if (contenedorVariaciones && ejercicio.variaciones && ejercicio.variaciones.length > 0) {
        contenedorVariaciones.innerHTML = ''; // Limpiamos antes de inyectar

        let htmlVariaciones = '<h2>Variaciones</h2>';

        ejercicio.variaciones.forEach(variacion => {
            htmlVariaciones += `
                <div class="detail__routine">
                    <h3>${variacion.tipo} (${variacion.dificultad})</h3>
                    <div class="table-container">
                        ${variacion.imagen ? renderPicture(variacion.imagen, variacion.tipo) : ''}
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