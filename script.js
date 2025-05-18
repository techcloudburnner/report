document.addEventListener('DOMContentLoaded', () => {
    // Table Sorting (unchanged from previous)
    const table = document.getElementById('financial-table');
    const headers = table.querySelectorAll('th');
    let rows = Array.from(table.querySelectorAll('tbody tr'));

    rows.forEach(row => {
        row.addEventListener('click', () => {
            rows.forEach(r => r.classList.remove('active'));
            row.classList.add('active');
        });
    });

    headers.forEach((header, index) => {
        header.addEventListener('click', () => {
            const sortType = header.getAttribute('data-sort');
            const isAscending = header.classList.toggle('asc');
            const direction = isAscending ? 1 : -1;

            rows.sort((a, b) => {
                let aValue = a.cells[index].textContent.trim();
                let bValue = b.cells[index].textContent.trim();

                if (sortType === 'number') {
                    aValue = aValue === '-' ? 0 : parseFloat(aValue.replace(/,/g, ''));
                    bValue = bValue === '-' ? 0 : parseFloat(bValue.replace(/,/g, ''));
                    return (aValue - bValue) * direction;
                } else {
                    return aValue.localeCompare(bValue) * direction;
                }
            });

            const tbody = table.querySelector('tbody');
            rows.forEach(row => tbody.appendChild(row));
        });
    });

    // Lightbox Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;

    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('.overlay').textContent
    }));

    const openLightbox = (index) => {
        currentIndex = index;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].caption;
        lightbox.classList.add('active');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].caption;
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].caption;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'Escape') closeLightbox();
    });

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) showNext();
        if (touchEndX - touchStartX > 50) showPrev();
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
});