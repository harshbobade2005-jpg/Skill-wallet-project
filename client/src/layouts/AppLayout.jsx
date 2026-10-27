import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Dropdown from 'react-bootstrap/Dropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

const NAV_ITEMS = {
  hr: [
    { label: 'Dashboard', path: '/hr', icon: 'bi-grid-1x2' },
    { label: 'Employees', path: '/employees', icon: 'bi-people' },
    { label: 'Departments', path: '/departments', icon: 'bi-building' },
    { label: 'Directory', path: '/directory', icon: 'bi-person-lines-fill' },
    { label: 'Leave Requests', path: '/leaves/requests', icon: 'bi-calendar-check' },
    { label: 'Leave Settings', path: '/leaves/settings', icon: 'bi-gear-wide-connected' },
    { label: 'My Leaves', path: '/leaves/my', icon: 'bi-calendar2-range' },
    { label: 'Leave Calendar', path: '/leaves/calendar', icon: 'bi-calendar3' },
    { label: 'Attendance', path: '/attendance', icon: 'bi-clock-history' },
    { label: 'Training', path: '/trainings', icon: 'bi-mortarboard' },
    { label: 'Announcements', path: '/announcements', icon: 'bi-megaphone' },
    { label: 'My Profile', path: '/profile', icon: 'bi-person-circle' },
  ],
  manager: [
    { label: 'Dashboard', path: '/manager', icon: 'bi-grid-1x2' },
    { label: 'My Team', path: '/team', icon: 'bi-people' },
    { label: 'Directory', path: '/directory', icon: 'bi-person-lines-fill' },
    { label: 'Team Approvals', path: '/leaves/approvals', icon: 'bi-clipboard-check' },
    { label: 'My Leaves', path: '/leaves/my', icon: 'bi-calendar2-range' },
    { label: 'Leave Calendar', path: '/leaves/calendar', icon: 'bi-calendar3' },
    { label: 'Team Attendance', path: '/attendance/team', icon: 'bi-clock-history' },
    { label: 'Training', path: '/trainings', icon: 'bi-mortarboard' },
    { label: 'Announcements', path: '/announcements', icon: 'bi-megaphone' },
    { label: 'My Profile', path: '/profile', icon: 'bi-person-circle' },
  ],
  employee: [
    { label: 'Dashboard', path: '/employee', icon: 'bi-grid-1x2' },
    { label: 'Directory', path: '/directory', icon: 'bi-person-lines-fill' },
    { label: 'My Leaves', path: '/leaves/my', icon: 'bi-calendar2-range' },
    { label: 'Leave Calendar', path: '/leaves/calendar', icon: 'bi-calendar3' },
    { label: 'My Attendance', path: '/attendance/my', icon: 'bi-clock-history' },
    { label: 'Announcements', path: '/announcements', icon: 'bi-megaphone' },
    { label: 'My Training', path: '/trainings/my', icon: 'bi-mortarboard' },
    { label: 'My Profile', path: '/profile', icon: 'bi-person-circle' },
  ],
};

