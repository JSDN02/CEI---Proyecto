/* ==========================================================================
    accordion.js
    Descripción:
    - Controla la apertura y cierre de bloques tipo acordeón
    - Detecta h3 en los bloques de detalle de rutina o ejercicio
    - Agrega accesibilidad con role y tabindex
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeAccordion()
})

function initializeAccordion() {
    const headings = document.querySelectorAll('.detail__routine h3, .detalle__calistenia h3')

    headings.forEach((heading) => {
        heading.style.cursor = 'pointer'
        heading.setAttribute('role', 'button')
        heading.setAttribute('tabindex', '0')

        const tableContainer = heading.nextElementSibling

        if (tableContainer && tableContainer.classList.contains('table-container')) {
            tableContainer.classList.add('accordion-content')

            heading.addEventListener('click', () => {
                toggleAccordion(tableContainer)
            })

            heading.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleAccordion(tableContainer)
                }
            })
        }
    })
}

function toggleAccordion(element) {
    element.classList.toggle('active-accordion')
    const heading = element.previousElementSibling
    const isActive = element.classList.contains('active-accordion')
    if (heading && heading.tagName === 'H3') {
        heading.style.backgroundColor = isActive ? window.rutinaColor : ''
        heading.style.color = isActive ? 'white' : ''
    }
}
