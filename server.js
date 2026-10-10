const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      users: [
        {
          id: 'admin-1',
          name: 'Society Admin',
          email: 'admin@society.com',
          password: 'admin123',
          phone: '9876543210',
          vehicleNumber: 'KA01AB0001',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ],
      stations: [
        {
          id: 'station-1',
          name: 'Block A EV Hub',
          location: 'Basement Level 1',
          capacity: 4,
          ratePerHour: 60,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?auto=format&fit=crop&w=1200&q=80'
        },
        {
          id: 'station-2',
          name: 'Block B Charging Zone',
          location: 'Visitor Parking',
          capacity: 3,
          ratePerHour: 75,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
        },
        {
          id: 'station-3',
          name: 'Community Green Station',
          location: 'Garden Side',
          capacity: 5,
          ratePerHour: 90,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1532036417722-0ede439d57f2?auto=format&fit=crop&w=1200&q=80'
        }
      ],
      bookings: [
        {
          id: 'booking-1',
          userId: 'admin-1',
          userName: 'Society Admin',
          stationId: 'station-1',
          stationName: 'Block A EV Hub',
          slotDate: getDateString(-1),
          startTime: '09:00',
          endTime: '11:00',
          vehicleNumber: 'KA01AB0001',
          status: 'completed',
          createdAt: new Date().toISOString(),
          penaltyAmount: 0
        }
      ],
      penalties: []
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

function getDateString(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
}

function readData() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function overlapping(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function getStationById(stations, stationId) {
  return stations.find((station) => station.id === stationId);
}

function applyAutoPenalties(data) {
  let changed = false;
  const now = new Date();

  data.bookings.forEach((booking) => {
    if (booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'overstay') {
      return;
    }

    const bookingEnd = new Date(`${booking.slotDate}T${booking.endTime}:00`);

    if (bookingEnd < now) {
      const existingPenalty = data.penalties.find((penalty) => penalty.bookingId === booking.id);
      if (!existingPenalty) {
        const minutesOver = Math.max(0, Math.round((now - bookingEnd) / 60000));
        const penaltyAmount = Math.max(50, Math.ceil(minutesOver / 30) * 25 + (booking.stationRatePerHour || 60));

        data.penalties.push({
          id: `penalty-${crypto.randomUUID()}`,
          bookingId: booking.id,
          userId: booking.userId,
          amount: penaltyAmount,
          reason: 'Overstay beyond booked end time',
          generatedAt: new Date().toISOString()
        });

        booking.status = 'overstay';
        booking.penaltyAmount = penaltyAmount;
        booking.penaltyGeneratedAt = new Date().toISOString();
        changed = true;
      }
    }
  });

  if (changed) {
    writeData(data);
  }

  return data;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    vehicleNumber: user.vehicleNumber,
    role: user.role || 'resident'
  };
}

function createResponse(data, status = 200) {
  return { status, json: data };
}

app.get('/api/health', (req, res) => {
  const data = readData();
  res.json({
    status: 'ok',
    message: 'EV charging booking API is live',
    users: data.users.length,
    stations: data.stations.length,
    bookings: data.bookings.length
  });
});

app.post('/api/register', (req, res) => {
  const { name, email, password, phone, vehicleNumber } = req.body;

  if (!name || !email || !password || !phone || !vehicleNumber) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  const data = readData();

  const exists = data.users.some((user) => user.email.toLowerCase() === email.toLowerCase() || user.phone === phone);
  if (exists) {
    return res.status(409).json({ message: 'User with this email or phone already exists.' });
  }

  const newUser = {
    id: `user-${crypto.randomUUID()}`,
    name,
    email: email.toLowerCase(),
    password,
    phone,
    vehicleNumber,
    role: 'resident',
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  writeData(data);

  return res.status(201).json({
    message: 'Registration successful.',
    user: sanitizeUser(newUser)
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const data = readData();
  const user = data.users.find((entry) => entry.email.toLowerCase() === String(email).toLowerCase() && entry.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json({
    message: 'Login successful.',
    user: sanitizeUser(user)
  });
});

app.get('/api/stations', (req, res) => {
  const data = applyAutoPenalties(readData());
  const stations = data.stations.map((station) => {
    const bookings = data.bookings.filter((booking) => booking.stationId === station.id && booking.status !== 'cancelled');
    return {
      ...station,
      totalBookings: bookings.length,
      availableSlots: Math.max(0, station.capacity - bookings.length)
    };
  });

  res.json({ stations });
});

app.post('/api/bookings', (req, res) => {
  const { userId, stationId, slotDate, startTime, endTime, vehicleNumber } = req.body;

  if (!userId || !stationId || !slotDate || !startTime || !endTime || !vehicleNumber) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }

  const data = readData();
  const user = data.users.find((entry) => entry.id === userId);
  const station = getStationById(data.stations, stationId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (!station) {
    return res.status(404).json({ message: 'Station not found.' });
  }

  if (new Date(`${slotDate}T${startTime}:00`) < new Date()) {
    return res.status(400).json({ message: 'Booking date and time cannot be in the past.' });
  }

  if (startTime >= endTime) {
    return res.status(400).json({ message: 'End time must be later than the start time.' });
  }

  const slotConflict = data.bookings.some((booking) => {
    if (booking.stationId !== stationId || booking.status === 'cancelled') {
      return false;
    }

    const sameDate = booking.slotDate === slotDate;
    const overlaps = overlapping(
      Number(startTime.replace(':', '')),
      Number(endTime.replace(':', '')),
      Number(booking.startTime.replace(':', '')),
      Number(booking.endTime.replace(':', ''))
    );

    return sameDate && overlaps;
  });

  if (slotConflict) {
    return res.status(409).json({ message: 'This charging slot is already booked. Please choose another time.' });
  }

  const booking = {
    id: `booking-${crypto.randomUUID()}`,
    userId: user.id,
    userName: user.name,
    stationId: station.id,
    stationName: station.name,
    stationRatePerHour: station.ratePerHour,
    slotDate,
    startTime,
    endTime,
    vehicleNumber,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    penaltyAmount: 0
  };

  data.bookings.push(booking);
  writeData(data);

  return res.status(201).json({
    message: 'Charging slot booked successfully.',
    booking
  });
});

app.get('/api/bookings', (req, res) => {
  const { userId, role } = req.query;
  const data = applyAutoPenalties(readData());

  const bookings = data.bookings.filter((booking) => {
    if (role === 'admin') return true;
    if (userId) return booking.userId === userId;
    return true;
  });

  res.json({ bookings: bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

app.post('/api/bookings/:bookingId/cancel', (req, res) => {
  const { userId } = req.body;
  const data = readData();
  const booking = data.bookings.find((entry) => entry.id === req.params.bookingId);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  if (booking.userId !== userId && !req.body.isAdmin) {
    return res.status(403).json({ message: 'You are not allowed to cancel this booking.' });
  }

  booking.status = 'cancelled';
  writeData(data);

  return res.json({ message: 'Booking cancelled successfully.', booking });
});

app.get('/api/admin/overview', (req, res) => {
  const data = applyAutoPenalties(readData());

  const residentCount = data.users.filter((user) => user.role !== 'admin').length;
  const activeBookings = data.bookings.filter((booking) => booking.status === 'confirmed').length;
  const overstayCount = data.bookings.filter((booking) => booking.status === 'overstay').length;
  const totalPenalty = data.penalties.reduce((sum, penalty) => sum + penalty.amount, 0);

  const stationSummary = data.stations.map((station) => {
    const stationBookings = data.bookings.filter((booking) => booking.stationId === station.id && booking.status !== 'cancelled');
    return {
      ...station,
      bookings: stationBookings.length,
      utilization: Math.min(100, Math.round((stationBookings.length / station.capacity) * 100))
    };
  });

  res.json({
    residentCount,
    activeBookings,
    overstayCount,
    totalPenalty,
    stationSummary,
    recentBookings: data.bookings.slice(-5).reverse()
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`EV charging portal is running on http://localhost:${PORT}`);
});
