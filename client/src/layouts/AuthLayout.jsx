import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div
      className="auth-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4 position-relative overflow-hidden"
      style={{ backgroundColor: '#071318', color: '#e2f1f5' }}
    >
      {/* Ambient background glowing halos */}
      <div className="ambient-orb-1" style={{ width: '38rem', height: '38rem' }}></div>
      <div className="ambient-orb-2" style={{ width: '34rem', height: '34rem' }}></div>
      <div className="ambient-orb-3" style={{ width: '32rem', height: '32rem' }}></div>

      <div className="w-100 position-relative" style={{ maxWidth: '680px', zIndex: 10 }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-3 p-3 shadow-lg mb-2"
            style={{
              width: '52px',
              height: '52px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              boxShadow: '0 0 24px rgba(20, 184, 166, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            <i className="bi bi-people-fill fs-4"></i>
          </div>
          <h2 className="fw-bold tracking-tight mb-1 text-white" style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.02em' }}>
            Staff<span style={{ color: '#2dd4bf', textShadow: '0 0 10px rgba(45,212,191,0.6)' }}>Sync</span>
          </h2>
          <p className="text-uppercase small mb-0 fw-semibold" style={{ letterSpacing: '0.08em', color: '#5eead4', fontSize: '0.75rem' }}>
            ENTERPRISE HRM OS • QUICK ACCESS
          </p>
        </div>

        {/* Smoked Obsidian Glass Card */}
        <div className="card rounded-4 overflow-hidden p-4 p-sm-5 border border-teal-500/25 shadow-lg">
          <Outlet />
        </div>

        <div className="text-center mt-4">
          <p className="small mb-0" style={{ fontSize: '0.8rem', color: 'rgba(94, 234, 212, 0.6)' }}>
            &copy; {new Date().getFullYear()} StaffSync HRM • Instant Open Mode Enabled
          </p>
        </div>
      </div>
    </div>
  );
}
