const STORAGE_KEY = 'ev_society_user';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    return null;
  }
}

function setStoredUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
}

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

function redirectIfAnonymous() {
  const user = getStoredUser();
  if (!user) {
    window.location.href = 'login.html';
  }
}

function setupLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const result = await jsonFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setStoredUser(result.user);
      window.location.href = result.user.role === 'admin' ? 'admin.html' : 'dashboard.html';
    } catch (error) {
      alert(error.message);
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const result = await jsonFetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      alert('Registration successful. Please log in.');
      window.location.href = 'login.html';
    } catch (error) {
      alert(error.message);
    }
  });
}

function renderStations(stations) {
  const stationList = document.getElementById('stationList');
  const stationSelect = document.getElementById('stationSelect');

  if (!stationList && !stationSelect) return;

  const cards = stations.map((station) => `
    <article class="station-card">
      <div class="station-banner" style="background-image:url('${station.image}')"></div>
      <div class="station-card-body">
        <div class="station-head">
          <h3>${station.name}</h3>
          <span class="tag">${station.availableSlots} slots</span>
        </div>
        <p>${station.location}</p>
        <div class="station-meta">
          <span>₹${station.ratePerHour}/hr</span>
          <span>${station.capacity} capacity</span>
        </div>
      </div>
    </article>
  `).join('');

  if (stationList) stationList.innerHTML = cards;

  if (stationSelect) {
    stationSelect.innerHTML = stations.map((station) => `
      <option value="${station.id}">${station.name} (${station.availableSlots} left)</option>
    `).join('');
  }
}

