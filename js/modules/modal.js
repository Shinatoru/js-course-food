function modal() {
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
}

module.exports = modal;