// custom js, initialize klaro and open it always the user click on cookies-settings in the footer
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', event => {
        const link = event.target.closest('#cookies-settings');
        if (!link)
            return;
        event.preventDefault();
        klaro.show();
    });
});