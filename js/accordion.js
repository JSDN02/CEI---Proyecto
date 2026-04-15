/**
 * accordion.js
 * Descripción: Script para crear un efecto acordeón entre h3 y las tablas correspondientes
 * Permite expandir/colapsar tablas al hacer clic en los h3
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeAccordion();
});

function initializeAccordion() {
    // Seleccionar todos los h3 dentro de detail__routine y detalle__calistenia
    const headings = document.querySelectorAll('.detail__routine h3, .detalle__calistenia h3');

    headings.forEach((heading) => {
        // Agregar clase de acordeón y hacer clickeable
        heading.style.cursor = 'pointer';
        heading.setAttribute('role', 'button');
        heading.setAttribute('tabindex', '0');
        

        // Buscar el siguiente elemento .table-container
        const tableContainer = heading.nextElementSibling;

        if (tableContainer && tableContainer.classList.contains('table-container')) {
            // Agregar clase de acordeón al contenedor de tabla
            tableContainer.classList.add('accordion-content');

            // Crear ícono de indicador
            const indicator = document.createElement('span');
            indicator.classList.add('accordion-icon');
            indicator.innerHTML = '<i class="ri-arrow-down-long-fill"></i>';
            heading.appendChild(indicator);

            // Estado inicial: cerrado
            // NO agregamos la clase 'active' para que comience cerrada

            // Evento click para toggle
            heading.addEventListener('click', () => {
                toggleAccordion(tableContainer);
                toggleIcon(indicator);
            });

            // Evento tecla Enter para accesibilidad
            heading.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAccordion(tableContainer);
                    toggleIcon(indicator);
                }
            });
        }
    });
}

function toggleAccordion(element) {
    element.classList.toggle('active-accordion');
    element
}

function toggleIcon(icon) {
    icon.classList.toggle('rotated');
}