function buildBookingTable(bookings) {
  const container = document.getElementById('bookingTable');
  if (!container) return;

  if (!bookings.length) {
    container.innerHTML = '<div class="empty-state">No bookings found yet.</div>';
    return;
  }

  const rows = bookings.map((booking) => `
    <div class="table-row">
      <span>${booking.stationName}</span>
      <span>${booking.slotDate}</span>
      <span>${booking.startTime} - ${booking.endTime}</span>
      <span class="status ${booking.status}">${booking.status}</span>
      <button class="cancel-btn" data-booking-id="${booking.id}">Cancel</button>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="table-header">
      <span>Station</span>
      <span>Date</span>
      <span>Time</span>
      <span>Status</span>
      <span>Action</span>
    </div>
    ${rows}
  `;

  container.querySelectorAll('.cancel-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const bookingId = button.dataset.bookingId;
      const user = getStoredUser();
      try {
        await jsonFetch(`/api/bookings/${bookingId}/cancel`, {
          method: 'POST',
          body: JSON.stringify({ userId: user.id, isAdmin: user.role === 'admin' })
        });
        loadDashboard();
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

function buildPenaltyTable(penalties) {
  const container = document.getElementById('penaltyTable');
  if (!container) return;

  if (!penalties.length) {
    container.innerHTML = '<div class="empty-state">No violations recorded.</div>';
    return;
  }

  const rows = penalties.map((penalty) => `
    <div class="table-row compact-row">
      <span>${penalty.reason}</span>
      <span>${new Date(penalty.generatedAt).toLocaleDateString()}</span>
      <span class="alert">₹${penalty.amount}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="table-header">
      <span>Issue</span>
      <span>Date</span>
      <span>Amount</span>
    </div>
    ${rows}
  `;
}

async function loadDashboard() {
  redirectIfAnonymous();
  const user = getStoredUser();
  const welcomeName = document.getElementById('welcomeName');
  const residentEmail = document.getElementById('residentEmail');
  const bookedCount = document.getElementById('bookedCount');
  const overstayCount = document.getElementById('overstayCount');
  const penaltyTotal = document.getElementById('penaltyTotal');

  if (welcomeName) welcomeName.textContent = user.name;
  if (residentEmail) residentEmail.textContent = user.email;

  try {
    const stationsResult = await jsonFetch('/api/stations');
    renderStations(stationsResult.stations);

    const bookingsResult = await jsonFetch(`/api/bookings?userId=${user.id}`);
    const bookings = bookingsResult.bookings || [];
    buildBookingTable(bookings);

    const penaltyBookings = bookings.filter((booking) => booking.penaltyAmount > 0);
    const penaltyList = penaltyBookings.map((booking) => ({
      reason: `Overstay at ${booking.stationName}`,
      amount: booking.penaltyAmount,
      generatedAt: booking.penaltyGeneratedAt || booking.createdAt
    }));

    if (bookedCount) bookedCount.textContent = String(bookings.length);
    if (overstayCount) overstayCount.textContent = String(bookings.filter((booking) => booking.status === 'overstay').length);
    if (penaltyTotal) penaltyTotal.textContent = `₹${penaltyList.reduce((sum, item) => sum + item.amount, 0)}`;

    buildPenaltyTable(penaltyList);

    const form = document.getElementById('bookingForm');
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        payload.userId = user.id;

        try {
          await jsonFetch('/api/bookings', {
            method: 'POST',
            body: JSON.stringify(payload)
          });

          form.reset();
          loadDashboard();
        } catch (error) {
          alert(error.message);
        }
      });
    }
  } catch (error) {
    console.error(error);
    alert(error.message || 'Unable to load data.');
  }
}

async function loadAdminDashboard() {
  redirectIfAnonymous();
  const user = getStoredUser();
  if (!user || user.role !== 'admin') {
    window.location.href = 'dashboard.html';
  }

  try {
    const overview = await jsonFetch('/api/admin/overview');
    const summaryContainer = document.getElementById('dashboardSummary');

    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="summary-card">
          <span>Residents</span>
          <strong>${overview.residentCount}</strong>
        </div>
        <div class="summary-card">
          <span>Active bookings</span>
          <strong>${overview.activeBookings}</strong>
        </div>
        <div class="summary-card">
          <span>Overstay cases</span>
          <strong>${overview.overstayCount}</strong>
        </div>
        <div class="summary-card">
          <span>Total penalty</span>
          <strong>₹${overview.totalPenalty}</strong>
        </div>
      `;
    }

    const stationUtilization = document.getElementById('stationUtilization');
    if (stationUtilization) {
      stationUtilization.innerHTML = `
        <div class="table-header">
          <span>Station</span>
          <span>Utilization</span>
          <span>Bookings</span>
          <span>Capacity</span>
        </div>
        ${overview.stationSummary.map((station) => `
          <div class="table-row">
            <span>${station.name}</span>
            <span>${station.utilization}%</span>
            <span>${station.bookings}</span>
            <span>${station.capacity}</span>
          </div>
        `).join('')}
      `;
    }

    const recentBookingTable = document.getElementById('recentBookingTable');
    if (recentBookingTable) {
      recentBookingTable.innerHTML = `
        <div class="table-header">
          <span>Resident</span>
          <span>Station</span>
          <span>Date</span>
          <span>Status</span>
        </div>
        ${overview.recentBookings.map((booking) => `
          <div class="table-row">
            <span>${booking.userName}</span>
            <span>${booking.stationName}</span>
            <span>${booking.slotDate}</span>
            <span class="status ${booking.status}">${booking.status}</span>
          </div>
        `).join('')}
      `;
    }
  } catch (error) {
    console.error(error);
    alert(error.message || 'Unable to load admin data');
  }
}

function setupLogoutButtons() {
  document.querySelectorAll('#logoutBtn').forEach((button) => {
    button.addEventListener('click', () => {
      clearStoredUser();
      window.location.href = 'login.html';
    });
  });
}

function initPage() {
  setupLogoutButtons();
  setupLoginForm();
  setupRegisterForm();

  const page = window.location.pathname.split('/').pop();

  if (page === 'dashboard.html') {
    loadDashboard();
  }

  if (page === 'admin.html') {
    loadAdminDashboard();
  }
}

document.addEventListener('DOMContentLoaded', initPage);
