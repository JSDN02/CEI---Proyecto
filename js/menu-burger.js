/**
 * menu-burger.js
 * Descripción: Script para manejar el menú burger y el drawer del footer
 * Funcionalidad: Al hacer clic en ri-menu-line, abre/cierra el footer como un drawer
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeMenuBurger();
});

function initializeMenuBurger() {
    const menuIcon = document.querySelector('.ri-menu-line');
    const footer = document.querySelector('.footer');
    const body = document.body;

    if (!menuIcon || !footer) return;

    // Toggle del menú al hacer clic en el icono
    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(footer, body);
    });

    // Cerrar el menú al hacer clic en un enlace del footer
    const footerLinks = footer.querySelectorAll('a');
    footerLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu(footer, body);
        });
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (
            footer.classList.contains('active-menu') &&
            !footer.contains(e.target) &&
            !menuIcon.contains(e.target)
        ) {
            closeMenu(footer, body);
        }
    });

    // Cerrar el menú con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && footer.classList.contains('active-menu')) {
            closeMenu(footer, body);
        }
    });
}

function toggleMenu(footer, body) {
    if (footer.classList.contains('active-menu')) {
        closeMenu(footer, body);
    } else {
        openMenu(footer, body);
    }
}

function openMenu(footer, body) {
    footer.classList.add('active-menu');
    body.classList.add('menu-open');
    // Cambiar el icono a cerrar (opcional - si usas remixicon)
    const menuIcon = document.querySelector('.ri-menu-line');
    if (menuIcon) {
        menuIcon.classList.add('menu-open-icon');
    }
}

function closeMenu(footer, body) {
    footer.classList.remove('active-menu');
    body.classList.remove('menu-open');
    // Revertir el icono (opcional)
    const menuIcon = document.querySelector('.ri-menu-line');
    if (menuIcon) {
        menuIcon.classList.remove('menu-open-icon');
    }
}
