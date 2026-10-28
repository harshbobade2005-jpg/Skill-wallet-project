import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Spinner from 'react-bootstrap/Spinner';

export default function Login() {
  const { quickSwitch } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);

  const handleQuickOpen = async (roleKey, targetPath) => {
    setLoadingRole(roleKey);
    try {
      const loggedUser = await quickSwitch(roleKey);
      if (loggedUser) {
        showToast(`Welcome! Opened as ${loggedUser.name} (${loggedUser.role.toUpperCase()})`, 'success');
        navigate(targetPath || (roleKey === 'hr' ? '/hr' : roleKey === 'manager' ? '/manager' : '/employee'));
      } else {
        // Fallback navigate directly
        navigate(targetPath || '/hr');
      }
    } catch (err) {
      navigate(targetPath || '/hr');
    } finally {
      setLoadingRole(null);
    }
  };

  const ROLES = [
    {
      key: 'hr',
      title: 'HR Administration',
      roleBadge: 'Full Access',
      badgeColor: 'rgba(16, 185, 129, 0.2)',
      badgeTextColor: '#34d399',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      icon: 'bi-shield-check',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#34d399',
      desc: 'Workforce roster, employee onboarding, leave settings & company attendance',
      target: '/hr',
      btnLabel: 'Launch HR Portal',
      btnGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      key: 'manager',
      title: 'People Manager',
      roleBadge: 'Team Lead',
      badgeColor: 'rgba(6, 182, 212, 0.2)',
      badgeTextColor: '#38bdf8',
      borderColor: 'rgba(6, 182, 212, 0.4)',
      icon: 'bi-people-fill',
      iconBg: 'rgba(6, 182, 212, 0.15)',
      iconColor: '#38bdf8',
      desc: 'Direct reports overview, shift attendance, leave approvals & team training',
      target: '/manager',
      btnLabel: 'Launch Manager Portal',
      btnGradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    },
    {
      key: 'employee',
      title: 'Employee Self-Service',
      roleBadge: 'Staff Member',
      badgeColor: 'rgba(20, 184, 166, 0.2)',
      badgeTextColor: '#5eead4',
      borderColor: 'rgba(20, 184, 166, 0.4)',
      icon: 'bi-person-badge',
      iconBg: 'rgba(20, 184, 166, 0.15)',
      iconColor: '#2dd4bf',
      desc: 'One-click check-in clock, leave requests, company announcements & training feed',
      target: '/employee',
      btnLabel: 'Launch Employee Portal',
      btnGradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    },
  ];

  const QUICK_PAGES = [
    { label: 'Employee Matrix', path: '/employees', role: 'hr', icon: 'bi-people' },
    { label: 'Departments', path: '/departments', role: 'hr', icon: 'bi-building' },
    { label: 'Attendance Board', path: '/attendance', role: 'hr', icon: 'bi-clock-history' },
    { label: 'Leave Calendar', path: '/leaves/calendar', role: 'hr', icon: 'bi-calendar-range' },
    { label: 'Training Programs', path: '/trainings', role: 'hr', icon: 'bi-mortarboard' },
    { label: 'Announcements', path: '/announcements', role: 'hr', icon: 'bi-megaphone' },
  ];

  return (
    <div>
      <div className="text-center mb-4">
        <span
          className="badge rounded-pill px-3 py-1 mb-2 text-uppercase fw-bold"
          style={{
            backgroundColor: 'rgba(20, 184, 166, 0.15)',
            color: '#5eead4',
            border: '1px solid rgba(45, 212, 191, 0.35)',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
          }}
        >
          Instant Open Mode Active
        </span>
        <h3 className="fw-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.02em' }}>
          Quick Open Launchpad
        </h3>
        <p className="small mb-0" style={{ color: 'rgba(226, 241, 245, 0.7)' }}>
          Authentication is removed. Click any role or page to open it instantly:
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="d-flex flex-column gap-3 mb-4">
        {ROLES.map((r) => (
          <div
            key={r.key}
            className="p-3 rounded-4 border d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 transition-all cursor-pointer"
            style={{
              backgroundColor: 'rgba(10, 32, 42, 0.75)',
              borderColor: r.borderColor,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0, 15, 22, 0.4)',
            }}
            onClick={() => handleQuickOpen(r.key, r.target)}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  background: r.iconBg,
                  color: r.iconColor,
                  border: `1px solid ${r.borderColor}`,
                  boxShadow: `0 0 14px ${r.iconBg}`,
                }}
              >
                <i className={`bi ${r.icon} fs-5`}></i>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="fw-bold text-white mb-0">{r.title}</h6>
                  <span
                    className="badge rounded-pill px-2 py-0.5 text-uppercase"
                    style={{
                      backgroundColor: r.badgeColor,
                      color: r.badgeTextColor,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      border: `1px solid ${r.borderColor}`,
                    }}
                  >
                    {r.roleBadge}
                  </span>
                </div>
                <small className="d-block mt-0.5" style={{ color: 'rgba(226, 241, 245, 0.65)', fontSize: '0.8rem' }}>
                  {r.desc}
                </small>
              </div>
            </div>

            <button
              className="btn btn-sm px-3 py-2 rounded-3 text-white fw-semibold d-inline-flex align-items-center gap-2 flex-shrink-0 align-self-stretch align-self-sm-auto justify-content-center"
              style={{
                background: r.btnGradient,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `0 0 14px ${r.iconBg}`,
                fontSize: '0.85rem',
              }}
              disabled={loadingRole === r.key}
              onClick={(e) => {
                e.stopPropagation();
                handleQuickOpen(r.key, r.target);
              }}
            >
              {loadingRole === r.key ? (
                <>
                  <Spinner size="sm" animation="border" />
                  <span>Opening...</span>
                </>
              ) : (
                <>
                  <span>{r.btnLabel}</span>
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Direct Page Jump Section */}
      <div className="pt-3 border-top" style={{ borderColor: 'rgba(20, 184, 166, 0.2)' }}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.06em', color: '#5eead4' }}>
            Direct Page Jump
          </span>
          <span className="small" style={{ color: 'rgba(226, 241, 245, 0.5)', fontSize: '0.75rem' }}>
            Click to navigate directly
          </span>
        </div>

        <div className="row g-2">
          {QUICK_PAGES.map((qp) => (
            <div key={qp.path} className="col-6 col-sm-4">
              <button
                type="button"
                className="btn w-100 text-start p-2 rounded-3 d-flex align-items-center gap-2 border"
                style={{
                  backgroundColor: 'rgba(10, 32, 42, 0.6)',
                  borderColor: 'rgba(20, 184, 166, 0.25)',
                  color: '#e2f1f5',
                  fontSize: '0.8rem',
                }}
                onClick={() => handleQuickOpen(qp.role, qp.path)}
              >
                <i className={`bi ${qp.icon} text-teal`} style={{ color: '#2dd4bf' }}></i>
                <span className="text-truncate fw-medium">{qp.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
