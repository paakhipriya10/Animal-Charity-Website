let totalRaised = 0;
const goal = 200000;

// ✅ Load total donation on page load
async function fetchTotalDonations() {
  try {
    const res = await fetch('/total-donations');
    const data = await res.json();
    totalRaised = data.total || 0;
    updateProgress();
  } catch (error) {
    console.error("❌ Error fetching total:", error);
  }
}

fetchTotalDonations(); // Call on load

// ✅ Donation form
document.getElementById('donation-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const name = form.elements['name'].value;
  const email = form.elements['email'].value;
  const amount = parseInt(form.elements['amount'].value);

  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid donation amount.");
    return;
  }

  totalRaised += amount;
  updateProgress();
  document.getElementById('donation-confirmation').style.display = 'block';

  try {
    await fetch('/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, amount }),
    });
  } catch (err) {
    console.error("❌ Donation error:", err);
  }

  form.reset();
});

function updateProgress() {
  const percent = (totalRaised / goal) * 100;
  document.getElementById('progress').style.width = `${Math.min(percent, 100)}%`;
  document.getElementById('total-raised').textContent = totalRaised;

  const estimatedAnimalsSaved = Math.floor(totalRaised / 3);
  document.getElementById('animals-saved').textContent = estimatedAnimalsSaved;

  // 🎯 Check if donation goal is reached
  if (totalRaised >= goal && !document.querySelector('.goal-message')) {
    const msg = document.createElement('p');
    msg.className = 'goal-message';
    msg.textContent = "🎉 Donation Goal Achieved! Thank you for your support!";
    document.querySelector('.donation').appendChild(msg);
  }
}

// ✅ Contact form
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const name = form.elements['name'].value;
  const email = form.elements['email'].value;
  const message = form.elements['message'].value;

  document.getElementById('contact-confirmation').style.display = 'block';

  try {
    await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
  } catch (err) {
    console.error("❌ Contact error:", err);
  }

  form.reset();
});

// ✅ Carousel logic
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel .slide');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

setInterval(nextSlide, 3000);
