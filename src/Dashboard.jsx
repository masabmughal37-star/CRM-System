import React, { useEffect, useState, useCallback } from 'react';
import API from './api';
import MetadataManager from './MetadataManager';
import './Dashboard.css';
import { 
  Users, Building2, DollarSign, CheckCircle, XCircle, AlertTriangle, Info, Search, Plus, 
  Trash2, Edit, Download, LogOut, ChevronLeft, ChevronRight, 
  BarChart2, Bell, CheckSquare, Menu, TrendingUp, X, Clock
} from 'lucide-react';

function ToastItem({ toast, onDismiss }) {
  const icons = {
    success: <CheckCircle size={20} style={{ color: '#10B981', flexShrink: 0 }} />,
    error: <XCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />,
    warning: <AlertTriangle size={20} style={{ color: '#F59E0B', flexShrink: 0 }} />,
    info: <Info size={20} style={{ color: '#4F46E5', flexShrink: 0 }} />
  };

  const borderColors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#4F46E5'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="toast-item" style={{ borderLeftColor: borderColors[toast.type] || '#4F46E5' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {icons[toast.type] || icons.info}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#F8FAFC', marginBottom: '2px' }}>{toast.title}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8', wordBreak: 'break-word' }}>{toast.message}</div>
        </div>
        <button type="button" onClick={onDismiss} className="toast-close-btn" aria-label="Close Toast">
          <X size={14} />
        </button>
      </div>
      <div className="toast-progress-bar" style={{ backgroundColor: borderColors[toast.type] || '#4F46E5' }} />
    </div>
  );
}

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const [user, setUser] = useState({ id: 1, email: 'developer@nexus.com' });
  
  // Customers are loaded from the Django API.
  const [customers, setCustomers] = useState([]);

  // Companies are loaded from the Django API.
const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tags, setTags] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [contactForm, setContactForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    company: '',
    status: 'active',
  });

const [companyForm, setCompanyForm] = useState({
  name: '',
  website: '',
  email: '',
  phone: '',
  industry: '',
  address: '',
  status: 'active',
  description: '',
});

  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('nexus_deals');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Enterprise Software License', amount: 5000, stage: 'proposal' }
    ];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('nexus_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Follow up with client regarding proposal', due_date: '2026-10-05', priority: 'high' }
    ];
  });

