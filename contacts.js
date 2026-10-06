const contactDialog = document.getElementById('contact-dialog');
const contactDescription = document.getElementById('contact-dialog-description');
let contactOpener;
let backdropPointerDown = false;

document.querySelectorAll('[data-contact-topic]').forEach(button => {
  button.addEventListener('click', () => {
    contactOpener = button;
    contactDescription.textContent = `${button.dataset.contactTopic}. Выберите мессенджер или позвоните — обсудим вашу цель и удобное время.`;
    contactDialog.showModal();
    document.documentElement.classList.add('contact-dialog-open');
  });
});

contactDialog.querySelector('.contact-dialog-close').addEventListener('click', () => contactDialog.close());

contactDialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...contactDialog.querySelectorAll('button:not([disabled]), a[href]')];
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

function isOutsideDialog(event) {
  const rect = contactDialog.getBoundingClientRect();
  return event.target === contactDialog &&
    (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
}

contactDialog.addEventListener('pointerdown', event => {
  backdropPointerDown = isOutsideDialog(event);
});
contactDialog.addEventListener('click', event => {
  if (backdropPointerDown && isOutsideDialog(event)) contactDialog.close();
  backdropPointerDown = false;
});
contactDialog.addEventListener('close', () => {
  document.documentElement.classList.remove('contact-dialog-open');
  contactOpener?.focus({preventScroll:true});
});
