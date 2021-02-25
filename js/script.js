window.addEventListener('DOMContentLoaded', () => {

  //Tabs
  const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.style.display = 'none';
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //Timer

  const deadLine = '2021-03-15';

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
          days = Math.floor(t / (1000 * 60 * 60 * 24)),
          hours = Math.floor(t / (1000 * 60 * 60) % 24),
          minutes = Math.floor((t / 1000 / 60) % 60),
          seconds = Math.floor((t / 1000) % 60);

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
          days = document.querySelector('#days'),
          hours = document.querySelector('#hours'),
          minutes = document.querySelector('#minutes'),
          seconds = document.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

    updateClock();
    
    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadLine);

  //Modal

  const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

  function showModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', showModal);
  });

  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', e => {
    if(e.code === 'Escape' &&
    window.getComputedStyle(modal).display == 'block') {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(showModal, 30000);

  function showModalByScroll() {
    if (window.pageYOffset +
        document.documentElement.clientHeight >=
        document.documentElement.scrollHeight) {
        showModal();
        window.removeEventListener('scroll', showModalByScroll);
      }
  }

  window.addEventListener('scroll', showModalByScroll);

  //Using classes for menu cards

  class MenuItem {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.transfer = 27;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.changeToUAH();
    }

    changeToUAH() {
      this.price *= this.transfer;
    }

    create() {
      const element = document.createElement('div');

      if (this.classes.length == 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }

      element.innerHTML =
      `<img src=${this.src} alt=${this.alt}>
       <h3 class="menu__item-subtitle">${this.title}</h3>
       <div class="menu__item-descr">${this.descr}</div>
       <div class="menu__item-divider"></div>
       <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
       </div>`

      this.parent.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getResource('http://localhost:3000/menu')
    .then(data => {
      data.forEach(({img, altimg, title, descr, price}) => {
        new MenuItem(img, altimg, title, descr, price, '.menu .container').create();
      });
    });

  //Forms

  const forms = document.querySelectorAll('form');
  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо, скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  };

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()))

      postData('http://localhost:3000/requests', json)
      .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
      }).catch(() => {
          showThanksModal(message.failure);
      }).finally(() => {
          form.reset();
      });

    });
  }

  forms.forEach(item => {
    bindPostData(item);
  });

  function showThanksModal(message) {
    const pervModalDialog = document.querySelector('.modal__dialog');

    pervModalDialog.style.display = 'none';
    showModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      pervModalDialog.style.display = 'block';
      closeModal();
    }, 4000);
  }

  //Simple Slider

  // const slides = document.querySelectorAll('.offer__slide'),
  //       sliderPrev = document.querySelector('.offer__slider-prev'),
  //       sliderNext = document.querySelector('.offer__slider-next'),
  //       total = document.querySelector('#total'),
  //       current = document.querySelector('#current');

  // let sliderIndex = 0;

  // const addZero = (num) => {
  //   return num < 10 ? '0' + num : num;
  // };

  // const showSlide = () => {

  //   if (sliderIndex < 0) {
  //     sliderIndex = slides.length - 1;
  //   } else if (sliderIndex > slides.length - 1) {
  //     sliderIndex = 0;
  //   }

  //   current.textContent = addZero(sliderIndex + 1);
  //   total.textContent = addZero(slides.length);

  //   slides.forEach((slide, i) => {
  //     if (i == sliderIndex) {
  //       slide.classList.add('show');
  //       slide.classList.remove('hide');
  //     } else {
  //       slide.classList.add('hide');
  //       slide.classList.remove('show');
  //     }
  //   })
  // };

  // showSlide();

  // sliderPrev.addEventListener('click', () => {
  //   sliderIndex--;
  //   showSlide();
  // });

  // sliderNext.addEventListener('click', () => {
  //   sliderIndex++;
  //   showSlide();
  // });

  //Carousel slider

  const slides = document.querySelectorAll('.offer__slide'),
        sliderPrev = document.querySelector('.offer__slider-prev'),
        sliderNext = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        sliderWrapper = document.querySelector('.offer__slider-wrapper'),
        sliderField = document.querySelector('.offer__slider-inner'),
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

  sliderNext.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }

    sliderField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex >= slides.length - 1) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    updateSliderCounter();
  });

  sliderPrev.addEventListener('click', () => {
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }

    sliderField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex <= 0) {
      slideIndex = slides.length - 1;
    } else {
      slideIndex--;
    }
    updateSliderCounter();
  });

});