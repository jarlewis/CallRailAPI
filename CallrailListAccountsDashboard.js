// Import React and useState hook from React
import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

// Define the main component
const CallrailListAccountsDashboard = () => {
  // State variables
  const [apiKey, setApiKey] = useState(''); // Store the API key
  const [accounts, setAccounts] = useState([]); // Store the list of accounts
  const [selectedAccount, setSelectedAccount] = useState(null); // Store the selected account
  const [companies, setCompanies] = useState([]); // Store the list of companies for the selected account
  const [selectedCompany, setSelectedCompany] = useState(null); // Store the selected company
  const [companyDetails, setCompanyDetails] = useState(null); // Store the details of the selected company
  const [trackers, setTrackers] = useState([]); // Store the list of trackers for the selected company
  const [selectedTracker, setSelectedTracker] = useState(null); // Store the selected tracker
  const [loading, setLoading] = useState(false); // Indicate if data is being fetched
  const [error, setError] = useState(null); // Store any error messages
  const [companySearch, setCompanySearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('active');
  const [companySortOrder, setCompanySortOrder] = useState('asc');
  const [companyPage, setCompanyPage] = useState(1);
  const [accountFilter, setAccountFilter] = useState('all');
  const [accountSortOrder, setAccountSortOrder] = useState('asc');
  const [accountPage, setAccountPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [darkMode, setDarkMode] = useState(false); // New state for dark mode

  // State for new company creation form
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyTimeZone, setNewCompanyTimeZone] = useState('America/New_York');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // List of time zones
  const timeZones = [
    "Pacific/Pago_Pago", "Pacific/Midway", "Pacific/Apia", "Pacific/Honolulu",
    "America/Juneau", "America/Los_Angeles", "America/Tijuana", "America/Phoenix",
    "America/Chihuahua", "America/Mazatlan", "America/Denver", "America/Guatemala",
    "America/Chicago", "America/Mexico_City", "America/Monterrey", "America/Regina",
    "America/Bogota", "America/New_York", "America/Indiana/Indianapolis", "America/Lima",
    "America/Halifax", "America/Caracas", "America/Guyana", "America/La_Paz",
    "America/Santiago", "America/St_Johns", "America/Sao_Paulo",
    "America/Argentina/Buenos_Aires", "America/Godthab", "America/Montevideo",
    "Atlantic/South_Georgia", "Atlantic/Azores", "Atlantic/Cape_Verde",
    "Africa/Casablanca", "Europe/Dublin", "Europe/London", "Europe/Lisbon",
    "Africa/Monrovia", "Etc/UTC", "Europe/Amsterdam", "Europe/Belgrade",
    "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels", "Europe/Budapest",
    "Europe/Copenhagen", "Europe/Ljubljana", "Europe/Madrid", "Europe/Paris",
    "Europe/Prague", "Europe/Rome", "Europe/Sarajevo", "Europe/Skopje",
    "Europe/Stockholm", "Europe/Vienna", "Europe/Warsaw", "Africa/Algiers",
    "Europe/Zagreb", "Europe/Athens", "Europe/Bucharest", "Africa/Cairo",
    "Africa/Harare", "Europe/Helsinki", "Asia/Jerusalem", "Europe/Kaliningrad",
    "Europe/Kiev", "Africa/Johannesburg", "Europe/Riga", "Europe/Sofia",
    "Europe/Tallinn", "Europe/Vilnius", "Asia/Baghdad", "Europe/Istanbul",
    "Asia/Kuwait", "Europe/Minsk", "Europe/Moscow", "Africa/Nairobi",
    "Asia/Riyadh", "Europe/Volgograd", "Asia/Tehran", "Asia/Muscat",
    "Asia/Baku", "Europe/Samara", "Asia/Tbilisi", "Asia/Yerevan",
    "Asia/Kabul", "Asia/Yekaterinburg", "Asia/Karachi", "Asia/Tashkent",
    "Asia/Kolkata", "Asia/Colombo", "Asia/Kathmandu", "Asia/Almaty",
    "Asia/Dhaka", "Asia/Urumqi", "Asia/Rangoon", "Asia/Bangkok",
    "Asia/Jakarta", "Asia/Krasnoyarsk", "Asia/Novosibirsk", "Asia/Shanghai",
    "Asia/Chongqing", "Asia/Hong_Kong", "Asia/Irkutsk", "Asia/Kuala_Lumpur",
    "Australia/Perth", "Asia/Singapore", "Asia/Taipei", "Asia/Ulaanbaatar",
    "Asia/Tokyo", "Asia/Seoul", "Asia/Yakutsk", "Australia/Adelaide",
    "Australia/Darwin", "Australia/Brisbane", "Australia/Melbourne", "Pacific/Guam",
    "Australia/Hobart", "Pacific/Port_Moresby", "Australia/Sydney",
    "Asia/Vladivostok", "Asia/Magadan", "Pacific/Noumea", "Pacific/Guadalcanal",
    "Asia/Srednekolymsk", "Pacific/Auckland", "Pacific/Fiji", "Asia/Kamchatka",
    "Pacific/Majuro", "Pacific/Chatham", "Pacific/Tongatapu", "Pacific/Fakaofo"
  ];

  // Add these new state variables near the top of your component
  const [trackerPage, setTrackerPage] = useState(1);
  const [trackerTotalPages, setTrackerTotalPages] = useState(1);
  const [trackerSearch, setTrackerSearch] = useState('');
  const [showCreateTrackerForm, setShowCreateTrackerForm] = useState(false);
  const [newTrackerName, setNewTrackerName] = useState('');
  const [newTrackerType, setNewTrackerType] = useState('source');

  // Near the top of your component
  const debouncedSearch = debounce((value) => {
    setTrackerSearch(value);
    setTrackerPage(1); // Reset to first page when search changes
  }, 300);

  // Function to fetch accounts from the API
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.callrail.com/v3/a.json?page=${accountPage}&sort=${accountSortOrder === 'asc' ? 'name' : '-name'}${accountFilter !== 'all' ? `&hipaa_account=${accountFilter === 'hipaa'}` : ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAccounts(data.accounts);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch companies for a specific account
  const fetchCompanies = async (accountId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.callrail.com/v3/a/${accountId}/companies.json?status=active`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCompanies(data.companies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch details for a specific company
  const fetchCompanyDetails = async (accountId, companyId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.callrail.com/v3/a/${accountId}/companies/${companyId}.json`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCompanyDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the fetchTrackers function to include pagination
  const fetchTrackers = async (accountId, companyId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.callrail.com/v3/a/${accountId}/trackers.json?company_id=${companyId}&status=${trackerFilter}&page=${trackerPage}&search=${encodeURIComponent(trackerSearch)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTrackers(data.trackers);
      setTrackerTotalPages(data.total_pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch tracker details
  const fetchTrackerDetails = async (accountId, trackerId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.callrail.com/v3/a/${accountId}/trackers/${trackerId}.json`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedTracker(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler for when an account is clicked
  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setSelectedCompany(null);
    setCompanyDetails(null);
    setTrackers([]);
    fetchCompanies(account.id);
  };

  // Modify the handleCompanyClick function
  const handleCompanyClick = (company) => {
    console.log('Company clicked:', company);
    setSelectedCompany(company);
    fetchCompanyDetails(selectedAccount.id, company.id);
    fetchTrackers(selectedAccount.id, company.id);
    setTrackerFilter('all'); // Reset the tracker filter when a new company is selected
  };

  // Modify handleBack function
  const handleBack = () => {
    if (selectedTracker) {
      setSelectedTracker(null);
    } else if (selectedCompany) {
      setSelectedCompany(null);
      setCompanyDetails(null);
      setTrackers([]);
    } else {
      setSelectedAccount(null);
      setCompanies([]);
    }
  };

  // New function to handle tracker click
  const handleTrackerClick = (tracker) => {
    setSelectedTracker(tracker);
    setEditingTracker(JSON.parse(JSON.stringify(tracker))); // Deep copy
  };

  // Update the useEffect hook to refetch trackers when the page or filter changes
  useEffect(() => {
    if (selectedCompany) {
      fetchTrackers(selectedAccount.id, selectedCompany.id);
    }
  }, [selectedCompany, trackerPage, trackerFilter, trackerSearch]);

  // Effect to refetch companies when filters change
  useEffect(() => {
    if (selectedAccount) {
      fetchCompanies(selectedAccount.id);
    }
  }, [companyFilter, companySortOrder, companyPage]);

  // Effect to refetch accounts when filters change
  useEffect(() => {
    if (apiKey) {
      fetchAccounts();
    }
  }, [accountFilter, accountSortOrder, accountPage]);

  // Function to filter and sort companies
  const filteredAndSortedCompanies = companies
    .filter(company => company.name.toLowerCase().includes(companySearch.toLowerCase()))
    .filter(company => companyFilter === 'all' || company.status === companyFilter)
    .sort((a, b) => {
      if (companySortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  // Function to handle company creation
  const handleCreateCompany = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make API call to create new company
      const response = await fetch(`https://api.callrail.com/v3/a/${selectedAccount.id}/companies.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCompanyName,
          time_zone: newCompanyTimeZone,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add new company to the list and reset form
      setCompanies([...companies, data]);
      setNewCompanyName('');
      setNewCompanyTimeZone('America/New_York');
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [editingTracker, setEditingTracker] = useState(null);
  const [sourceType, setSourceType] = useState('all');
  const [trackerFilter, setTrackerFilter] = useState('all');

  /**
   * Handles the update of a tracker.
   * Sends the updated tracker data to the API and updates the local state.
   */
  const handleUpdateTracker = async () => {
    setLoading(true);
    setError(null);

    try {
      let trackerData = { ...editingTracker };

      // Handle source tracker specific fields
      if (trackerData.type === 'source') {
        // Ensure the source object exists
        trackerData.source = trackerData.source || {};

        // Handle web_referrer specifically
        if (trackerData.source.type === 'web_referrer') {
          trackerData.source = {
            type: 'web_referrer',
            referrer: trackerData.source.referrer || ''
          };
        }

        // Handle other source types similarly
        // ...
      }

      const response = await fetch(`https://api.callrail.com/v3/a/${selectedAccount.id}/trackers/${selectedTracker.id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackerData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTracker = await response.json();
      setTrackers(trackers.map(t => t.id === updatedTracker.id ? updatedTracker : t));
      setSelectedTracker(updatedTracker);
      setEditingTracker(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders the appropriate form for editing a tracker based on its type.
   * @returns {JSX.Element|null} The form JSX or null if no tracker is being edited.
   */
  const renderTrackerForm = () => {
    if (!editingTracker) return null;

    return (
      <form onSubmit={(e) => { e.preventDefault(); handleUpdateTracker(); }}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={editingTracker.name || ''}
            onChange={(e) => setEditingTracker({...editingTracker, name: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <input
            type="text"
            value={editingTracker.type || ''}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destination Number</label>
          <input
            type="text"
            value={editingTracker.destination_number || ''}
            onChange={(e) => setEditingTracker({...editingTracker, destination_number: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tracking Numbers</label>
          {editingTracker.tracking_phone_numbers?.map((number, index) => (
            <input
              key={index}
              type="text"
              value={number.formatted_phone_number || ''}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Whisper Message</label>
          <input
            type="text"
            value={editingTracker.whisper_message || ''}
            onChange={(e) => setEditingTracker({...editingTracker, whisper_message: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={editingTracker.sms_enabled || false}
              onChange={(e) => setEditingTracker({...editingTracker, sms_enabled: e.target.checked})}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS Enabled</span>
          </label>
        </div>

        {editingTracker.type === 'source' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source Type</label>
              <select
                value={editingTracker.source?.type || ''}
                onChange={(e) => setEditingTracker({
                  ...editingTracker,
                  source: e.target.value === 'all' ? 'all' : {type: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a source type</option>
                <option value="all">All Sources</option>
                <option value="web_referrer">Web Referrer</option>
                <option value="search">Search</option>
                <option value="direct">Direct</option>
                <option value="offline">Offline</option>
                <option value="organic">Organic</option>
                <option value="ppc">Pay-Per-Click</option>
                <option value="landing_params">Landing Params</option>
                <option value="landing_url">Landing URL</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Campaign Name</label>
              <input
                type="text"
                value={editingTracker.campaign_name || ''}
                onChange={(e) => setEditingTracker({...editingTracker, campaign_name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {editingTracker.source?.type === 'web_referrer' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Referring URL</label>
                <input
                  type="text"
                  value={editingTracker.source?.referrer || ''}
                  onChange={(e) => setEditingTracker({
                    ...editingTracker,
                    source: {...editingTracker.source, referrer: e.target.value}
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            {editingTracker.source?.type === 'search' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Engine</label>
                  <select
                    value={editingTracker.source?.search_engine || ''}
                    onChange={(e) => setEditingTracker({
                      ...editingTracker,
                      source: {...editingTracker.source, search_engine: e.target.value}
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select a search engine</option>
                    <option value="all">All Search Engines</option>
                    <option value="google">Google</option>
                    <option value="yahoo">Yahoo</option>
                    <option value="bing">Bing</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Traffic Type</label>
                  <select
                    value={editingTracker.source?.search_type || ''}
                    onChange={(e) => setEditingTracker({
                      ...editingTracker,
                      source: {...editingTracker.source, search_type: e.target.value}
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select a search traffic type</option>
                    <option value="all">All Traffic Types</option>
                    <option value="paid">Paid</option>
                    <option value="organic">Organic</option>
                  </select>
                </div>
              </>
            )}

            {editingTracker.source?.type === 'landing_params' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Landing Params</label>
                <input
                  type="text"
                  value={editingTracker.source?.landing_params || ''}
                  onChange={(e) => setEditingTracker({
                    ...editingTracker,
                    source: {...editingTracker.source, landing_params: e.target.value}
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            {editingTracker.source?.type === 'landing_url' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Landing URL</label>
                <input
                  type="text"
                  value={editingTracker.source?.landing_url || ''}
                  onChange={(e) => setEditingTracker({
                    ...editingTracker,
                    source: {...editingTracker.source, landing_url: e.target.value}
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingTracker.record_calls || false}
                  onChange={(e) => setEditingTracker({...editingTracker, record_calls: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Record Calls</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingTracker.play_disclaimer || false}
                  onChange={(e) => setEditingTracker({...editingTracker, play_disclaimer: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Play Disclaimer</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingTracker.voicemail_enabled || false}
                  onChange={(e) => setEditingTracker({...editingTracker, voicemail_enabled: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voicemail Enabled</span>
              </label>
            </div>
          </>
        )}

        {editingTracker.type === 'session' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sources</label>
              {isMobile ? (
                <div className="space-y-2">
                  {[
                    {value: "all", label: "All Sources"},
                    {value: "direct", label: "Direct"},
                    {value: "landing", label: "Landing"},
                    {value: "referrer", label: "Referrer"},
                    {value: "google_ad_extension", label: "Google Ad Extension"},
                    {value: "mobile_ad_extension", label: "Mobile Ad Extension"},
                    {value: "google_my_business", label: "Google My Business"},
                    {value: "google_paid", label: "Google: Paid"},
                    {value: "google_organic", label: "Google: Organic"},
                    {value: "yahoo_paid", label: "Yahoo: Paid"},
                    {value: "yahoo_organic", label: "Yahoo: Organic"},
                    {value: "bing_paid", label: "Bing: Paid"},
                    {value: "bing_organic", label: "Bing: Organic"}
                  ].map((source) => (
                    <label key={source.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={source.value}
                        checked={(editingTracker.sources || []).includes(source.value)}
                        onChange={(e) => {
                          const updatedSources = e.target.checked
                            ? [...(editingTracker.sources || []), source.value]
                            : (editingTracker.sources || []).filter(s => s !== source.value);
                          setEditingTracker({...editingTracker, sources: updatedSources});
                        }}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{source.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <select
                  multiple
                  value={editingTracker.sources || []}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setEditingTracker({...editingTracker, sources: selectedOptions});
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Sources</option>
                  <option value="direct">Direct</option>
                  <option value="landing">Landing</option>
                  <option value="referrer">Referrer</option>
                  <option value="google_ad_extension">Google Ad Extension</option>
                  <option value="mobile_ad_extension">Mobile Ad Extension</option>
                  <option value="google_my_business">Google My Business</option>
                  <option value="google_paid">Google: Paid</option>
                  <option value="google_organic">Google: Organic</option>
                  <option value="yahoo_paid">Yahoo: Paid</option>
                  <option value="yahoo_organic">Yahoo: Organic</option>
                  <option value="bing_paid">Bing: Paid</option>
                  <option value="bing_organic">Bing: Organic</option>
                </select>
              )}
              {!isMobile && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Hold Ctrl (Windows) or Cmd (Mac) to select multiple options</p>}
            </div>

            {(editingTracker.sources || []).includes('referrer') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Referrer URL</label>
                <input
                  type="text"
                  value={editingTracker.referrer_url || ''}
                  onChange={(e) => setEditingTracker({...editingTracker, referrer_url: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter referrer URL"
                />
              </div>
            )}

            {(editingTracker.sources || []).includes('landing') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Landing URL</label>
                <input
                  type="text"
                  value={editingTracker.landing_url || ''}
                  onChange={(e) => setEditingTracker({...editingTracker, landing_url: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter landing URL"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingTracker.inverted || false}
                  onChange={(e) => setEditingTracker({...editingTracker, inverted: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  All sources except for the selected sources
                </span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pool Size</label>
              <input
                type="number"
                value={editingTracker.pool_size || ''}
                onChange={(e) => setEditingTracker({...editingTracker, pool_size: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* ... other session tracker specific fields ... */}
          </>
        )}

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Update Tracker
        </button>
      </form>
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add this import at the top of your file
  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      media.addListener(listener);
      return () => media.removeListener(listener);
    }, [matches, query]);

    return matches;
  }

  // In your component's render method
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Render the component
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-800 text-white' : 'bg-gray-100'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">CallRail Dashboard</h1>
        
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300 ease-in-out"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Back button */}
        {(selectedAccount || selectedCompany || selectedTracker) && (
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            ← Back
          </button>
        )}

        {/* API Key input and fetch accounts button */}
        {!selectedAccount && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">API Configuration</h2>
            <input
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
            />
            <button 
              onClick={fetchAccounts} 
              disabled={!apiKey || loading}
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition duration-300 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-400"
            >
              {loading ? 'Loading...' : 'Fetch Accounts'}
            </button>
          </div>
        )}
        
        {/* Error message display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {/* Account list */}
        {!selectedAccount && accounts.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Accounts</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {accounts.map((account) => (
                <li 
                  key={account.id} 
                  className="py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150 ease-in-out"
                  onClick={() => handleAccountClick(account)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-lg dark:text-white">{account.name}</strong>
                      <p className="text-sm text-gray-500 dark:text-gray-300">ID: {account.id}</p>
                    </div>
                    <span className="text-blue-500">→</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Company list and create form */}
        {selectedAccount && !selectedCompany && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            {/* Header with create company button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Companies for {selectedAccount.name}</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out dark:bg-green-600 dark:hover:bg-green-700"
              >
                {showCreateForm ? 'Cancel' : 'Create Company'}
              </button>
            </div>

            {/* Company creation form */}
            {showCreateForm && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Create New Company</h3>
                {/* Company name input */}
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                />
                {/* Time zone selection */}
                <select
                  value={newCompanyTimeZone}
                  onChange={(e) => setNewCompanyTimeZone(e.target.value)}
                  className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                >
                  {timeZones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
                {/* Create company button */}
                <button
                  onClick={handleCreateCompany}
                  disabled={!newCompanyName || loading}
                  className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition duration-300 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-400"
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            )}

            {/* Company filters */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search companies"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="p-2 border rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
              />
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="mr-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
              >
                <option value="active">Active Companies</option>
                <option value="all">All Companies</option>
                <option value="disabled">Disabled Companies</option>
              </select>
              <button
                onClick={() => setCompanySortOrder(companySortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Sort {companySortOrder === 'asc' ? '↑' : '↓'}
              </button>
              <button
                onClick={() => setCompanyPage(prev => Math.max(1, prev - 1))}
                disabled={companyPage === 1}
                className="ml-2 p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-100 transition duration-300 ease-in-out dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:disabled:bg-gray-500"
              >
                Previous Page
              </button>
              <button
                onClick={() => setCompanyPage(prev => prev + 1)}
                className="ml-2 p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Next Page
              </button>
            </div>

            {/* List of companies */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredAndSortedCompanies.map((company) => (
                <li 
                  key={company.id} 
                  className="py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150 ease-in-out"
                  onClick={() => handleCompanyClick(company)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-lg dark:text-white">{company.name}</strong>
                      <p className="text-sm text-gray-500 dark:text-gray-300">ID: {company.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Time Zone: {company.time_zone}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Created: {new Date(company.created_at).toLocaleString()}</p>
                      {company.disabled_at && (
                        <p className="text-sm text-red-500">Disabled: {new Date(company.disabled_at).toLocaleString()}</p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-300">DNI Active: {company.dni_active === null ? 'N/A' : company.dni_active ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">CallScore Enabled: {company.callscore_enabled ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Lead Scoring Enabled: {company.lead_scoring_enabled ? 'Yes' : 'No'}</p>
                    </div>
                    <span className="text-blue-500">→</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tracker list */}
        {selectedCompany && !selectedTracker && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Trackers for {selectedCompany.name}</h2>
            <select
              value={trackerFilter}
              onChange={(e) => setTrackerFilter(e.target.value)}
              className="mb-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
            >
              <option value="active">Active Trackers</option>
              <option value="all">All Trackers</option>
              <option value="disabled">Disabled Trackers</option>
            </select>
            {trackers.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {trackers
                  .filter(tracker => trackerFilter === 'all' || tracker.status === trackerFilter)
                  .map((tracker) => (
                    <li 
                      key={tracker.id} 
                      className="py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150 ease-in-out"
                      onClick={() => handleTrackerClick(tracker)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <strong className="text-lg dark:text-white">{tracker.name}</strong>
                          <p className="text-sm text-gray-500 dark:text-gray-300">ID: {tracker.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">Type: {tracker.type}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">Number: {tracker.tracking_phone_number}</p>
                        </div>
                        <span className="text-blue-500">→</span>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="dark:text-white">No trackers found for this company.</p>
            )}
          </div>
        )}

        {/* Tracker details */}
        {selectedTracker && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {selectedTracker.type === 'session' ? 'Session' : 'Source'} Tracker: {selectedTracker.name}
            </h2>
            {editingTracker ? (
              renderTrackerForm()
            ) : (
              <div>
                <p className="dark:text-white">Type: {selectedTracker.type}</p>
                <p className="dark:text-white">Name: {selectedTracker.name}</p>
                <p className="dark:text-white">Whisper Message: {selectedTracker.whisper_message}</p>
                <p className="dark:text-white">SMS Enabled: {selectedTracker.sms_enabled ? 'Yes' : 'No'}</p>
                {selectedTracker.type === 'session' && (
                  <p className="dark:text-white">Pool Size: {selectedTracker.pool_size}</p>
                )}
                {selectedTracker.type === 'source' && (
                  <>
                    <p className="dark:text-white">Campaign Name: {selectedTracker.campaign_name}</p>
                    <p className="dark:text-white">Source Type: {selectedTracker.source?.type}</p>
                  </>
                )}
                {/* Display more tracker details */}
                <button
                  onClick={() => setEditingTracker(JSON.parse(JSON.stringify(selectedTracker)))}
                  className="mt-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ease-in-out dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Edit Tracker
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallrailListAccountsDashboard;