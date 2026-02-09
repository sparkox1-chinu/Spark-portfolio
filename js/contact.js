const myButton = document.getElementById('submitBtn');
const form = document.getElementById('contactForm');
const status = document.getElementById('statusMessage');
const submitBtn = document.getElementById('submitBtn');
const popup = document.getElementById('errorPopup');
const popupText = document.getElementById('popupText');
const closePopup = document.getElementById('closePopup');
let popupTimeout;

// Show toast notification (persistent 5s)
function showPopup(message) {
  popupText.textContent = message;
  popup.style.display = "flex";

  // Trigger bounce animation
  popup.classList.remove('show');
  void popup.offsetWidth; // force reflow
  popup.classList.add('show');

  // Clear previous timeout
  clearTimeout(popupTimeout);

  // Keep visible for 5 seconds
  popupTimeout = setTimeout(() => {
    hidePopup();
  }, 5000);
}

// Hide toast
function hidePopup() {
  popup.classList.remove('show');
  setTimeout(() => {
    popup.style.display = "none";
  }, 300); // small delay for animation
}

// Close toast manually
closePopup.addEventListener('click', hidePopup);

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show/hide status message below form
function showStatus(message, color = "") {
  status.textContent = message;
  status.style.color = color;
  status.style.display = "block";
}

function hideStatus(delay = 2000) {
  setTimeout(() => {
    status.textContent = "";
    status.style.display = "none";
  }, delay);
}

// Shake input and label + glow
function shakeField(input, delay = 0) {
  const label = input.closest('.form-group').querySelector('label');
  input.classList.remove('shake', 'invalid-glow');
  label.classList.remove('shake');

  setTimeout(() => {
    input.classList.add('shake', 'invalid-glow');
    label.classList.add('shake');
    setTimeout(() => input.classList.remove('invalid-glow'), 1000);
  }, delay);

  input.focus();
}

// Shake entire form
function shakeForm() {
  form.classList.remove('shake');
  void form.offsetWidth; 
  form.classList.add('shake');
}

// Form submit handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Reset previous shakes/glows
  form.querySelectorAll('input, textarea, label').forEach(el => el.classList.remove('shake', 'invalid-glow'));
  form.classList.remove('shake');

  // Validation
  let errors = [];
  let invalidFields = [];

  if (!data.name.trim()) { errors.push("Name is required"); invalidFields.push(form.querySelector('[name="name"]')); }
  if (!data.email.trim()) { errors.push("Email is required"); invalidFields.push(form.querySelector('[name="email"]')); }
  else if (!isValidEmail(data.email.trim())) { errors.push("Email is invalid"); invalidFields.push(form.querySelector('[name="email"]')); }
 // if (!data.telegram.trim()) { errors.push("Telegram username is required"); invalidFields.push(form.querySelector('[name="telegram"]')); }
  if (!data.subject.trim()) { errors.push("Subject is required"); invalidFields.push(form.querySelector('[name="subject"]')); }
  if (!data.message.trim()) { errors.push("Message is required"); invalidFields.push(form.querySelector('[name="message"]')); }

  if (errors.length > 0) {
    invalidFields.forEach((input, index) => shakeField(input, index * 150));
    shakeForm();
    showPopup(errors.join(", "));
    return;
  }
  
  // Sending
  submitBtn.disabled = true;
  //showStatus("Sendinggg...");
  // Change the button's text content
  myButton.textContent = 'Sending...';
    

  try {
    const response = await fetch('/api/sendTelegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (result.success) {
      showStatus("Message sent successfully!", "#22bb33");
      showPopup("Message sent success!");
      form.reset();
      hideStatus();
    } else {
      showStatus("Failed to send message!", "red");
      showPopup("Failed to send message!");
      hideStatus();
    }
  } catch (err) {
    showStatus("Error sending message!", "red");
    showPopup("Error sending message!");
    console.error(err);
    hideStatus();
  } finally {
    submitBtn.disabled = false;
    myButton.textContent = 'Send';
  }
});
