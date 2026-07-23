const themeToggleBtn = document.getElementById('themeToggle');

// Set theme based on current time
function setThemeByTime() {
  const currentHour = new Date().getHours();

  if (currentHour >= 9 && currentHour < 18) {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
}

// Apply theme on page load
setThemeByTime();

// Toggle theme manually
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});