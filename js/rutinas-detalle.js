/* ==========================================================================
    rutinas-detalle.js
    Descripción:
    - Carga el detalle de la rutina seleccionada
    - Renderiza hero, descripción, conceptos y tablas dinámicas
    - Inicializa el acordeón para la vista de detalle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el ID de la URL
    const params = new URLSearchParams(window.location.search)
    const idRutina = params.get('id')

    if (idRutina) {
        cargarDetalle(idRutina)
    } else {
        console.error('No se encontró ID en la URL')
        // Opcional: redirigir a inicio
    }
})

async function cargarDetalle(id) {
    try {
        const response = await fetch('../../data/rutinas.json');
        const data = await response.json();
        
        // Encontrar la rutina que coincide con el ID (slug)
        const rutina = data.rutinas.find(r => r.slug === id);

        if (rutina) {
            renderizarDetalle(rutina);
        } else {
            console.error("Rutina no encontrada con slug:", id);
        }
    } catch (error) {
        console.error("Error al cargar detalle:", error);
    }
}

function renderizarDetalle(rutina) {
    // 1. Renderizado de Header
    const heroText = document.querySelector('.hero__text-detalle');
    if (heroText) {
        heroText.innerHTML = `
            <p class="text-phrase">${rutina.titulo.split(':')[0]}</p>
            <h1 class="h1-standard">${rutina.card.nombre_display}</h1>
            <p><b>Enfoque:</b> ${rutina.ficha_tecnica.enfoque.join(', ')}.</p>
            <p><b>Dificultad:</b> ${rutina.ficha_tecnica.dificultad}.</p>
            <p><b>Modalidad:</b> ${rutina.ficha_tecnica.modalidad}.</p>
            <p><b>Duración estimada:</b> ${rutina.ficha_tecnica.duracion_estimada}.</p>
        `;

        // Aplicar color de la rutina al border
        if (rutina.color) {
            heroText.style.borderColor = rutina.color;
        }
    }

    // Setear background dinámico
    const heroDetalle = document.querySelector('.hero-detalle');
    if (heroDetalle && rutina.card.IMG_background) {
        heroDetalle.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, .8), transparent), url('../../${rutina.card.IMG_background}')`;
    }

    // 2. Renderizado de Descripción y Título
    const trainingContent = document.querySelector('.training__content');
    if (trainingContent) {
        let implementosHTML = '<h3 class="training__list-title">Implementos necesarios:</h3><ul class="training__list">';
        
        if (rutina.ficha_tecnica.implementos.gym) {
            implementosHTML += `<li class="training__item"><b>Versión Gym:</b> ${rutina.ficha_tecnica.implementos.gym.join(', ')}.</li>`;
        }
        if (rutina.ficha_tecnica.implementos.calistenia) {
            implementosHTML += `<li class="training__item"><b>Versión Calistenia:</b> ${rutina.ficha_tecnica.implementos.calistenia.join(', ')}.</li>`;
        }
        implementosHTML += '</ul>';

        trainingContent.innerHTML = `
            <h2 class="training__title">
                ${rutina.titulo}
            </h2>
            <p class="training__description">${rutina.descripcion}</p>

            ${implementosHTML}
        `;
    }

    // 3. Renderizado de Conceptos Clave
    const conceptosContent = document.querySelector('.training__content:nth-child(2)');
    if (conceptosContent) {
        let conceptosHTML = `
            <h2 class="training-__title">Conceptos Fundamentales para el Éxito</h2>
            <p>Para ejecutar esta rutina con precisión académica, debemos dominar los siguientes pilares:</p>
        `;
        rutina.conceptos_clave.forEach(concepto => {
            conceptosHTML += `
                <h3 class="training__term">${concepto.termino}</h3>
                <p class="training__text">${concepto.definicion}</p>
            `;
            if (concepto.rangos) {
                conceptosHTML += `<ul class="training__list">`;
                concepto.rangos.forEach(rango => {
                    conceptosHTML += `<li class="training__item"><b>${rango.tipo} (${rango.segundos}):</b> ${rango.objetivo}.</li>`;
                });
                conceptosHTML += `</ul>`;
            }
        });
        conceptosContent.innerHTML = conceptosHTML;
    }

    // 4. Renderizado de Tablas Dinámico
    const contenedorTablas = document.getElementById('detalle-container-tablas');
    if (contenedorTablas) {
        contenedorTablas.innerHTML = ''; // Limpiamos antes de inyectar

        // Iteramos sobre las categorías del bloque (gym, calistenia)
        Object.keys(rutina.bloques).forEach(categoria => {
            const bloqueCategoria = document.createElement('div');
            bloqueCategoria.className = `detalle__${categoria} detail__routine`;

            // Generamos el título de la categoría
            let htmlBloque = `<h2>Bloque de Entrenamiento: ${categoria.toUpperCase()}</h2>`;

            // Iteramos sobre los días de esa categoría
            rutina.bloques[categoria].forEach(dia => {
                htmlBloque += `
                    <h3>Día ${dia.dia}: ${dia.foco}</h3>
                    <div class="table-container">
                        <table class="rutina-table">
                            <thead class="thead">
                                <tr class="tr">
                                    <th>Ejercicio</th><th>Sets</th><th>Repeticiones</th><th>Descanso</th><th>TUT Seg</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dia.ejercicios.map(ex => `
                                    <tr class="tr">
                                        <td class="td">${ex.nombre}</td>
                                        <td class="td">${ex.series}</td>
                                        <td class="td">${ex.reps}</td>
                                        <td class="td">${ex.descanso}</td>
                                        <td class="td">${ex.tut}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            });

            bloqueCategoria.innerHTML = htmlBloque;
            contenedorTablas.appendChild(bloqueCategoria);
        });
    }

    // Nota final
    const notaFinal = document.getElementById('nota-final');
    if (notaFinal && rutina.notas) {
        notaFinal.innerHTML = `<b>Nota Final:</b> ${rutina.notas}`;
    }

    // Inicializar accordion después de renderizar
    if (typeof initializeAccordion === 'function') {
        window.rutinaColor = rutina.color;
        initializeAccordion();
    }
}