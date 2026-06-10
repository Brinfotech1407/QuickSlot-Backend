const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

function tomorrowDateOnly() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

async function main() {
  const date = process.env.BOOKING_DATE || tomorrowDateOnly();
  const venueId = process.env.VENUE_ID || '1';
  const slotsResponse = await request(`/venues/${venueId}/slots?date=${date}`);

  if (slotsResponse.status !== 200) {
    throw new Error(`Could not load slots: ${slotsResponse.status}`);
  }

  const slot = slotsResponse.body.slots.find((item) => item.status === 'available');

  if (!slot) {
    throw new Error(`No available slots for venue ${venueId} on ${date}`);
  }

  const payload = JSON.stringify({ slotId: slot.id, date });
  const [first, second] = await Promise.all([
    request('/bookings', {
      method: 'POST',
      headers: { 'X-User-Id': '1' },
      body: payload,
    }),
    request('/bookings', {
      method: 'POST',
      headers: { 'X-User-Id': '2' },
      body: payload,
    }),
  ]);

  console.log(JSON.stringify({
    date,
    venueId: Number(venueId),
    slotId: slot.id,
    results: [first, second].map((result) => ({
      status: result.status,
      message: result.body?.message || result.body?.error?.message,
    })),
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
