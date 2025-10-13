  feather.replace();
        
        // Mobile menu toggle
        document.getElementById('menu-btn').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
        
        // Simple carousel functionality
        let currentSlide = 0;
        const carousel = document.getElementById('carousel');
        const items = document.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        
        document.getElementById('next-btn').addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % totalItems;
            updateCarousel();
        });
        
        document.getElementById('prev-btn').addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + totalItems) % totalItems;
            updateCarousel();
        });
        
        function updateCarousel() {
            const offset = -currentSlide * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        }
        
        // Auto-rotate carousel
        setInterval(function() {
            currentSlide = (currentSlide + 1) % totalItems;
            updateCarousel();
        }, 5000);
    
     