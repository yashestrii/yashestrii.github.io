// Change navbar style on scroll
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('mainNavbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Open booking modal and pre-select service if provided
document.querySelectorAll('.open-booking').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const service = this.getAttribute('data-service');
    const bookingServiceSelect = document.getElementById('bookingService');
    if (service) {
      bookingServiceSelect.value = service;
    } else {
      bookingServiceSelect.selectedIndex = 0;
    }
    generateDateSelector();
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();
  });
});

// Generate Date Selector Boxes (5 boxes: Today, Tomorrow, +3 days)
function generateDateSelector() {
  const dateSelector = document.getElementById('dateSelector');
  dateSelector.innerHTML = '';
  const selectedDateInput = document.getElementById('selectedDate');
  const today = new Date();
  
  function formatDate(date, index) {
    if(index === 0) return 'Today';
    const options = { weekday: 'short' };
    const day = date.toLocaleDateString('en-US', options).toUpperCase();
    const dd = date.getDate();
    return day + ' ' + dd;
  }
  
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const box = document.createElement('div');
    box.classList.add('date-box');
    if(i === 0) box.classList.add('selected');
    box.innerText = formatDate(d, i);
    box.dataset.date = d.toISOString().split('T')[0];
    box.addEventListener('click', function() {
      document.querySelectorAll('.date-box').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      selectedDateInput.value = this.dataset.date;
      generateTimeSelector();
    });
    dateSelector.appendChild(box);
    if(i === 0) selectedDateInput.value = d.toISOString().split('T')[0];
  }
  generateTimeSelector();
}

// Generate Time Selector Boxes (slots from 8-9am to 7-8pm)
function generateTimeSelector() {
  const timeSelector = document.getElementById('timeSelector');
  timeSelector.innerHTML = '';
  const selectedTimeInput = document.getElementById('selectedTime');
  const slots = [];
  for(let hour = 8; hour < 20; hour++) {
    const start = hour;
    const end = hour + 1;
    function formatHour(h) {
      let period = h >= 12 ? 'pm' : 'am';
      let hour12 = h % 12;
      if(hour12 === 0) hour12 = 12;
      return hour12;
    }
    const slotText = `${formatHour(start)}-${formatHour(end)}${end >= 12 ? 'pm' : 'am'}`;
    slots.push({ start, text: slotText });
  }
  
  const selectedDate = document.getElementById('selectedDate').value;
  const now = new Date();
  let currentHour = now.getHours();
  if (selectedDate !== now.toISOString().split('T')[0]) {
    currentHour = 0;
  }
  
  slots.forEach(slot => {
    const box = document.createElement('div');
    box.classList.add('time-box');
    box.innerText = slot.text;
    box.dataset.hour = slot.start;
    if(slot.start < currentHour) {
      box.classList.add('disabled');
    }
    box.addEventListener('click', function() {
      document.querySelectorAll('.time-box').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      selectedTimeInput.value = this.innerText;
    });
    timeSelector.appendChild(box);
  });
  
  const firstAvailable = document.querySelector('.time-box:not(.disabled)');
  if(firstAvailable) {
    firstAvailable.classList.add('selected');
    selectedTimeInput.value = firstAvailable.innerText;
  }
}

// Booking Form Submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const service = document.getElementById('bookingService').value;
  const date = document.getElementById('selectedDate').value;
  const time = document.getElementById('selectedTime').value;
  
  let message = 'hello Estrii i want to book';
  if(service) {
    message += ' ' + service;
  }
  message += ' on ' + date + ' at ' + time;
  
  const phone = '123456789';
  const whatsappURL = 'https://api.whatsapp.com/send?phone=' + phone + '&text=' + encodeURIComponent(message);
  window.location.href = whatsappURL;
});

// Collapse navbar after clicking a nav link (for mobile)
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', function() {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse.classList.contains('show')) {
      new bootstrap.Collapse(navbarCollapse).hide();
    }
  });
});
