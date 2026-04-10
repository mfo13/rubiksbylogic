document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.toggle-icon').forEach(icon => {
    const targetSelector = icon.getAttribute('data-bs-target');
    const target = document.querySelector(targetSelector);

    target.addEventListener('show.bs.collapse', () => {
      icon.classList.add('rotate');
    });

    target.addEventListener('hide.bs.collapse', () => {
      icon.classList.remove('rotate');
    });
  });
});