const API_BASE_URL =
  window.APP_CONFIG?.apiBaseUrl ||
  (window.location.protocol === 'http:' || window.location.protocol === 'https:'
    ? `${window.location.protocol}//${window.location.hostname}:3000`
    : 'http://localhost:3000');

const eventsUrl = (range) => {
  if (range === 'past') return `${API_BASE_URL}/events/past`;
  if (range === 'all') return `${API_BASE_URL}/events`;
  return `${API_BASE_URL}/events/upcoming`;
};

const titleForRange = (range) => {
  if (range === 'past') return 'Past events';
  if (range === 'all') return 'All events';
  return 'Upcoming events';
};

document.addEventListener('DOMContentLoaded', () => {
  const eventsContainer = document.getElementById('events-container');
  const sportFilter = document.getElementById('sport-filter');
  const rangeFilter = document.getElementById('range-filter');
  const pageTitle = document.getElementById('page-title');

  let currentEvents = [];

  const init = async () => {
    await Promise.all([loadSports(), loadEvents()]);
  };

  const loadSports = async () => {
    const response = await fetch(`${API_BASE_URL}/sports`);
    const sports = await response.json();
    sportFilter.innerHTML =
      '<option value="">All sports</option>' +
      sports
        .map((s) => `<option value="${s.name}">${s.name}</option>`)
        .join('');
  };

  const loadEvents = async () => {
    const range = rangeFilter.value;
    try {
      const response = await fetch(eventsUrl(range));
      currentEvents = await response.json();
      pageTitle.textContent = titleForRange(range);
      applySportFilterAndRender();
    } catch {
      eventsContainer.innerHTML = `<div class="no-events">Failed to load events. Is the API running?</div>`;
    }
  };

  const formatDate = (date) => String(date).split('T')[0];

  const formatVenue = (event) => {
    if (!event.venue) return '';
    const line = event.venue_city
      ? `${event.venue}, ${event.venue_city}`
      : event.venue;
    return `<div class="detail-item"><strong>🏟️ Venue:</strong> ${line}</div>`;
  };

  const createEventCard = (event) => `
    <div class="event-card">
      <span class="event-sport">${event.sport}</span>
      <h3 class="event-teams">${event.home_team} <span class="event-vs">vs</span> ${event.away_team}</h3>
      <div class="event-details">
        <div class="detail-item"><strong>📅 Date:</strong> ${formatDate(event.date)}</div>
        <div class="detail-item"><strong>⏰ Time:</strong> ${event.time}</div>
        ${formatVenue(event)}
        ${
          event.description
            ? `<p class="event-description">${event.description}</p>`
            : ''
        }
      </div>
    </div>
  `;

  const renderEvents = (events) => {
    if (!events.length) {
      eventsContainer.innerHTML = `<div class="no-events">No events found.</div>`;
      return;
    }
    eventsContainer.innerHTML = events.map(createEventCard).join('');
  };

  const applySportFilterAndRender = () => {
    const sport = sportFilter.value;
    const list = sport
      ? currentEvents.filter((e) => e.sport === sport)
      : currentEvents;
    renderEvents(list);
  };

  rangeFilter.addEventListener('change', () => {
    loadEvents();
  });

  sportFilter.addEventListener('change', () => {
    applySportFilterAndRender();
  });

  init();
});
