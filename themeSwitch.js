const STORAGE_THEME_KEY = 'calories-theme';

const themeToggler = document.querySelector('#themeToggler');
const themeStylesheetLink = document.querySelector('#themeStylesheetLink');
const currentTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'light';

activateTheme(currentTheme);
themeToggler.checked = (currentTheme === 'light') ? false : true;

themeToggler.addEventListener('change', () => {
    const theme = themeToggler.checked ? 'dark' : 'light';
    activateTheme(theme);
    localStorage.setItem('calories-theme', theme);
});

function activateTheme(themeName) {
    themeStylesheetLink.setAttribute('href', `./css/themes/${themeName}.css`)
}