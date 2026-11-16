import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/opportunityDates.js';

const emptyForm = {
  title: '',
  organizer: '',
  officialUrl: '',
  type: 'hackathon',
  mode: 'online',
  eligibilityNotes: '',
  deadline: '',
  lastChecked: '',
  status: 'active',
};

const formFields = [
  ['title', 'Title'],
  ['organizer', 'Organizer'],
  ['officialUrl', 'Official URL'],
  ['type', 'Type'],
  ['mode', 'Mode'],
  ['eligibilityNotes', 'Eligibility notes'],
  ['deadline', 'Deadline'],
  ['lastChecked', 'Last checked'],
];

function dateInputValue(value) {
  return value ? String(value).slice(0, 10) : '';
}

function apiOpportunityData(opportunity, status = opportunity.status) {
  return {
    title: opportunity.title,
    organizer: opportunity.organizer,
    officialUrl: opportunity.officialUrl,
    type: opportunity.type,
    mode: opportunity.mode,
    eligibilityNotes: opportunity.eligibilityNotes,
    deadline: opportunity.deadline,
    lastChecked: opportunity.lastChecked,
    status,
  };
}

async function responseError(response, fallback) {
  try {
    const body = await response.json();
    return typeof body.error?.message === 'string' ? body.error.message : fallback;
  } catch {
    return fallback;
  }
}

function CoordinatorDashboardPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function loadListings() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/opportunities', {
          credentials: 'include',
          signal: controller.signal,
        });
        if (response.status === 401) {
          navigate('/admin/login', { replace: true });
          return;
        }
        if (!response.ok) {
          throw new Error(await responseError(response, 'Could not load opportunities.'));
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('The server returned an invalid opportunities response.');
        }
        setListings(data);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load opportunities.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadListings();
    return () => controller.abort();
  }, [navigate, refreshKey]);

  function openCreateForm() {
    setForm({ ...emptyForm, lastChecked: new Date().toISOString().slice(0, 10) });
    setEditingId('');
    setFormError('');
    setNotice('');
    setFormOpen(true);
  }

  function openEditForm(opportunity) {
    setForm({
      ...apiOpportunityData(opportunity),
      deadline: dateInputValue(opportunity.deadline),
      lastChecked: dateInputValue(opportunity.lastChecked),
    });
    setEditingId(opportunity._id);
    setFormError('');
    setNotice('');
    setFormOpen(true);
  }

  function validateForm() {
    for (const [field, label] of formFields) {
      if (!String(form[field] || '').trim()) {
        return `${label} is required.`;
      }
    }

    try {
      const url = new URL(form.officialUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'Official URL must use HTTP or HTTPS.';
      }
    } catch {
      return 'Enter a valid HTTP or HTTPS URL.';
    }

    const checkedDate = new Date(`${form.lastChecked}T00:00:00.000Z`);
    if (Number.isNaN(checkedDate.getTime())) {
      return 'Enter a valid last-checked date.';
    }
    if (checkedDate > new Date()) {
      return 'Last checked cannot be in the future.';
    }

    return '';
  }

  async function handleSave(event) {
    event.preventDefault();
    setFormError('');
    setError('');
    setNotice('');
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setBusyId('form');
    try {
      const response = await fetch(
        editingId ? `/api/admin/opportunities/${editingId}` : '/api/admin/opportunities',
        {
          method: editingId ? 'PUT' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            officialUrl: form.officialUrl.trim(),
          }),
        }
      );
      if (response.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      if (!response.ok) {
        throw new Error(await responseError(response, 'Could not save this opportunity.'));
      }
      setFormOpen(false);
      setNotice(editingId ? 'Opportunity updated.' : 'Opportunity added.');
      setRefreshKey((key) => key + 1);
    } catch (saveError) {
      setFormError(saveError.message || 'Could not save this opportunity.');
    } finally {
      setBusyId('');
    }
  }

  async function updateListing(opportunity, url, method, body, fallback) {
    setError('');
    setNotice('');
    setBusyId(opportunity._id);
    try {
      const response = await fetch(url, {
        method,
        credentials: 'include',
        ...(body ? {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        } : {}),
      });
      if (response.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      if (!response.ok) {
        throw new Error(await responseError(response, fallback));
      }
      setNotice('Listing updated.');
      setRefreshKey((key) => key + 1);
    } catch (actionError) {
      setError(actionError.message || fallback);
    } finally {
      setBusyId('');
    }
  }

  function handleDelete(opportunity) {
    if (!window.confirm(`Delete "${opportunity.title}"? This cannot be undone.`)) {
      return;
    }
    updateListing(
      opportunity,
      `/api/admin/opportunities/${opportunity._id}`,
      'DELETE',
      null,
      'Could not delete this opportunity.'
    );
  }

  function handleStatusToggle(opportunity) {
    const status = opportunity.status === 'archived' ? 'active' : 'archived';
    updateListing(
      opportunity,
      `/api/admin/opportunities/${opportunity._id}`,
      'PUT',
      apiOpportunityData(opportunity, status),
      'Could not update this opportunity.'
    );
  }

  function handleRecheck(opportunity) {
    updateListing(
      opportunity,
      `/api/admin/opportunities/${opportunity._id}/recheck`,
      'PUT',
      null,
      'Could not update the last-checked date.'
    );
  }

  async function handleLogout() {
    setError('');
    setLoggingOut(true);
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(await responseError(response, 'Could not log out.'));
      }
      navigate('/admin/login', { replace: true });
    } catch (logoutError) {
      setError(logoutError.message || 'Could not log out.');
    } finally {
      setLoggingOut(false);
    }
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="admin-page">
      <section className="admin-heading">
        <div>
          <p className="eyebrow">COORDINATOR PORTAL</p>
          <h1>Manage opportunities</h1>
          <p className="admin-copy">Keep official details current for student builders.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-button admin-button-primary" type="button" onClick={openCreateForm}>
            Add opportunity
          </button>
          <button
            className="admin-button admin-button-secondary"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </section>

      {error && <p className="admin-message admin-message-error" role="alert">{error}</p>}
      {notice && <p className="admin-message" role="status">{notice}</p>}

      {formOpen && (
        <section className="admin-form-card" aria-labelledby="opportunity-form-title">
          <div className="admin-form-heading">
            <h2 id="opportunity-form-title">{editingId ? 'Edit opportunity' : 'Add opportunity'}</h2>
            <button
              className="admin-text-button"
              type="button"
              onClick={() => setFormOpen(false)}
              disabled={busyId === 'form'}
            >
              Cancel
            </button>
          </div>
          <form className="opportunity-form" onSubmit={handleSave} noValidate>
            <label>
              <span>Title</span>
              <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} required />
            </label>
            <label>
              <span>Organizer</span>
              <input value={form.organizer} onChange={(event) => updateForm('organizer', event.target.value)} required />
            </label>
            <label className="form-field-wide">
              <span>Official URL</span>
              <input
                type="text"
                inputMode="url"
                value={form.officialUrl}
                onChange={(event) => updateForm('officialUrl', event.target.value)}
                required
              />
            </label>
            <label>
              <span>Type</span>
              <select value={form.type} onChange={(event) => updateForm('type', event.target.value)} required>
                <option value="hackathon">Hackathon</option>
                <option value="contest">Contest</option>
                <option value="fellowship">Fellowship</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              <span>Mode</span>
              <select value={form.mode} onChange={(event) => updateForm('mode', event.target.value)} required>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label className="form-field-wide">
              <span>Eligibility notes</span>
              <textarea
                rows="3"
                value={form.eligibilityNotes}
                onChange={(event) => updateForm('eligibilityNotes', event.target.value)}
                required
              />
            </label>
            <label>
              <span>Deadline</span>
              <input
                type="date"
                value={form.deadline}
                onChange={(event) => updateForm('deadline', event.target.value)}
                required
              />
            </label>
            <label>
              <span>Last checked</span>
              <input
                type="date"
                value={form.lastChecked}
                onChange={(event) => updateForm('lastChecked', event.target.value)}
                required
              />
            </label>
            {formError && <p className="admin-message admin-message-error form-field-wide" role="alert">{formError}</p>}
            <div className="form-actions form-field-wide">
              <button className="admin-button admin-button-primary" type="submit" disabled={busyId === 'form'}>
                {busyId === 'form' ? 'Saving…' : editingId ? 'Save changes' : 'Add opportunity'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-listings" aria-labelledby="admin-listings-title">
        <div className="admin-listings-heading">
          <div>
            <p className="eyebrow">ALL RECORDS</p>
            <h2 id="admin-listings-title">Listings</h2>
          </div>
          {!loading && <span className="listing-count">{listings.length} total</span>}
        </div>
        {loading && <p className="state-message" role="status">Loading listings…</p>}
        {!loading && !error && listings.length === 0 && (
          <p className="state-message" role="status">No listings yet. Add an opportunity to get started.</p>
        )}
        {!loading && listings.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Listing</th>
                  <th scope="col">Status</th>
                  <th scope="col">Deadline</th>
                  <th scope="col">Last checked</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((opportunity) => (
                  <tr key={opportunity._id}>
                    <td data-label="Listing">
                      <strong>{opportunity.title}</strong>
                      <span className="admin-organizer">{opportunity.organizer}</span>
                    </td>
                    <td data-label="Status">
                      <span className={`admin-status admin-status-${opportunity.status}`}>
                        {opportunity.status}
                      </span>
                    </td>
                    <td data-label="Deadline">{formatDate(opportunity.deadline)}</td>
                    <td data-label="Last checked">{formatDate(opportunity.lastChecked)}</td>
                    <td data-label="Actions">
                      <div className="admin-row-actions">
                        <button
                          className="admin-action-button"
                          type="button"
                          onClick={() => openEditForm(opportunity)}
                          disabled={Boolean(busyId)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-action-button"
                          type="button"
                          onClick={() => handleStatusToggle(opportunity)}
                          disabled={Boolean(busyId)}
                        >
                          {opportunity.status === 'archived' ? 'Restore' : 'Archive'}
                        </button>
                        <button
                          className="admin-action-button"
                          type="button"
                          onClick={() => handleRecheck(opportunity)}
                          disabled={Boolean(busyId)}
                        >
                          Re-checked
                        </button>
                        <button
                          className="admin-action-button admin-action-danger"
                          type="button"
                          onClick={() => handleDelete(opportunity)}
                          disabled={Boolean(busyId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default CoordinatorDashboardPage;
