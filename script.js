// Define nextStep globally outside DOMContentLoaded so HTML inline onclick="nextStep(event)" can access it immediately
let currentStep = 0;
let steps = [];
let progressFill = null;

function updateFormDisplay() {
  steps.forEach((step, index) => {
    if (index === currentStep) {
      step.style.setProperty('display', 'flex', 'important');
    } else {
      step.style.setProperty('display', 'none', 'important');
    }
  });

  if (progressFill) {
    const progressPercent = ((currentStep + 1) / steps.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }
}

// Globally exported function for Next button click
window.nextStep = function(e) {
  if (e) e.preventDefault();

  if (!steps.length) return;

  const currentStepEl = steps[currentStep];
  const inputs = Array.from(currentStepEl.querySelectorAll('input, select, textarea'));

  // Validate fields in current active step
  for (let input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return; // Stop on first invalid input
    }
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    updateFormDisplay();
  }
};

// Global Previous Step handler
window.prevStep = function(e) {
  if (e) e.preventDefault();
  if (currentStep > 0) {
    currentStep--;
    updateFormDisplay();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('custom-otm-form');
  if (!form) return;

  steps = Array.from(form.querySelectorAll('.form-step'));
  progressFill = document.getElementById('progressFill');
  const submitBtn = document.getElementById('submitBtn');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwCQe0mXVSfvbGTqpzYHWp7qVU9jKEhy-qvjTYj3r6sVGEE1iDfwpcLzaZTs65rbrpGPQ/exec';

  // Attach click listeners to all Next buttons automatically
  form.querySelectorAll('.btn-next').forEach(button => {
    button.addEventListener('click', window.nextStep);
  });

  // Attach click listeners to all Prev buttons automatically
  form.querySelectorAll('.btn-prev').forEach(button => {
    button.addEventListener('click', window.prevStep);
  });

  // Enable Enter key navigation
  form.querySelectorAll('input[type="text"], input[type="tel"]').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.nextStep(e);
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

  // Initialize display
  updateFormDisplay();
});
