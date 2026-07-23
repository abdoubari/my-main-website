const themeToggleBtn = document.getElementById('themeToggle');

// 1. Check saved preference, otherwise fallback to local device time
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
} else {
  const currentHour = new Date().getHours();
  if (currentHour >= 9 && currentHour < 18) {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
}

// 2. Toggle and save state on click
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}
