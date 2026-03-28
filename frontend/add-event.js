const API_BASE_URL =
  window.APP_CONFIG?.apiBaseUrl ||
  (window.location.protocol === 'http:' || window.location.protocol === 'https:'
    ? `${window.location.protocol}//${window.location.hostname}:3000`
    : 'http://localhost:3000');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-event-form');
  const errorMsg = document.getElementById('error-message');

  const sportSelect = document.getElementById('sportId');
  const homeTeamSelect = document.getElementById('homeTeamId');
  const awayTeamSelect = document.getElementById('awayTeamId');
  const venueSelect = document.getElementById('venueId');

  const init = async () => {
    await Promise.all([loadSports(), loadVenues()]);
  };

  const loadSports = async () => {
    const res = await fetch(`${API_BASE_URL}/sports`);
    const sports = await res.json();
    sportSelect.innerHTML += sports
      .map((s) => `<option value="${s.id}">${s.name}</option>`)
      .join('');
  };

  const loadVenues = async () => {
    const res = await fetch(`${API_BASE_URL}/venues`);
    const venues = await res.json();
    venueSelect.innerHTML += venues
      .map((v) => `<option value="${v.id}">${v.name} (${v.city})</option>`)
      .join('');
  };

  const loadTeamsForSport = async (sportId) => {
    if (!sportId) {
      homeTeamSelect.innerHTML = '<option value="">Select sport first</option>';
      awayTeamSelect.innerHTML = '<option value="">Select sport first</option>';
      homeTeamSelect.disabled = true;
      awayTeamSelect.disabled = true;
      return;
    }

    const res = await fetch(`${API_BASE_URL}/teams?sportId=${sportId}`);
    const teams = await res.json();

    const teamOptions =
      '<option value="">Select a team</option>' +
      teams.map((t) => `<option value="${t.id}">${t.name}</option>`).join('');

    homeTeamSelect.innerHTML = teamOptions;
    awayTeamSelect.innerHTML = teamOptions;
    homeTeamSelect.disabled = false;
    awayTeamSelect.disabled = false;
  };

  sportSelect.addEventListener('change', (e) => {
    loadTeamsForSport(e.target.value);
  });

  const showError = (msg) => {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    window.scrollTo(0, 0);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';

    const formData = new FormData(form);
    const payload = {
      event_date: formData.get('event_date'),
      event_time: formData.get('event_time'),
      sportId: Number(formData.get('sportId')),
      homeTeamId: Number(formData.get('homeTeamId')),
      awayTeamId: Number(formData.get('awayTeamId')),
      venueId: formData.get('venueId')
        ? Number(formData.get('venueId'))
        : undefined,
      description: formData.get('description') || undefined,
    };

    if (payload.homeTeamId === payload.awayTeamId) {
      return showError('Home team and away team must be different!');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
        throw new Error(errorMessage || 'Failed to create event');
      }

      window.location.href = 'index.html';
    } catch (err) {
      showError(err.message);
    }
  });

  init();
});
