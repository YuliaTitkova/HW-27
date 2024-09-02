class Slider {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelector('.slides');
        this.slidesArray = Array.from(this.slides.children);
        this.currentSlide = 0;
        this.isPlaying = true;
        this.intervalTime = 3000;
        this.interval = null;

        this.init();
    }

    init() {
        this.setupControls();
        this.setupIndicators();
        this.updateSlide();
        this.startAutoPlay();
        this.addEventListeners();
    }

    setupControls() {
        this.prevButton = this.container.querySelector('.prev');
        this.nextButton = this.container.querySelector('.next');
        this.pausePlayButton = this.container.querySelector('.pause-play');
    }

    setupIndicators() {
        this.indicatorsContainer = this.container.querySelector('.indicators');
        this.slidesArray.forEach((_, index) => {
            const button = document.createElement('button');
            button.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(button);
        });
        this.updateIndicators();
    }

    addEventListeners() {
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
        this.pausePlayButton.addEventListener('click', () => this.togglePlayPause());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        let touchStartX = 0;
        let touchEndX = 0;

        this.slides.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
        this.slides.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX > touchEndX + 50) this.nextSlide();
            if (touchStartX < touchEndX - 50) this.prevSlide();
        });

        let mouseStartX = 0;
        let mouseEndX = 0;

        this.slides.addEventListener('mousedown', e => mouseStartX = e.clientX);
        this.slides.addEventListener('mouseup', e => {
            mouseEndX = e.clientX;
            if (mouseStartX > mouseEndX + 50) this.nextSlide();
            if (mouseStartX < mouseEndX - 50) this.prevSlide();
        });
    }

    startAutoPlay() {
        this.interval = setInterval(() => this.nextSlide(), this.intervalTime);
    }

    stopAutoPlay() {
        clearInterval(this.interval);
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.stopAutoPlay();
            this.pausePlayButton.textContent = 'Play';
        } else {
            this.startAutoPlay();
            this.pausePlayButton.textContent = 'Pause';
        }
        this.isPlaying = !this.isPlaying;
    }

    updateSlide() {
        const offset = -this.currentSlide * 100;
        this.slides.style.transform = `translateX(${offset}%)`;
        this.updateIndicators();
    }

    updateIndicators() {
        this.indicatorsContainer.querySelectorAll('button').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    goToSlide(index) {
        this.currentSlide = (index + this.slidesArray.length) % this.slidesArray.length;
        this.updateSlide();
    }

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const slider = new Slider(document.querySelector('.slider'));
});
