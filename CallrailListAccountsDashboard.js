// Import React and hooks
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    disabled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
      {status}
    </span>
  );
};

// Loading skeleton component
const LoadingSkeleton = ({ rows = 3 }) => (
  <div className="animate-pulse space-y-4">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

// Notification component
const Notification = ({ type, message, onClose }) => {
  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-200',
    error: 'bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-200',
    info: 'bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200',
  };

  useEffect(() => {
    if (type === 'success' || type === 'info') {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div className={`mb-4 p-4 border-l-4 rounded-r ${typeStyles[type]} flex justify-between items-center`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-lg font-bold hover:opacity-70">&times;</button>
    </div>
  );
};

// Breadcrumb component
const Breadcrumb = ({ items, onNavigate }) => (
  <nav className="flex mb-6" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      {items.map((item, index) => (
        <li key={index} className="inline-flex items-center">
          {index > 0 && (
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          )}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {index === 0 && (
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
              )}
              {item.label}
            </button>
          ) : (
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
      >
        Previous
      </button>
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => page !== '...' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-2 text-sm font-medium border ${
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : page === '...'
              ? 'bg-white text-gray-400 border-gray-300 cursor-default dark:bg-gray-700 dark:text-gray-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
      >
        Next
      </button>
    </div>
  );
};

// Tab component for switching between trackers and calls
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      active
        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

// Call direction badge
const CallDirectionBadge = ({ direction }) => {
  const isInbound = direction === 'inbound';
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
      isInbound
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }`}>
      {isInbound ? '↓' : '↑'} {direction}
    </span>
  );
};

// Format phone number helper
const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  return phone;
};

// Format duration helper
const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Define the main component
const CallrailListAccountsDashboard = () => {
  // State variables
  const [apiKey, setApiKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [trackers, setTrackers] = useState([]);
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [companySearch, setCompanySearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('active');
  const [companySortOrder, setCompanySortOrder] = useState('asc');
  const [companyPage, setCompanyPage] = useState(1);
  const [companyTotalPages, setCompanyTotalPages] = useState(1);
  const [accountFilter, setAccountFilter] = useState('all');
  const [accountSortOrder, setAccountSortOrder] = useState('asc');
  const [accountPage, setAccountPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // State for new company creation form
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyTimeZone, setNewCompanyTimeZone] = useState('America/New_York');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Calls state
  const [calls, setCalls] = useState([]);
  const [callsPage, setCallsPage] = useState(1);
  const [callsTotalPages, setCallsTotalPages] = useState(1);
  const [callsLoading, setCallsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('trackers');
  const [callDateFilter, setCallDateFilter] = useState('last_7_days');

  // Rate limit state
  const [rateLimitRemaining, setRateLimitRemaining] = useState(null);

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

  // Tracker state
  const [trackerPage, setTrackerPage] = useState(1);
  const [trackerTotalPages, setTrackerTotalPages] = useState(1);
  const [trackerSearch, setTrackerSearch] = useState('');
  const [trackerSearchInput, setTrackerSearchInput] = useState('');
  const [showCreateTrackerForm, setShowCreateTrackerForm] = useState(false);
  const [newTrackerName, setNewTrackerName] = useState('');
  const [newTrackerType, setNewTrackerType] = useState('source');

  // Debounced search for trackers
  const debouncedTrackerSearch = useCallback(
    debounce((value) => {
      setTrackerSearch(value);
      setTrackerPage(1);
    }, 300),
    []
  );

  // Handle rate limiting from response headers
  const handleRateLimit = (response) => {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining) {
      setRateLimitRemaining(parseInt(remaining, 10));
    }
  };

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  // Function to fetch accounts from the API
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);

    if (!apiKey) {
      setError('API key is required');
      setLoading(false);
      return;
    }

    try {
      const url = `/api/v3/a.json?page=${accountPage}&sort=${accountSortOrder === 'asc' ? 'name' : '-name'}${accountFilter !== 'all' ? `&hipaa_account=${accountFilter === 'hipaa'}` : ''}`;

      const headers = new Headers({
        'Authorization': `Token token=${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: 'omit'
      });

      handleRateLimit(response);

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.accounts)) {
        throw new Error('Invalid response format from API');
      }

      setAccounts(data.accounts);
      setTotalPages(data.total_pages || 1);
      showNotification('success', `Loaded ${data.accounts.length} accounts`);
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to CallRail API. Please check your internet connection and ensure you have the correct API permissions.');
      } else {
        setError(err.message || 'Failed to fetch accounts. Please check your API key and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch companies for a specific account
  const fetchCompanies = async (accountId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v3/a/${accountId}/companies.json?status=${companyFilter}&page=${companyPage}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit'
      });

      handleRateLimit(response);

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      setCompanies(data.companies || []);
      setCompanyTotalPages(data.total_pages || 1);
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
      const response = await fetch(`/api/v3/a/${accountId}/companies/${companyId}.json`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit'
      });

      handleRateLimit(response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      setCompanyDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch trackers
  const fetchTrackers = async (accountId, companyId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v3/a/${accountId}/trackers.json?company_id=${companyId}&status=${trackerFilter}&page=${trackerPage}&search=${encodeURIComponent(trackerSearch)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit'
      });

      handleRateLimit(response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      setTrackers(data.trackers || []);
      setTrackerTotalPages(data.total_pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch calls
  const fetchCalls = async (accountId, companyId) => {
    setCallsLoading(true);

    try {
      // Calculate date range based on filter
      const endDate = new Date();
      let startDate = new Date();

      switch (callDateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'last_7_days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'last_30_days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'last_90_days':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const formatDate = (date) => date.toISOString().split('T')[0];

      const response = await fetch(
        `/api/v3/a/${accountId}/calls.json?company_id=${companyId}&page=${callsPage}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&per_page=25`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Token token=${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'omit'
        }
      );

      handleRateLimit(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCalls(data.calls || []);
      setCallsTotalPages(data.total_pages || 1);
    } catch (err) {
      showNotification('error', 'Failed to fetch calls: ' + err.message);
    } finally {
      setCallsLoading(false);
    }
  };

  // Function to fetch tracker details
  const fetchTrackerDetails = async (accountId, trackerId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v3/a/${accountId}/trackers/${trackerId}.json`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
      });

      handleRateLimit(response);

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
    setCalls([]);
    setActiveTab('trackers');
    fetchCompanies(account.id);
  };

  // Handler for company click
  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    fetchCompanyDetails(selectedAccount.id, company.id);
    fetchTrackers(selectedAccount.id, company.id);
    setTrackerFilter('all');
    setActiveTab('trackers');
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'calls' && calls.length === 0) {
      fetchCalls(selectedAccount.id, selectedCompany.id);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (selectedTracker) {
      setSelectedTracker(null);
    } else if (selectedCompany) {
      setSelectedCompany(null);
      setCompanyDetails(null);
      setTrackers([]);
      setCalls([]);
    } else {
      setSelectedAccount(null);
      setCompanies([]);
    }
  };

  // Navigation to specific level
  const navigateToAccounts = () => {
    setSelectedAccount(null);
    setSelectedCompany(null);
    setSelectedTracker(null);
    setCompanies([]);
    setTrackers([]);
    setCalls([]);
  };

  const navigateToCompanies = () => {
    setSelectedCompany(null);
    setSelectedTracker(null);
    setTrackers([]);
    setCalls([]);
  };

  // Handle tracker click
  const handleTrackerClick = (tracker) => {
    setSelectedTracker(tracker);
    setEditingTracker(JSON.parse(JSON.stringify(tracker)));
  };

  // Build breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Accounts', onClick: accounts.length > 0 ? navigateToAccounts : null }
    ];

    if (selectedAccount) {
      items.push({
        label: selectedAccount.name,
        onClick: selectedCompany ? navigateToCompanies : null
      });
    }

    if (selectedCompany) {
      items.push({
        label: selectedCompany.name,
        onClick: selectedTracker ? () => setSelectedTracker(null) : null
      });
    }

    if (selectedTracker) {
      items.push({ label: selectedTracker.name });
    }

    return items;
  };

  // Effects for refetching data
  useEffect(() => {
    if (selectedCompany) {
      fetchTrackers(selectedAccount.id, selectedCompany.id);
    }
  }, [selectedCompany, trackerPage, trackerFilter, trackerSearch]);

  useEffect(() => {
    if (selectedAccount) {
      fetchCompanies(selectedAccount.id);
    }
  }, [companyFilter, companySortOrder, companyPage]);

  useEffect(() => {
    if (apiKey && accounts.length > 0) {
      fetchAccounts();
    }
  }, [accountFilter, accountSortOrder, accountPage]);

  useEffect(() => {
    if (activeTab === 'calls' && selectedCompany) {
      fetchCalls(selectedAccount.id, selectedCompany.id);
    }
  }, [callsPage, callDateFilter, activeTab]);

  // Filter and sort companies
  const filteredAndSortedCompanies = companies
    .filter(company => company.name.toLowerCase().includes(companySearch.toLowerCase()))
    .sort((a, b) => {
      if (companySortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  // Company creation handler
  const handleCreateCompany = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v3/a/${selectedAccount.id}/companies.json`, {
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

      handleRateLimit(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCompanies([...companies, data]);
      setNewCompanyName('');
      setNewCompanyTimeZone('America/New_York');
      setShowCreateForm(false);
      showNotification('success', `Company "${data.name}" created successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [editingTracker, setEditingTracker] = useState(null);
  const [sourceType, setSourceType] = useState('all');
  const [trackerFilter, setTrackerFilter] = useState('all');

  // Update tracker handler
  const handleUpdateTracker = async () => {
    setLoading(true);
    setError(null);

    try {
      let trackerData = { ...editingTracker };

      if (trackerData.type === 'source') {
        trackerData.source = trackerData.source || {};
        if (trackerData.source.type === 'web_referrer') {
          trackerData.source = {
            type: 'web_referrer',
            referrer: trackerData.source.referrer || ''
          };
        }
      }

      const response = await fetch(`/api/v3/a/${selectedAccount.id}/trackers/${selectedTracker.id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackerData),
      });

      handleRateLimit(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTracker = await response.json();
      setTrackers(trackers.map(t => t.id === updatedTracker.id ? updatedTracker : t));
      setSelectedTracker(updatedTracker);
      setEditingTracker(null);
      showNotification('success', 'Tracker updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render tracker form
  const renderTrackerForm = () => {
    if (!editingTracker) return null;

    return (
      <form onSubmit={(e) => { e.preventDefault(); handleUpdateTracker(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={editingTracker.name || ''}
            onChange={(e) => setEditingTracker({...editingTracker, name: e.target.value})}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <input
            type="text"
            value={editingTracker.type || ''}
            readOnly
            className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination Number</label>
          <input
            type="text"
            value={editingTracker.destination_number || ''}
            onChange={(e) => setEditingTracker({...editingTracker, destination_number: e.target.value})}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tracking Numbers</label>
          <div className="space-y-2">
            {editingTracker.tracking_phone_numbers?.map((number, index) => (
              <input
                key={index}
                type="text"
                value={number.formatted_phone_number || ''}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Whisper Message</label>
          <input
            type="text"
            value={editingTracker.whisper_message || ''}
            onChange={(e) => setEditingTracker({...editingTracker, whisper_message: e.target.value})}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="sms_enabled"
            checked={editingTracker.sms_enabled || false}
            onChange={(e) => setEditingTracker({...editingTracker, sms_enabled: e.target.checked})}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="sms_enabled" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            SMS Enabled
          </label>
        </div>

        {editingTracker.type === 'source' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Type</label>
              <select
                value={editingTracker.source?.type || ''}
                onChange={(e) => setEditingTracker({
                  ...editingTracker,
                  source: e.target.value === 'all' ? 'all' : {type: e.target.value}
                })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Name</label>
              <input
                type="text"
                value={editingTracker.campaign_name || ''}
                onChange={(e) => setEditingTracker({...editingTracker, campaign_name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {editingTracker.source?.type === 'web_referrer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referring URL</label>
                <input
                  type="text"
                  value={editingTracker.source?.referrer || ''}
                  onChange={(e) => setEditingTracker({
                    ...editingTracker,
                    source: {...editingTracker.source, referrer: e.target.value}
                  })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            {editingTracker.source?.type === 'search' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Engine</label>
                  <select
                    value={editingTracker.source?.search_engine || ''}
                    onChange={(e) => setEditingTracker({
                      ...editingTracker,
                      source: {...editingTracker.source, search_engine: e.target.value}
                    })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select a search engine</option>
                    <option value="all">All Search Engines</option>
                    <option value="google">Google</option>
                    <option value="yahoo">Yahoo</option>
                    <option value="bing">Bing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Traffic Type</label>
                  <select
                    value={editingTracker.source?.search_type || ''}
                    onChange={(e) => setEditingTracker({
                      ...editingTracker,
                      source: {...editingTracker.source, search_type: e.target.value}
                    })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Landing Params</label>
                <input
                  type="text"
                  value={editingTracker.source?.landing_params || ''}
                  onChange={(e) => setEditingTracker({
                    ...editingTracker,
                    source: {...editingTracker.source, landing_params: e.target.value}
                  })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            {editingTracker.source?.type === 'landing_url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Landing URL</label>
                <input
                  type="text"
                  value={editingTracker.source?.landing_url || ''}
                  onChange={(e) => setEditingTracker({
                    ...editingTracker,
                    source: {...editingTracker.source, landing_url: e.target.value}
                  })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="record_calls"
                  checked={editingTracker.record_calls || false}
                  onChange={(e) => setEditingTracker({...editingTracker, record_calls: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="record_calls" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Record Calls
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="play_disclaimer"
                  checked={editingTracker.play_disclaimer || false}
                  onChange={(e) => setEditingTracker({...editingTracker, play_disclaimer: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="play_disclaimer" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Play Disclaimer
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="voicemail_enabled"
                  checked={editingTracker.voicemail_enabled || false}
                  onChange={(e) => setEditingTracker({...editingTracker, voicemail_enabled: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="voicemail_enabled" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Voicemail Enabled
                </label>
              </div>
            </div>
          </>
        )}

        {editingTracker.type === 'session' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sources</label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-lg dark:border-gray-600">
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
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{source.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(editingTracker.sources || []).includes('referrer') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referrer URL</label>
                <input
                  type="text"
                  value={editingTracker.referrer_url || ''}
                  onChange={(e) => setEditingTracker({...editingTracker, referrer_url: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter referrer URL"
                />
              </div>
            )}

            {(editingTracker.sources || []).includes('landing') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Landing URL</label>
                <input
                  type="text"
                  value={editingTracker.landing_url || ''}
                  onChange={(e) => setEditingTracker({...editingTracker, landing_url: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter landing URL"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="inverted"
                checked={editingTracker.inverted || false}
                onChange={(e) => setEditingTracker({...editingTracker, inverted: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="inverted" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                All sources except for the selected sources
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pool Size</label>
              <input
                type="number"
                value={editingTracker.pool_size || ''}
                onChange={(e) => setEditingTracker({...editingTracker, pool_size: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Tracker'}
          </button>
          <button
            type="button"
            onClick={() => setEditingTracker(null)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  // Render calls list
  const renderCallsList = () => {
    if (callsLoading) {
      return <LoadingSkeleton rows={5} />;
    }

    return (
      <div>
        {/* Date filter */}
        <div className="mb-4 flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range:</label>
          <select
            value={callDateFilter}
            onChange={(e) => {
              setCallDateFilter(e.target.value);
              setCallsPage(1);
            }}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="today">Today</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
          </select>
        </div>

        {calls.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Date/Time</th>
                    <th className="px-4 py-3">Direction</th>
                    <th className="px-4 py-3">Caller</th>
                    <th className="px-4 py-3">Tracking #</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {calls.map((call) => (
                    <tr key={call.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {new Date(call.start_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <CallDirectionBadge direction={call.direction} />
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        <div>{call.customer_name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{formatPhoneNumber(call.customer_phone_number)}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {formatPhoneNumber(call.tracking_phone_number)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {formatDuration(call.duration)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {call.source || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={callsPage}
              totalPages={callsTotalPages}
              onPageChange={setCallsPage}
            />
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="mt-2">No calls found for this date range</p>
          </div>
        )}
      </div>
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Media query hook
  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
  };

  const isMobile = useMediaQuery('(max-width: 768px)');

  // Render
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CallRail Dashboard</h1>
            {rateLimitRemaining !== null && rateLimitRemaining < 100 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                API Rate Limit: {rateLimitRemaining} requests remaining
              </p>
            )}
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Notifications */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Error display */}
        {error && (
          <Notification
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Breadcrumb navigation */}
        {(selectedAccount || accounts.length > 0) && (
          <Breadcrumb items={getBreadcrumbItems()} />
        )}

        {/* API Configuration */}
        {!selectedAccount && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">API Configuration</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter your CallRail API key to connect to your account. You can find your API key in your CallRail account settings.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button
                onClick={fetchAccounts}
                disabled={!apiKey || loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Account list */}
        {!selectedAccount && accounts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select an Account</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose an account to view its companies and trackers</p>
            </div>
            {loading ? (
              <div className="p-6">
                <LoadingSkeleton rows={4} />
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {accounts.map((account) => (
                  <li
                    key={account.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleAccountClick(account)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{account.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: {account.id}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Pagination
              currentPage={accountPage}
              totalPages={totalPages}
              onPageChange={setAccountPage}
            />
          </div>
        )}

        {/* Company list */}
        {selectedAccount && !selectedCompany && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Companies</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {filteredAndSortedCompanies.length} companies found
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {showCreateForm ? 'Cancel' : 'New Company'}
                </button>
              </div>
            </div>

            {/* Create company form */}
            {showCreateForm && (
              <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Company</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Zone</label>
                    <select
                      value={newCompanyTimeZone}
                      onChange={(e) => setNewCompanyTimeZone(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    >
                      {timeZones.map((zone) => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCreateCompany}
                  disabled={!newCompanyName || loading}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            )}

            {/* Company filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                <select
                  value={companyFilter}
                  onChange={(e) => {
                    setCompanyFilter(e.target.value);
                    setCompanyPage(1);
                  }}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="active">Active</option>
                  <option value="all">All</option>
                  <option value="disabled">Disabled</option>
                </select>
                <button
                  onClick={() => setCompanySortOrder(companySortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title={`Sort ${companySortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {companySortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                </button>
              </div>
            </div>

            {/* Company list */}
            {loading ? (
              <div className="p-6">
                <LoadingSkeleton rows={4} />
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedCompanies.map((company) => (
                  <li
                    key={company.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleCompanyClick(company)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{company.name}</h3>
                          <StatusBadge status={company.status || 'active'} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>ID: {company.id}</span>
                          <span>{company.time_zone}</span>
                          <span>Created: {new Date(company.created_at).toLocaleDateString()}</span>
                          {company.callscore_enabled && (
                            <span className="text-green-600 dark:text-green-400">CallScore Enabled</span>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Pagination
              currentPage={companyPage}
              totalPages={companyTotalPages}
              onPageChange={setCompanyPage}
            />
          </div>
        )}

        {/* Company detail view with tabs */}
        {selectedCompany && !selectedTracker && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Company header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedCompany.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {companyDetails?.time_zone} | Created {companyDetails ? new Date(companyDetails.created_at).toLocaleDateString() : ''}
                  </p>
                </div>
                <StatusBadge status={selectedCompany.status || 'active'} />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex px-6 space-x-8">
                <TabButton active={activeTab === 'trackers'} onClick={() => handleTabChange('trackers')}>
                  Trackers
                </TabButton>
                <TabButton active={activeTab === 'calls'} onClick={() => handleTabChange('calls')}>
                  Calls
                </TabButton>
              </nav>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'trackers' && (
                <>
                  {/* Tracker filters */}
                  <div className="flex flex-wrap gap-3 items-center mb-4">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Search trackers..."
                        value={trackerSearchInput}
                        onChange={(e) => {
                          setTrackerSearchInput(e.target.value);
                          debouncedTrackerSearch(e.target.value);
                        }}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <select
                      value={trackerFilter}
                      onChange={(e) => {
                        setTrackerFilter(e.target.value);
                        setTrackerPage(1);
                      }}
                      className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      <option value="all">All Trackers</option>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  {/* Tracker list */}
                  {loading ? (
                    <LoadingSkeleton rows={4} />
                  ) : trackers.length > 0 ? (
                    <>
                      <div className="grid gap-4">
                        {trackers.map((tracker) => (
                          <div
                            key={tracker.id}
                            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
                            onClick={() => handleTrackerClick(tracker)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">{tracker.name}</h3>
                                  <StatusBadge status={tracker.status || 'active'} />
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    tracker.type === 'session'
                                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  }`}>
                                    {tracker.type}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span>ID: {tracker.id}</span>
                                  <span>Tracking: {tracker.tracking_phone_number || 'N/A'}</span>
                                  <span>Destination: {tracker.destination_number || 'N/A'}</span>
                                </div>
                              </div>
                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Pagination
                        currentPage={trackerPage}
                        totalPages={trackerTotalPages}
                        onPageChange={setTrackerPage}
                      />
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="mt-2">No trackers found</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'calls' && renderCallsList()}
            </div>
          </div>
        )}

        {/* Tracker details */}
        {selectedTracker && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedTracker.name}</h2>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      selectedTracker.type === 'session'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {selectedTracker.type} tracker
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {selectedTracker.id}</p>
                </div>
                {!editingTracker && (
                  <button
                    onClick={() => setEditingTracker(JSON.parse(JSON.stringify(selectedTracker)))}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {editingTracker ? (
                renderTrackerForm()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                      <p className="text-gray-900 dark:text-white">{selectedTracker.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                      <p className="text-gray-900 dark:text-white capitalize">{selectedTracker.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Whisper Message</label>
                      <p className="text-gray-900 dark:text-white">{selectedTracker.whisper_message || 'None'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">SMS Enabled</label>
                      <p className="text-gray-900 dark:text-white">{selectedTracker.sms_enabled ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {selectedTracker.type === 'session' && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Pool Size</label>
                        <p className="text-gray-900 dark:text-white">{selectedTracker.pool_size || 'N/A'}</p>
                      </div>
                    )}
                    {selectedTracker.type === 'source' && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Name</label>
                          <p className="text-gray-900 dark:text-white">{selectedTracker.campaign_name || 'None'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Source Type</label>
                          <p className="text-gray-900 dark:text-white capitalize">{selectedTracker.source?.type || 'N/A'}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tracking Numbers</label>
                      <div className="space-y-1">
                        {selectedTracker.tracking_phone_numbers?.map((num, idx) => (
                          <p key={idx} className="text-gray-900 dark:text-white">{num.formatted_phone_number}</p>
                        )) || <p className="text-gray-500">None</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallrailListAccountsDashboard;
