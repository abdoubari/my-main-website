document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. THEME TOGGLE LOGIC
  // ==========================================

  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');

  function applyTheme(isLight) {
    if (isLight) {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }

  // Check saved theme first; otherwise, Light Theme is 9 AM to 6 PM (9 - 17)
  if (savedTheme !== null) {
    applyTheme(savedTheme === 'light');
  } else {
    const currentHour = new Date().getHours();
    // Light theme from 9:00 AM until 5:59 PM; Dark theme from 6:00 PM to 8:59 AM
    const isDayTime = currentHour >= 9 && currentHour < 18;
    applyTheme(isDayTime);
  }

  // Toggle click listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyLight = document.body.classList.contains('light-theme');
      const newLightState = !isCurrentlyLight;
      
      applyTheme(newLightState);
      localStorage.setItem('theme', newLightState ? 'light' : 'dark');
    });
  }

  // ==========================================
  // 2. POPUP MODAL LOGIC
  // ==========================================

  const modal = document.getElementById('leadModal');
  const form = document.getElementById('leadForm');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwOY0x3vOCKvI4uIRlc1VsYGq-sN5t90U1p_7jOiELewGNeesXOqEfnFbJcZBrnFJk-QQ/exec'; 

  window.openModal = function() {
    if (modal) modal.classList.add('active');
  };

  window.closeModal = function() {
    if (modal) modal.classList.remove('active');
  };

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerText = 'جاري التحويل...';

      const searchParams = new URLSearchParams(new FormData(form));

      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: searchParams
      })
      .then(() => {
        window.location.href = 'https://www.bariabder.com/explainer';
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('حدث خطأ أثناء إرسال البيانات، يرجى إعادة المحاولة.');
        submitBtn.disabled = false;
        submitBtn.innerText = 'شاهد الفيديو الآن';
      });
    });
  }
});