const ROLE_COLORS = {
  hr: 'bg-primary-subtle text-primary border border-primary-subtle',
  manager: 'bg-info-subtle text-info border border-info-subtle',
  employee: 'bg-secondary-subtle text-secondary border border-secondary-subtle',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || 'employee';
  const navList = NAV_ITEMS[role] || NAV_ITEMS.employee;

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderNavLinks = () => (
    <ul className="nav nav-pills flex-column gap-1 mb-auto px-2">
      {navList.map((item) => (
        <li className="nav-item" key={item.path}>
          <NavLink
            to={item.path}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              background: isActive
                ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.28) 0%, rgba(16, 185, 129, 0.2) 100%)'
                : 'transparent',
              color: isActive ? '#ffffff' : '#cbd5e1',
              boxShadow: isActive ? '0 0 20px rgba(20, 184, 166, 0.35)' : 'none',
              border: isActive ? '1px solid rgba(45, 212, 191, 0.45)' : '1px solid transparent',
            })}
            className="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3"
          >
            <i className={`bi ${item.icon} fs-5`}></i>
            <span className="fw-medium small">{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="d-flex min-vh-100 position-relative text-white" style={{ backgroundColor: '#071318' }}>
      {/* Background ambient glowing orbs */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-orb-1"></div>
        <div className="ambient-orb-2"></div>
        <div className="ambient-orb-3"></div>
        <div className="ambient-orb-4"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="d-none d-lg-flex flex-column flex-shrink-0 border-end position-relative"
        style={{
          width: '260px',
          background: 'rgba(9, 23, 31, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderColor: 'rgba(20, 184, 166, 0.2)',
          zIndex: 40,
        }}
      >
        <div className="p-3 border-bottom d-flex align-items-center gap-3" style={{ borderColor: 'rgba(20, 184, 166, 0.2)' }}>
          <div
            className="rounded-3 p-2 d-flex align-items-center justify-content-center"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              boxShadow: '0 0 16px rgba(20, 184, 166, 0.55)',
            }}
          >
            <i className="bi bi-people-fill fs-5 text-white"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-white tracking-tight">
              Staff<span style={{ color: '#2dd4bf', textShadow: '0 0 10px rgba(45,212,191,0.6)' }}>Sync</span>
            </h6>
            <small className="text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.06em', color: '#5eead4' }}>
              HRM SYSTEM
            </small>
          </div>
        </div>

        <div className="flex-grow-1 overflow-y-auto py-3">
          <div className="px-3 mb-2 text-uppercase fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.06em', color: 'rgba(94, 234, 212, 0.6)' }}>
            Menu ({role.toUpperCase()})
          </div>
          {renderNavLinks()}
        </div>

        <div className="p-3 border-top" style={{ background: 'rgba(20, 184, 166, 0.03)', borderColor: 'rgba(20, 184, 166, 0.2)' }}>
          <div className="d-flex align-items-center gap-2 p-2 rounded-3 border" style={{ background: 'rgba(10, 32, 42, 0.75)', borderColor: 'rgba(20, 184, 166, 0.25)' }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                background: 'rgba(20, 184, 166, 0.2)',
                color: '#5eead4',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                boxShadow: '0 0 10px rgba(20, 184, 166, 0.3)',
              }}
            >
              {getInitials(user?.name)}
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="fw-semibold text-truncate small text-white">{user?.name}</div>
              <span className="badge rounded-pill py-0 px-2" style={{ fontSize: '0.68rem', backgroundColor: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf', border: '1px solid rgba(20, 184, 166, 0.35)' }}>
                {role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Offcanvas Sidebar */}
      <Offcanvas
        show={mobileOpen}
        onHide={() => setMobileOpen(false)}
        className="d-lg-none"
        style={{
          background: 'rgba(9, 23, 31, 0.96)',
          backdropFilter: 'blur(24px)',
          color: '#ffffff',
          borderRight: '1px solid rgba(20, 184, 166, 0.2)',
        }}
      >
        <Offcanvas.Header closeButton closeVariant="white" className="border-bottom" style={{ borderColor: 'rgba(20, 184, 166, 0.2)' }}>
          <Offcanvas.Title className="d-flex align-items-center gap-2">
            <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', background: '#14b8a6' }}>
              <i className="bi bi-people-fill fs-6 text-white"></i>
            </div>
            <span className="fw-bold text-white">Staff<span style={{ color: '#2dd4bf' }}>Sync</span></span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column p-0">
          <div className="flex-grow-1 overflow-y-auto py-3">
            <div className="px-3 mb-2 text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: 'rgba(94, 234, 212, 0.6)' }}>
              Menu ({role.toUpperCase()})
            </div>
            {renderNavLinks()}
          </div>
          <div className="p-3 border-top" style={{ borderColor: 'rgba(20, 184, 166, 0.2)' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="bg-teal text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', background: 'rgba(20, 184, 166, 0.3)', color: '#5eead4' }}>
                {getInitials(user?.name)}
              </div>
              <div className="flex-grow-1 overflow-hidden">
                <div className="fw-semibold text-truncate small text-white">{user?.name}</div>
                <div className="small text-truncate" style={{ color: '#7dd3fc' }}>{user?.email}</div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Column */}
      <div className="flex-grow-1 d-flex flex-column min-w-0 position-relative" style={{ zIndex: 10 }}>
        {/* Topbar */}
        <header
          className="navbar navbar-expand border-bottom px-3 px-lg-4 py-2 sticky-top"
          style={{
            background: 'rgba(8, 22, 29, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'rgba(20, 184, 166, 0.2)',
            zIndex: 30,
          }}
        >
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-secondary d-lg-none p-1 px-2 border-0 text-white"
                onClick={() => setMobileOpen(true)}
                aria-label="Toggle navigation"
              >
                <i className="bi bi-list fs-4"></i>
              </button>
              
              {/* Department badge pill */}
              <div
                className="d-none d-sm-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{
                  backgroundColor: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.35)',
                  color: '#5eead4',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  boxShadow: '0 0 14px rgba(20, 184, 166, 0.25)',
                }}
              >
                <span>🏢</span>
                <span>{user?.department?.name || 'Human Resources'}</span>
              </div>

              {/* Search bar */}
              <div className="position-relative d-none d-md-block" style={{ width: '280px' }}>
                <i
                  className="bi bi-search position-absolute top-50 translate-middle-y"
                  style={{ left: '14px', color: 'rgba(94, 234, 212, 0.6)', fontSize: '0.85rem' }}
                ></i>
                <input
                  type="text"
                  placeholder="Search employees, records, teams..."
                  className="form-control rounded-pill ps-5 py-1"
                  style={{
                    backgroundColor: 'rgba(10, 32, 42, 0.8)',
                    borderColor: 'rgba(20, 184, 166, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Right side items */}
            <div className="d-flex align-items-center gap-3">
              {/* Notification button */}
              <button
                type="button"
                className="btn position-relative rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(20, 184, 166, 0.12)',
                  border: '1px solid rgba(20, 184, 166, 0.25)',
                  color: '#5eead4',
                }}
                aria-label="Notifications"
              >
                <i className="bi bi-bell fs-6"></i>
                <span
                  className="position-absolute rounded-circle"
                  style={{
                    top: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.9)',
                  }}
                ></span>
              </button>

              <Dropdown align="end">
                <Dropdown.Toggle
                  as="button"
                  id="user-menu-dropdown"
                  className="btn d-flex align-items-center gap-2 border-0 bg-transparent py-1 px-2 rounded-3 text-white"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: '32px',
                      height: '32px',
                      background: 'rgba(99, 102, 241, 0.3)',
                      border: '1px solid rgba(129, 140, 248, 0.4)',
                      color: '#c7d2fe',
                    }}
                  >
                    {getInitials(user?.name)}
                  </div>
                  <div className="d-none d-md-flex flex-column text-start">
                    <span className="fw-semibold small text-white leading-tight">{user?.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user?.designation || role.toUpperCase()}</span>
                  </div>
                  <i className="bi bi-chevron-down small text-muted"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border rounded-3 mt-1 py-2">
                  <div className="px-3 py-1 mb-1">
                    <div className="fw-semibold small text-white">{user?.name}</div>
                    <div className="small text-truncate" style={{ maxWidth: '200px', color: '#94a3b8' }}>
                      {user?.email}
                    </div>
                  </div>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate('/profile')} className="small py-2">
                    <i className="bi bi-person me-2 text-muted"></i> My Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/change-password')} className="small py-2">
                    <i className="bi bi-key me-2 text-muted"></i> Change Password
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="small py-2 text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow-1 p-3 p-lg-4 overflow-y-auto">
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
