// museumSlider.js - Sliders manuales para el museo
function initMuseumSliders() {
    console.log("Inicializando sliders del museo");
    
    // IDs de todos los contenedores de sliders del museo
    const sliderIds = [
        'slider50', 'slider60', 'slider70', 'slider80',
        'slider90', 'slider2000', 'slider2010', 'slider2020'
    ];

    sliderIds.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const ul = slider.querySelector('ul');
        const slides = slider.querySelectorAll('li');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Configuración inicial
        if (sliderId === 'slider2020') {
            ul.style.width = `${totalSlides * 16.66}%`;
            slides.forEach(slide => {
                slide.style.width = `${100 / totalSlides}%`;
            });
        } else {
            ul.style.width = `${totalSlides * 10}%`;
            slides.forEach(slide => {
                slide.style.width = `${100 / totalSlides}%`;
            });
        }
        // Función de actualización
        const updateSlider = () => {
            if (sliderId === 'slider2020') {
                ul.style.transform = `translateX(-${currentIndex * (600 / totalSlides)}%)`;
            } else {
                ul.style.transform = `translateX(-${currentIndex * (1000 / totalSlides)}%)`;
            }
        };

        // Event listeners para botones
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });

        // Inicialización visual
        updateSlider();
    });
}

// Exponer la función para carga dinámica
window.initMuseumSliders = initMuseumSliders;