useEffect(() => {
    localStorage.setItem('nexus_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [toasts, setToasts] = useState([]);

  const [custForm, setCustForm] = useState({ first_name: '', last_name: '', email: '', phone_number: '', company: '', status: 'lead' });
  const [dealForm, setDealForm] = useState({ title: '', amount: '', stage: 'qualification', customer: '' });
  const [taskForm, setTaskForm] = useState({ title: '', due_date: '', priority: 'medium', customer: '' });

  const showToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  useEffect(() => {
    let cancelled = false;

    const loadCustomers = async () => {
      try {
        const response = await API.get('customers/');
        const data = response.data;
        const records = Array.isArray(data) ? data : (data.results || []);

        if (!cancelled) {
          setCustomers(records);
        }
      } catch (error) {
        if (!cancelled) {
          showToast(
            'error',
            'Customers Load Failed',
            JSON.stringify(error.response?.data || error.message)
          );
        }
      }
    };

    loadCustomers();

    return () => {
      cancelled = true;
    };
  }, [showToast]);
// Load companies from the Django API.
useEffect(() => {
  let cancelled = false;

  const loadCompanies = async () => {
    try {
      const response = await API.get('companies/');
      const data = response.data;
      const records = Array.isArray(data)
        ? data
        : (data.results || []);

      if (!cancelled) {
        setCompanies(records);
      }
    } catch (error) {
      if (!cancelled) {
        showToast(
          'error',
          'Companies Load Failed',
          JSON.stringify(error.response?.data || error.message)
        );
      }
    }
  };

  loadCompanies();

  return () => {
    cancelled = true;
  };
}, [showToast]);

  // Load contacts from the Django API.
  useEffect(() => {
    let cancelled = false;

    const loadContacts = async () => {
      try {
        const response = await API.get('contacts/');
        const data = response.data;
        const records = Array.isArray(data) ? data : (data.results || []);

        if (!cancelled) {
          setContacts(records);
        }
      } catch (error) {
        if (!cancelled) {
          showToast(
            'error',
            'Contacts Load Failed',
            JSON.stringify(error.response?.data || error.message)
          );
        }
      }
    };

    loadContacts();

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  // Load Tags from the Django API.
  useEffect(() => {
    let cancelled = false;

    const loadTags = async () => {
      try {
        const response = await API.get('metadata/tags/');
        const data = response.data;
        const records = Array.isArray(data) ? data : (data.results || []);

        if (!cancelled) {
          setTags(records);
        }
      } catch (error) {
        if (!cancelled) {
          showToast(
            'error',
            'Tags Load Failed',
            JSON.stringify(error.response?.data || error.message)
          );
        }
      }
    };

    loadTags();

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  // Load Lead Sources from the Django API.
  useEffect(() => {
    let cancelled = false;

    const loadLeadSources = async () => {
      try {
        const response = await API.get('metadata/lead-sources/');
        const data = response.data;
        const records = Array.isArray(data) ? data : (data.results || []);

        if (!cancelled) {
          setLeadSources(records);
        }
      } catch (error) {
        if (!cancelled) {
          showToast(
            'error',
            'Lead Sources Load Failed',
            JSON.stringify(error.response?.data || error.message)
          );
        }
      }
    };

    loadLeadSources();

    return () => {
      cancelled = true;
    };
  }, [showToast]);
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const exportToCSV = (data, filename, headers) => {
    if (!data || !data.length) {
      showToast('warning', 'Export Warning', 'No data available to export.');
      return;
    }
    const csvRows = [headers.join(',')];
    data.forEach((row) => {
      const values = headers.map((header) => {
        const val = row[header] !== undefined && row[header] !== null ? row[header] : '';
        return `"${('' + val).replace(/"/g, '\\"')}"`;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    showToast('success', 'Export Successful', `${filename} exported successfully.`);
  };

  const totalRevenue = deals.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
  const wonRevenue = deals.filter(d => d.stage === 'won').reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('customers/', custForm);
      const savedCustomer = response.data;

      setCustomers(prev => [savedCustomer, ...prev]);
      setCustForm({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        company: '',
        status: 'lead'
      });

      showToast(
        'success',
        'Customer Saved',
        'New customer record successfully added.'
      );
    } catch (error) {
      showToast(
        'error',
        'Save Failed',
        JSON.stringify(error.response?.data || error.message)
      );
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('companies/', companyForm);
      setCompanies(prev => [response.data, ...prev]);

      setCompanyForm({
        name: '',
        website: '',
        email: '',
        phone: '',
        industry: '',
        address: '',
        status: 'active',
        description: '',
      });

      showToast('success', 'Company Saved', 'Company successfully added.');
    } catch (error) {
      showToast(
        'error',
        'Save Failed',
        JSON.stringify(error.response?.data || error.message)
      );
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...contactForm,
      company: contactForm.company ? Number(contactForm.company) : null,
    };

    try {
      const response = await API.post('contacts/', payload);
      setContacts(prev => [response.data, ...prev]);
      setContactForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        job_title: '',
        company: '',
        status: 'active',
      });
      showToast('success', 'Contact Saved', 'Contact successfully added.');
    } catch (error) {
      showToast(
        'error',
        'Save Failed',
        JSON.stringify(error.response?.data || error.message)
      );
    }
  };

  const handleDealSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      id: Date.now(), 
      title: dealForm.title, 
      amount: parseFloat(dealForm.amount) || 0, 
      stage: dealForm.stage 
    };
    setDeals(prev => [...prev, payload]);
    setDealForm({ title: '', amount: '', stage: 'qualification', customer: '' });
    showToast('success', 'Deal Saved', 'New sales deal successfully created.');
    try {
      await API.post('deals/', dealForm);
    } catch (err) {}
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      id: Date.now(), 
      title: taskForm.title, 
      due_date: taskForm.due_date || new Date().toISOString().split('T')[0], 
      priority: taskForm.priority 
    };
    setTasks(prev => [...prev, payload]);
    setTaskForm({ title: '', due_date: '', priority: 'medium', customer: '' });
    showToast('success', 'Task Scheduled', 'Follow-up task successfully scheduled.');
    try {
      await API.post('tasks/', taskForm);
    } catch (err) {}
  };

  const promptDelete = (type, id, e) => {
    if (e) e.stopPropagation();
    setConfirmConfig({
      isOpen: true,
      title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message: `Are you sure you want to delete this ${type}? This action cannot be undone.`,
      onConfirm: () => executeDelete(type, id)
    });
  };

  const executeDelete = async (type, id) => {
    if (type === 'customer') {
      try {
        await API.delete(`customers/${id}/`);
        setCustomers(prev => prev.filter(c => c.id !== id));
        showToast('success', 'Deleted', 'Customer deleted successfully.');
        setConfirmConfig({ isOpen: false, title: '', message: '', onConfirm: null });
      } catch (error) {
        showToast(
          'error',
          'Delete Failed',
          JSON.stringify(error.response?.data || error.message)
        );
      }
      return;
    }

    if (type === 'company') {
      try {
        await API.delete(`companies/${id}/`);
        setCompanies(prev => prev.filter(c => c.id !== id));
        showToast('success', 'Deleted', 'Company deleted successfully.');
        setConfirmConfig({ isOpen: false, title: '', message: '', onConfirm: null });
      } catch (error) {
        showToast(
          'error',
          'Delete Failed',
          JSON.stringify(error.response?.data || error.message)
        );
      }
      return;
    }

    if (type === 'contact') {
      try {
        await API.delete(`contacts/${id}/`);
        setContacts(prev => prev.filter(c => c.id !== id));
        showToast('success', 'Deleted', 'Contact deleted successfully.');
        setConfirmConfig({ isOpen: false, title: '', message: '', onConfirm: null });
      } catch (error) {
        showToast(
          'error',
          'Delete Failed',
          JSON.stringify(error.response?.data || error.message)
        );
      }
      return;
    }

    if (type === 'deal') setDeals(prev => prev.filter(d => d.id !== id));
    if (type === 'task') setTasks(prev => prev.filter(t => t.id !== id));

    showToast('success', 'Deleted', `${type.charAt(0).toUpperCase() + type.slice(1)} record deleted successfully.`);
    setConfirmConfig({ isOpen: false, title: '', message: '', onConfirm: null });

    try {
      await API.delete(`${type}s/${id}/`);
    } catch (err) {}
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editType === 'customer') {
      setCustomers(prev => prev.map(c => c.id === editingItem.id ? editingItem : c));
    } else if (editType === 'company') {
      try {
        const response = await API.put(`companies/${editingItem.id}/`, editingItem);
        setCompanies(prev => prev.map(c =>
          c.id === editingItem.id ? response.data : c
        ));

        setEditingItem(null);
        setEditType(null);
        showToast('success', 'Updated', 'Company updated successfully.');
      } catch (error) {
        showToast(
          'error',
          'Update Failed',
          JSON.stringify(error.response?.data || error.message)
        );
      }
      return;
    } else if (editType === 'contact') {
      const payload = {
        ...editingItem,
        company: editingItem.company ? Number(editingItem.company) : null,
      };
      try {
        const response = await API.put(`contacts/${editingItem.id}/`, payload);
        setContacts(prev => prev.map(c =>
          c.id === editingItem.id ? response.data : c
        ));
        setEditingItem(null);
        setEditType(null);
        showToast('success', 'Updated', 'Contact updated successfully.');
      } catch (error) {
        showToast(
          'error',
          'Update Failed',
          JSON.stringify(error.response?.data || error.message)
        );
      }
      return;
    } else if (editType === 'deal') {
      setDeals(prev => prev.map(d => d.id === editingItem.id ? { ...editingItem, amount: parseFloat(editingItem.amount) || 0 } : d));
    } else if (editType === 'task') {
      setTasks(prev => prev.map(t => t.id === editingItem.id ? editingItem : t));
    }
    
    setEditingItem(null);
    setEditType(null);
    showToast('success', 'Updated', 'Record updated successfully.');

    try {
      if (editType === 'customer') await API.put(`customers/${editingItem.id}/`, editingItem);
      if (editType === 'deal') await API.put(`deals/${editingItem.id}/`, editingItem);
      if (editType === 'task') await API.put(`tasks/${editingItem.id}/`, editingItem);
    } catch (err) {}
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = `${c.first_name || ''} ${c.last_name || ''} ${c.email || ''} ${c.company || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = [
      c.name,
      c.email,
      c.phone,
      c.industry,
      c.website,
    ].some(value =>
      (value || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilter =
      statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const filteredContacts = contacts.filter(c => {
  const companyName =
    c.company_name ||
    companies.find(co => co.id === c.company)?.name ||
    '';

  const fullName =
    `${c.first_name || ''} ${c.last_name || ''}`
      .replace(/\s+/g, ' ')
      .trim();

  const query = searchTerm.trim().toLowerCase();

  const matchesSearch = [
    fullName,
    c.first_name,
    c.last_name,
    c.email,
    c.phone,
    c.job_title,
    companyName,
  ].some(value =>
    (value || '').toString().toLowerCase().includes(query)
  );

  const matchesFilter =
    statusFilter === 'all' || c.status === statusFilter;

  return matchesSearch && matchesFilter;
});

  const filteredDeals = deals.filter(d => {
    const matchesSearch = (d.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || d.stage === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || t.priority === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="crm-layout">
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>

      <div className={`sidebar-overlay ${mobileDrawerOpen ? 'visible' : ''}`} onClick={() => setMobileDrawerOpen(false)} />

      <aside className={`crm-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileDrawerOpen ? 'drawer-open' : ''}`}>
        <div>
          <div className="sidebar-header">
            {(!sidebarCollapsed || mobileDrawerOpen) && (
              <div className="sidebar-brand">
                <div className="brand-icon">C</div>
                <span className="brand-title">Nexus CRM</span>
              </div>
            )}
            <button type="button" className="sidebar-toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label="Toggle Sidebar">
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="nav-menu">
            {[
              { id: 'overview', label: 'Dashboard', icon: BarChart2 },
              { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
              { id: 'companies', label: 'Companies', icon: Building2, count: companies.length },
              { id: 'contacts', label: 'Contacts', icon: Users, count: contacts.length },
              { id: 'deals', label: 'Sales Deals', icon: DollarSign, count: deals.length },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: tasks.length },
              { id: 'tags', label: 'Tags', icon: CheckSquare, count: tags.length },
              { id: 'lead-sources', label: 'Lead Sources', icon: CheckSquare, count: leadSources.length },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); setSearchTerm(''); setStatusFilter('all'); setMobileDrawerOpen(false); }}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-item-left">
                    <IconComponent size={20} />
                    {(!sidebarCollapsed || mobileDrawerOpen) && <span className="nav-item-text">{tab.label}</span>}
                  </div>
                  {(!sidebarCollapsed || mobileDrawerOpen) && tab.count !== undefined && (
                    <span className="nav-badge">{tab.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          {(!sidebarCollapsed || mobileDrawerOpen) && (
            <div className="export-card">
              <div className="export-card-title"><Download size={14} /> Export Backup Data</div>
              <div className="export-buttons">
                <button type="button" onClick={() => exportToCSV(customers, 'CRM_Customers', ['first_name', 'last_name', 'email', 'phone_number', 'company', 'status'])} className="export-btn">Customers CSV</button>
                <button type="button" onClick={() => exportToCSV(deals, 'CRM_Deals', ['title', 'amount', 'stage'])} className="export-btn">Deals CSV</button>
                <button type="button" onClick={() => exportToCSV(tasks, 'CRM_Tasks', ['title', 'due_date', 'priority'])} className="export-btn">Tasks CSV</button>
              </div>
            </div>
          )}

          <button type="button" onClick={onLogout} className="logout-btn">
            <LogOut size={18} />
            {(!sidebarCollapsed || mobileDrawerOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="crm-main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button type="button" className="mobile-menu-trigger" onClick={() => setMobileDrawerOpen(true)} aria-label="Open Menu">
              <Menu size={20} />
            </button>
            <div className="topbar-title-group">
              <h1>
                {activeTab === 'overview' && 'Executive Overview'}
                {activeTab === 'customers' && 'Customer Management'}
                {activeTab === 'companies' && 'Company Management'}
                {activeTab === 'contacts' && 'Contact Management'}
                {activeTab === 'deals' && 'Sales Pipeline & Deals'}
                {activeTab === 'tasks' && 'Follow-up Task Board'}
                {activeTab === 'tags' && 'Tag Management'}
                {activeTab === 'lead-sources' && 'Lead Source Management'}
              </h1>
              <p className="topbar-subtitle">Welcome back, {user?.email || 'User'}</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button type="button" className="icon-btn-wrapper" onClick={() => showToast('info', 'Notifications', 'No unread notifications.')}>
              <Bell size={20} style={{ color: '#94A3B8' }} />
              <span className="notification-dot" />
            </button>
            <div className="user-avatar-badge" onClick={() => showToast('info', 'User Profile', `Logged in as ${user?.email || 'User'}`)}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header"><span className="kpi-label">TOTAL CUSTOMERS</span><Users size={20} style={{ color: '#3B82F6' }} /></div>
            <div className="kpi-value">{customers.length}</div>
            <span className="kpi-subtext"><TrendingUp size={14} /> Active Database</span>
          </div>
          <div className="kpi-card">
            <div className="kpi-header"><span className="kpi-label">TOTAL PIPELINE VALUE</span><DollarSign size={20} style={{ color: '#F59E0B' }} /></div>
            <div className="kpi-value">${totalRevenue.toLocaleString()}</div>
            <span className="kpi-subtext" style={{ color: '#94A3B8' }}>Across all stages</span>
          </div>
          <div className="kpi-card">
            <div className="kpi-header"><span className="kpi-label">CLOSED WON REVENUE</span><CheckCircle size={20} style={{ color: '#10B981' }} /></div>
            <div className="kpi-value" style={{ color: '#10B981' }}>${wonRevenue.toLocaleString()}</div>
            <span className="kpi-subtext">Converted pipeline</span>
          </div>
          <div className="kpi-card">
            <div className="kpi-header"><span className="kpi-label">PENDING TASKS</span><Clock size={20} style={{ color: '#EF4444' }} /></div>
            <div className="kpi-value">{tasks.length}</div>
            <span className="kpi-subtext" style={{ color: '#94A3B8' }}>Follow-ups scheduled</span>
          </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder={`Search ${activeTab} records...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="all">All Statuses</option>
              {activeTab === 'companies' && (
                <>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </>
              )}
              {activeTab === 'contacts' && (
                <>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </>
              )}
              {activeTab === 'customers' && (
                <>
                  <option value="lead">Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="lost">Lost</option>
                </>
              )}
              {activeTab === 'deals' && (
                <>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </>
              )}
              {activeTab === 'tasks' && (
                <>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </>
              )}
            </select>
          </div>
        )}

        <div className="tab-fade-enter">
          {activeTab === 'overview' && (
            <div className="form-card">
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>CRM System Operations</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>All core CRM microservices are fully operational. Use the navigation panel to manage customers, deals, and tasks smoothly.</p>
            </div>
          )}

          {activeTab === 'customers' && (
            <div>
              <section className="form-card">
                <h3 className="form-title"><Plus size={18} /> Add New Customer</h3>
                <form onSubmit={handleCustomerSubmit} className="grid-form-3">
                  <input type="text" placeholder="First Name" value={custForm.first_name} onChange={(e) => setCustForm({ ...custForm, first_name: e.target.value })} required className="form-input" />
                  <input type="text" placeholder="Last Name" value={custForm.last_name} onChange={(e) => setCustForm({ ...custForm, last_name: e.target.value })} required className="form-input" />
                  <input type="email" placeholder="Email Address" value={custForm.email} onChange={(e) => setCustForm({ ...custForm, email: e.target.value })} required className="form-input" />
                  <input type="text" placeholder="Phone Number" value={custForm.phone_number} onChange={(e) => setCustForm({ ...custForm, phone_number: e.target.value })} className="form-input" />
                  <input type="text" placeholder="Company" value={custForm.company} onChange={(e) => setCustForm({ ...custForm, company: e.target.value })} className="form-input" />
                  <select value={custForm.status} onChange={(e) => setCustForm({ ...custForm, status: e.target.value })} className="form-select">
                    <option value="lead">Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="lost">Lost</option>
                  </select>
                  <button type="submit" className="form-submit-btn col-span-full">Save Customer Record</button>
                </form>
              </section>

              <div className="table-container">
                <table className="data-table mobile-responsive-cards">
                  <thead>
                    <tr><th>NAME</th><th>EMAIL</th><th>COMPANY</th><th>STATUS</th><th>ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => (
                      <tr key={c.id}>
                        <td data-label="NAME" style={{ fontWeight: '600' }}>{c.first_name} {c.last_name}</td>
                        <td data-label="EMAIL" style={{ color: '#94A3B8' }}>{c.email}</td>
                        <td data-label="COMPANY">{c.company || 'N/A'}</td>
                        <td data-label="STATUS">
                          <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', backgroundColor: c.status === 'customer' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: c.status === 'customer' ? '#10B981' : '#F59E0B' }}>
                            {c.status}
                          </span>
                        </td>
                        <td data-label="ACTIONS">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setEditingItem(c); setEditType('customer'); }} className="action-btn" style={{ color: '#F59E0B' }}><Edit size={16} /></button>
                          <button type="button" onClick={(e) => promptDelete('customer', c.id, e)} className="action-btn" style={{ color: '#EF4444' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <section className="form-card">
                <h3 className="form-title"><Plus size={18} /> Add New Contact</h3>
                <form onSubmit={handleContactSubmit} className="grid-form-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={contactForm.first_name}
                    onChange={(e) => setContactForm({ ...contactForm, first_name: e.target.value })}
                    required
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={contactForm.last_name}
                    onChange={(e) => setContactForm({ ...contactForm, last_name: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={contactForm.job_title}
                    onChange={(e) => setContactForm({ ...contactForm, job_title: e.target.value })}
                    className="form-input"
                  />
                  <select
                    value={contactForm.company}
                    onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                    className="form-select"
                  >
                    <option value="">No Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                  <select
                    value={contactForm.status}
                    onChange={(e) => setContactForm({ ...contactForm, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button type="submit" className="form-submit-btn col-span-full">Save Contact</button>
                </form>
              </section>

              <div className="table-container">
                <table className="data-table mobile-responsive-cards">
                  <thead>
                    <tr>
                      <th>NAME</th><th>JOB TITLE</th><th>EMAIL</th><th>PHONE</th>
                      <th>COMPANY</th><th>STATUS</th><th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id}>
                        <td data-label="NAME" style={{ fontWeight: '600' }}>
                          {contact.first_name} {contact.last_name}
                        </td>
                        <td data-label="JOB TITLE">{contact.job_title || 'N/A'}</td>
                        <td data-label="EMAIL">{contact.email || 'N/A'}</td>
                        <td data-label="PHONE">{contact.phone || 'N/A'}</td>
                        <td data-label="COMPANY">
                          {contact.company_name || companies.find(company => company.id === contact.company)?.name || 'N/A'}
                        </td>
                        <td data-label="STATUS">
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: contact.status === 'active'
                              ? 'rgba(16,185,129,0.15)'
                              : 'rgba(148,163,184,0.15)',
                            color: contact.status === 'active' ? '#10B981' : '#94A3B8'
                          }}>
                            {contact.status}
                          </span>
                        </td>
                        <td data-label="ACTIONS">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem({ ...contact, company: contact.company || '' });
                              setEditType('contact');
                            }}
                            className="action-btn"
                            style={{ color: '#F59E0B' }}
                            title="Edit Contact"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => promptDelete('contact', contact.id, e)}
                            className="action-btn"
                            style={{ color: '#EF4444' }}
                            title="Delete Contact"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredContacts.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                          No contacts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'companies' && (
            <div>
              <section className="form-card">
                <h3 className="form-title">
                  <Plus size={18} /> Add New Company
                </h3>

                <form onSubmit={handleCompanySubmit} className="grid-form-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({
                      ...companyForm,
                      name: e.target.value
                    })}
                    required
                    className="form-input"
                  />

                  <input
                    type="url"
                    placeholder="Website"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({
                      ...companyForm,
                      website: e.target.value
                    })}
                    className="form-input"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({
                      ...companyForm,
                      email: e.target.value
                    })}
                    className="form-input"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({
                      ...companyForm,
                      phone: e.target.value
                    })}
                    className="form-input"
                  />

                  <input
                    type="text"
                    placeholder="Industry"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({
                      ...companyForm,
                      industry: e.target.value
                    })}
                    className="form-input"
                  />

                  <select
                    value={companyForm.status}
                    onChange={(e) => setCompanyForm({
                      ...companyForm,
                      status: e.target.value
                    })}
                    className="form-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Address"
                    value={companyForm.address}
                    onChange={(e) => setCompanyForm({
                      ...companyForm,
                      address: e.target.value
                    })}
                    className="form-input"
                  />

                  <textarea
                    placeholder="Description"
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({
                      ...companyForm,
                      description: e.target.value
                    })}
                    className="form-input"
                  />

                  <button
                    type="submit"
                    className="form-submit-btn col-span-full"
                  >
                    Save Company
                  </button>
                </form>
              </section>

              <div className="table-container">
                <table className="data-table mobile-responsive-cards">
                  <thead>
                    <tr>
                      <th>COMPANY</th>
                      <th>INDUSTRY</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCompanies.map((c) => (
                      <tr key={c.id}>
                        <td data-label="COMPANY" style={{ fontWeight: '600' }}>
                          {c.name}
                        </td>
                        <td data-label="INDUSTRY">{c.industry || 'N/A'}</td>
                        <td data-label="EMAIL">{c.email || 'N/A'}</td>
                        <td data-label="PHONE">{c.phone || 'N/A'}</td>
                        <td data-label="STATUS">
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: c.status === 'active'
                                ? 'rgba(16,185,129,0.15)'
                                : 'rgba(148,163,184,0.15)',
                              color: c.status === 'active'
                                ? '#10B981'
                                : '#94A3B8'
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td data-label="ACTIONS">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem(c);
                              setEditType('company');
                            }}
                            className="action-btn"
                            style={{ color: '#F59E0B' }}
                            title="Edit Company"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => promptDelete('company', c.id, e)}
                            className="action-btn"
                            style={{ color: '#EF4444' }}
                            title="Delete Company"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredCompanies.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                          No companies found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div>
              <section className="form-card">
                <h3 className="form-title"><Plus size={18} /> Create New Sales Deal</h3>
                <form onSubmit={handleDealSubmit} className="grid-form-2">
                  <input type="text" placeholder="Deal Title" value={dealForm.title} onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })} required className="form-input" />
                  <input type="number" placeholder="Amount ($)" value={dealForm.amount} onChange={(e) => setDealForm({ ...dealForm, amount: e.target.value })} required className="form-input" />
                  <select value={dealForm.stage} onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })} className="form-select">
                    <option value="qualification">Qualification</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                  <select value={dealForm.customer} onChange={(e) => setDealForm({ ...dealForm, customer: e.target.value })} className="form-select">
                    <option value="">Select Associated Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                    ))}
                  </select>
                  <button type="submit" className="form-submit-btn col-span-full">Save Sales Deal</button>
                </form>
              </section>

              <div className="table-container">
                <table className="data-table mobile-responsive-cards">
                  <thead>
                    <tr><th>TITLE</th><th>AMOUNT</th><th>STAGE</th><th>ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {filteredDeals.map((d) => (
                      <tr key={d.id}>
                        <td data-label="TITLE" style={{ fontWeight: '600' }}>{d.title}</td>
                        <td data-label="AMOUNT" style={{ color: '#10B981', fontWeight: '600' }}>${d.amount}</td>
                        <td data-label="STAGE">
                          <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', backgroundColor: d.stage === 'won' ? 'rgba(16,185,129,0.15)' : 'rgba(79,70,229,0.15)', color: d.stage === 'won' ? '#10B981' : '#818CF8' }}>
                            {d.stage}
                          </span>
                        </td>
                        <td data-label="ACTIONS">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setEditingItem(d); setEditType('deal'); }} className="action-btn" style={{ color: '#F59E0B' }}><Edit size={16} /></button>
                          <button type="button" onClick={(e) => promptDelete('deal', d.id, e)} className="action-btn" style={{ color: '#EF4444' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <section className="form-card">
                <h3 className="form-title"><Plus size={18} /> Schedule Follow-up Task</h3>
                <form onSubmit={handleTaskSubmit} className="grid-form-2">
                  <input type="text" placeholder="Task Description" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required className="form-input" />
                  <input type="date" value={taskForm.due_date} onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })} className="form-input" />
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="form-select">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <select value={taskForm.customer} onChange={(e) => setTaskForm({ ...taskForm, customer: e.target.value })} className="form-select">
                    <option value="">Select Associated Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                    ))}
                  </select>
                  <button type="submit" className="form-submit-btn col-span-full">Schedule Task</button>
                </form>
              </section>

              <div className="table-container">
                <table className="data-table mobile-responsive-cards">
                  <thead>
                    <tr><th>TASK</th><th>DUE DATE</th><th>PRIORITY</th><th>ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => (
                      <tr key={t.id}>
                        <td data-label="TASK" style={{ fontWeight: '600' }}>{t.title}</td>
                        <td data-label="DUE DATE" style={{ color: '#94A3B8' }}>{formatDate(t.due_date)}</td>
                        <td data-label="PRIORITY">
                          <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', backgroundColor: t.priority === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: t.priority === 'high' ? '#EF4444' : '#F59E0B' }}>
                            {t.priority}
                          </span>
                        </td>
                        <td data-label="ACTIONS">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setEditingItem(t); setEditType('task'); }} className="action-btn" style={{ color: '#F59E0B' }}><Edit size={16} /></button>
                          <button type="button" onClick={(e) => promptDelete('task', t.id, e)} className="action-btn" style={{ color: '#EF4444' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {activeTab === 'tags' && <MetadataManager type="tags" />}
        {activeTab === 'lead-sources' && <MetadataManager type="lead-sources" />}
        {editingItem && (
          <div className="modal-overlay" onClick={() => { setEditingItem(null); setEditType(null); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Update {editType.toUpperCase()} Record</h3>
              <form onSubmit={handleUpdate} className="modal-form">
                {editType === 'customer' && (
                  <>
                    <input type="text" value={editingItem.first_name || ''} onChange={(e) => setEditingItem({ ...editingItem, first_name: e.target.value })} required className="form-input" />
                    <input type="text" value={editingItem.last_name || ''} onChange={(e) => setEditingItem({ ...editingItem, last_name: e.target.value })} required className="form-input" />
                    <input type="email" value={editingItem.email || ''} onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })} required className="form-input" />
                    <select value={editingItem.status || 'lead'} onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })} className="form-select">
                      <option value="lead">Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="prospect">Prospect</option>
                      <option value="customer">Customer</option>
                      <option value="lost">Lost</option>
                    </select>
                  </>
                )}

                {editType === 'company' && (
                  <>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        name: e.target.value
                      })}
                      required
                      className="form-input"
                    />

                    <input
                      type="url"
                      placeholder="Website"
                      value={editingItem.website || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        website: e.target.value
                      })}
                      className="form-input"
                    />

                    <input
                      type="email"
                      placeholder="Email"
                      value={editingItem.email || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        email: e.target.value
                      })}
                      className="form-input"
                    />

                    <input
                      type="text"
                      placeholder="Phone"
                      value={editingItem.phone || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        phone: e.target.value
                      })}
                      className="form-input"
                    />

                    <input
                      type="text"
                      placeholder="Industry"
                      value={editingItem.industry || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        industry: e.target.value
                      })}
                      className="form-input"
                    />

                    <input
                      type="text"
                      placeholder="Address"
                      value={editingItem.address || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        address: e.target.value
                      })}
                      className="form-input"
                    />

                    <select
                      value={editingItem.status || 'active'}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        status: e.target.value
                      })}
                      className="form-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>

                    <textarea
                      placeholder="Description"
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        description: e.target.value
                      })}
                      className="form-input"
                    />
                  </>
                )}

                {editType === 'contact' && (
                  <>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={editingItem.first_name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, first_name: e.target.value })}
                      required
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={editingItem.last_name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, last_name: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={editingItem.email || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={editingItem.phone || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={editingItem.job_title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, job_title: e.target.value })}
                      className="form-input"
                    />
                    <select
                      value={editingItem.company || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                      className="form-select"
                    >
                      <option value="">No Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                    <select
                      value={editingItem.status || 'active'}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="form-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </>
                )}

                {editType === 'deal' && (
                  <>
                    <input type="text" value={editingItem.title || ''} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} required className="form-input" />
                    <input type="number" value={editingItem.amount || ''} onChange={(e) => setEditingItem({ ...editingItem, amount: e.target.value })} required className="form-input" />
                    <select value={editingItem.stage || 'qualification'} onChange={(e) => setEditingItem({ ...editingItem, stage: e.target.value })} className="form-select">
                      <option value="qualification">Qualification</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </>
                )}

                {editType === 'task' && (
                  <>
                    <input type="text" value={editingItem.title || ''} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} required className="form-input" />
                    <select value={editingItem.priority || 'medium'} onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value })} className="form-select">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </>
                )}

                <div className="modal-actions">
                  <button type="submit" className="form-submit-btn" style={{ flex: 1 }}>Save Changes</button>
                  <button type="button" onClick={() => { setEditingItem(null); setEditType(null); }} className="form-submit-btn" style={{ flex: 1, backgroundColor: '#334155' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {confirmConfig.isOpen && (
          <div className="modal-overlay" onClick={() => setConfirmConfig({ isOpen: false, title: '', message: '', onConfirm: null })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#F8FAFC' }}>{confirmConfig.title}</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>{confirmConfig.message}</p>
              <div className="modal-actions">
                <button type="button" onClick={confirmConfig.onConfirm} className="form-submit-btn" style={{ flex: 1, backgroundColor: '#EF4444' }}>Delete</button>
                <button type="button" onClick={() => setConfirmConfig({ isOpen: false, title: '', message: '', onConfirm: null })} className="form-submit-btn" style={{ flex: 1, backgroundColor: '#334155' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

