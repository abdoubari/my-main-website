<script src="script.js"></script>

<!-- Inline Script for Interactions -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('custom-otm-form');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.form-step'));
  const progressFill = document.getElementById('progressFill');
  const submitBtn = document.getElementById('submitBtn');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwCQe0mXVSfvbGTqpzYHWp7qVU9jKEhy-qvjTYj3r6sVGEE1iDfwpcLzaZTs65rbrpGPQ/exec'; 

  let currentStep = 0;

  function updateFormDisplay() {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });
    if (progressFill) {
      const progressPercent = ((currentStep + 1) / steps.length) * 100;
      progressFill.style.width = `${progressPercent}%`;
    }
  }

  // Next Button Navigation
  form.querySelectorAll('.btn-next').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const currentStepEl = steps[currentStep];
      const inputs = currentStepEl.querySelectorAll('input, select, textarea');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity();
          isValid = false;
        }
      });

      if (isValid && currentStep < steps.length - 1) {
        currentStep++;
        updateFormDisplay();
      }
    });
  });

  // Previous Button Navigation
  form.querySelectorAll('.btn-prev').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 0) {
        currentStep--;
        updateFormDisplay();
      }
    });
  });

  // Enable Enter-key progression for text inputs
  form.querySelectorAll('input[type="text"], input[type="tel"]').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const nextBtn = steps[currentStep].querySelector('.btn-next');
        if (nextBtn) nextBtn.click();
      }
    });
  });

  // Form Submission Handler
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'جاري إرسال الطلب...';
    }

    const searchParams = new URLSearchParams(new FormData(form));

    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      body: searchParams
    })
      .then(() => {
        window.location.href = 'https://www.bariabder.com/thank-you';
      })
      .catch(error => {
        console.error('Error!', error.message);
        alert('حدث خطأ أثناء إرسال البيانات، يرجى إعادة المحاولة.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'إرسال الطلب الآن';
        }
      });
  });

  updateFormDisplay();

  // Accordion Logic for FAQs
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.open = false;
          }
        });
      }
    });
  });
});
</script>
