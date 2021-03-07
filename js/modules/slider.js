function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
  const slides = document.querySelectorAll(slide),
        slider = document.querySelector(container),
        sliderPrev = document.querySelector(prevArrow),
        sliderNext = document.querySelector(nextArrow),
        total = document.querySelector(totalCounter),
        current = document.querySelector(currentCounter),
        sliderWrapper = document.querySelector(wrapper),
        sliderField = document.querySelector(field),
        width = window.getComputedStyle(sliderWrapper).width;

  let slideIndex = 0;
  let offset = 0;

  const addZero = (num) => {
    return num < 10 ? '0' + num : num;
  };

  const updateSliderCounter = () => {
    current.textContent = addZero(slideIndex + 1);
    total.textContent = addZero(slides.length);
  };

  updateSliderCounter();

  sliderField.style.width = 100 * slides.length + '%';
  sliderField.style.display = 'flex';
  sliderField.style.transition = '0.5s all';
  sliderWrapper.style.overflow = 'hidden';

  slides.forEach(slide => {
    slide.style.width = width;
  });

  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
        dots = [];
  indicators.classList.add('carousel-indicators');
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide', i + 1);
    dot.classList.add('dot');

    if (i == 0) {
      dot.style.opacity = 1;
    }

    indicators.append(dot);
    dots.push(dot);
  }

  function deleteNotDigits(str) {
    return +str.replace(/\D/g, '');
  }

  sliderNext.addEventListener('click', () => {
    if (offset == deleteNotDigits(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += deleteNotDigits(width);
    }

    sliderField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex >= slides.length - 1) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    updateSliderCounter();

    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex].style.opacity = 1;
  });

  sliderPrev.addEventListener('click', () => {
    if (offset == 0) {
      offset = deleteNotDigits(width) * (slides.length - 1);
    } else {
      offset -= deleteNotDigits(width);
    }

    sliderField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex <= 0) {
      slideIndex = slides.length - 1;
    } else {
      slideIndex--;
    }
    updateSliderCounter();

    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex].style.opacity = 1;
  });

  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      const slide = e.target.getAttribute('data-slide');

      slideIndex = slide - 1;
      offset = deleteNotDigits(width) * (slide - 1);
      sliderField.style.transform = `translateX(-${offset}px)`;

      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex].style.opacity = 1;
      updateSliderCounter();
    });
  });
}

export default slider;