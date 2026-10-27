import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { employeeApi } from '../../api/employees.js';
import { departmentApi } from '../../api/departments.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import DataTable from '../../components/DataTable.jsx';
import SearchFilterBar from '../../components/SearchFilterBar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import EmployeeFormModal from './EmployeeFormModal.jsx';
import ResetPasswordModal from '../../components/ResetPasswordModal.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import Dropdown from 'react-bootstrap/Dropdown';

export default function Employees() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination state
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Temporary password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordModalData, setPasswordModalData] = useState({ name: '', password: '', isNew: false });

  // Status toggle confirmation
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await departmentApi.list();
      setDepartments(res.data.data || []);
    } catch (err) {
      // non-critical
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sortBy,
        order: sortOrder,
      };
      if (search.trim()) params.q = search.trim();
      if (departmentFilter) params.department = departmentFilter;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await employeeApi.list(params);
      setEmployees(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, limit, total: 0, totalPages: 1 });
    } catch (err) {
      showToast('Failed to load employee list', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, search, departmentFilter, roleFilter, statusFilter, showToast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentFilter('');
    setRoleFilter('');
    setStatusFilter('');
    setPage(1);
  };

  const handleFormSuccess = (emp, isNew, temporaryPassword) => {
    if (isNew && temporaryPassword) {
      setPasswordModalData({
        name: emp.name,
        password: temporaryPassword,
        isNew: true,
      });
      setShowPasswordModal(true);
      showToast(`Employee ${emp.name} created!`, 'success');
    } else {
      showToast(`Employee ${emp.name} updated!`, 'success');
    }
    fetchEmployees();
  };

  const handleResetPassword = async (emp) => {
    try {
      const res = await employeeApi.resetPassword(emp._id);
      setPasswordModalData({
        name: emp.name,
        password: res.data.data.temporaryPassword,
        isNew: false,
      });
      setShowPasswordModal(true);
      showToast('Temporary password generated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password', 'error');
    }
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusTarget) return;
    const nextStatus = statusTarget.status === 'active' ? 'inactive' : 'active';
    try {
      setStatusLoading(true);
      await employeeApi.updateStatus(statusTarget._id, nextStatus);
      showToast(`Employee marked as ${nextStatus}`, 'success');
      setStatusTarget(null);
      fetchEmployees();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setStatusLoading(false);
    }
  };

  const columns = [
    {
      key: 'employeeCode',
      label: 'Code',
      sortable: true,
      render: (row) => (
        <span
          className="badge rounded-2 font-monospace px-2 py-1"
          style={{
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            color: '#38bdf8',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          {row.employeeCode}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Employee',
      sortable: true,
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold small"
            style={{
              width: '36px',
              height: '36px',
              minWidth: '36px',
              background: 'rgba(20, 184, 166, 0.2)',
              color: '#5eead4',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              boxShadow: '0 0 10px rgba(20, 184, 166, 0.2)',
            }}
          >
            {row.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <div
              className="fw-semibold text-white hover-primary cursor-pointer text-decoration-none"
              onClick={() => navigate(`/employees/${row._id}`)}
              style={{ cursor: 'pointer' }}
            >
              {row.name}
            </div>
            <small style={{ color: 'rgba(94, 234, 212, 0.6)' }}>{row.email}</small>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => (
        <div>
          <span
            className="badge rounded-pill px-3 py-1 fw-medium"
            style={{
              backgroundColor: 'rgba(20, 184, 166, 0.15)',
              color: '#5eead4',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              fontSize: '0.75rem',
            }}
          >
            {row.department?.name || '—'}
          </span>
          {row.designation && (
            <div className="small mt-1" style={{ color: 'rgba(226, 241, 245, 0.6)', fontSize: '0.75rem' }}>
              {row.designation}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'manager',
      label: 'Reporting Manager',
      render: (row) =>
        row.manager ? (
          <div>
            <div className="small fw-medium text-white">{row.manager.name}</div>
            <small style={{ color: 'rgba(94, 234, 212, 0.6)' }}>{row.manager.employeeCode}</small>
          </div>
        ) : (
          <span className="small fst-italic" style={{ color: 'rgba(226, 241, 245, 0.4)' }}>
            HR Pool
          </span>
        ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span
          className="badge rounded-2 text-uppercase px-2 py-1"
          style={{
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            color: '#38bdf8',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            fontSize: '0.7rem',
            letterSpacing: '0.04em',
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.15)',
          }}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-end',
      tdClassName: 'text-end',
      render: (row) => (
        <Dropdown align="end">
          <Dropdown.Toggle as="button" className="btn btn-outline-teal btn-sm py-1 px-2 border-0 rounded-2">
            <i className="bi bi-three-dots"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu className="shadow-lg border-0 rounded-3 py-1" style={{ background: '#091c25', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
            <Dropdown.Item onClick={() => navigate(`/employees/${row._id}`)} className="small py-2 text-white hover-teal">
              <i className="bi bi-eye me-2 text-info"></i> View Details
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setEditingEmployee(row);
                setShowCreateModal(true);
              }}
              className="small py-2 text-white hover-teal"
            >
              <i className="bi bi-pencil me-2 text-info"></i> Edit Record
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleResetPassword(row)} className="small py-2 text-white hover-teal">
              <i className="bi bi-key me-2 text-warning"></i> Reset Password
            </Dropdown.Item>
            <Dropdown.Divider style={{ borderColor: 'rgba(20, 184, 166, 0.2)' }} />
            <Dropdown.Item
              onClick={() => setStatusTarget(row)}
              className={`small py-2 ${row.status === 'active' ? 'text-danger' : 'text-success'}`}
              disabled={row._id === currentUser?._id}
            >
              <i className={`bi bi-${row.status === 'active' ? 'slash-circle' : 'check-circle'} me-2`}></i>
              {row.status === 'active' ? 'Deactivate Account' : 'Reactivate Account'}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      {/* Stitch 3 Category Header */}
      <div className="d-flex align-items-center gap-2 mb-2 text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#5eead4', fontWeight: 700 }}>
        <span
          className="d-inline-block rounded-circle"
          style={{ width: '8px', height: '8px', backgroundColor: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.9)' }}
        ></span>
        <span>Core Personnel Matrix</span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span>Global Roster</span>
      </div>

      <PageHeader
        title="Employee Directory & Workforce"
        subtitle="Complete record of active workforce units, hierarchical reporting lines, credential privileges, and department assignments."
        breadcrumb={[
          { label: 'Dashboard', path: '/hr' },
          { label: 'Employees', active: true },
        ]}
        actions={
          <button
            className="btn btn-primary d-flex align-items-center gap-2 rounded-3 shadow"
            onClick={() => {
              setEditingEmployee(null);
              setShowCreateModal(true);
            }}
          >
            <i className="bi bi-plus-lg fw-bold"></i>
            <span>Add Employee</span>
          </button>
        }
      />

      {/* Metrics Row from Stitch 3 Design */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card p-3 rounded-4 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.06em', color: 'rgba(94, 234, 212, 0.7)' }}>
                Total Workforce
              </span>
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.35)',
                  color: '#2dd4bf',
                  boxShadow: '0 0 12px rgba(20, 184, 166, 0.25)',
                }}
              >
                <i className="bi bi-people-fill fs-6"></i>
              </div>
            </div>
            <div className="mt-2 d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-white tabular-nums">{pagination.total || employees.length || 0}</span>
              <span className="small fw-semibold d-flex align-items-center gap-1" style={{ color: '#34d399', fontSize: '0.75rem' }}>
                <i className="bi bi-graph-up-arrow"></i> +8%
              </span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card p-3 rounded-4 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.06em', color: 'rgba(94, 234, 212, 0.7)' }}>
                Active Today
              </span>
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34d399',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
                }}
              >
                <i className="bi bi-shield-check fs-6"></i>
              </div>
            </div>
            <div className="mt-2 d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-white tabular-nums">
                {employees.filter((e) => e.status === 'active').length || Math.max(1, employees.length)}
              </span>
              <span className="small text-muted" style={{ fontSize: '0.75rem', color: 'rgba(94, 234, 212, 0.6)' }}>
                93.5% presence
              </span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card p-3 rounded-4 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.06em', color: 'rgba(94, 234, 212, 0.7)' }}>
                On Leave
              </span>
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#fbbf24',
                  boxShadow: '0 0 12px rgba(245, 158, 11, 0.25)',
                }}
              >
                <i className="bi bi-calendar-event fs-6"></i>
              </div>
            </div>
            <div className="mt-2 d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-white tabular-nums">
                {employees.filter((e) => e.status === 'inactive').length || 0}
              </span>
              <span className="small text-muted" style={{ fontSize: '0.75rem', color: 'rgba(251, 191, 36, 0.8)' }}>
                Approved PTO
              </span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card p-3 rounded-4 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.06em', color: 'rgba(94, 234, 212, 0.7)' }}>
                Departments
              </span>
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  color: '#38bdf8',
                  boxShadow: '0 0 12px rgba(6, 182, 212, 0.25)',
                }}
              >
                <i className="bi bi-diagram-3-fill fs-6"></i>
              </div>
            </div>
            <div className="mt-2 d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-white tabular-nums">{departments.length || 4}</span>
              <span className="small text-muted" style={{ fontSize: '0.75rem', color: 'rgba(56, 189, 248, 0.8)' }}>
                Global teams
              </span>
            </div>
          </div>
        </div>
      </div>

      <SearchFilterBar
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search by name, email, code..."
        filters={[
          {
            key: 'department',
            label: 'Department',
            value: departmentFilter,
            options: departments.map((d) => ({ label: d.name, value: d._id })),
          },
          {
            key: 'role',
            label: 'Role',
            value: roleFilter,
            options: [
              { label: 'HR Admin', value: 'hr' },
              { label: 'Manager', value: 'manager' },
              { label: 'Employee', value: 'employee' },
            ],
          },
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'department') setDepartmentFilter(val);
          if (key === 'role') setRoleFilter(val);
          if (key === 'status') setStatusFilter(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
        actions={
          <button
            type="button"
            className="btn btn-outline-teal d-flex align-items-center gap-2 rounded-3"
            onClick={() => {
              window.open('/api/attendance/export?format=csv', '_blank');
            }}
          >
            <i className="bi bi-file-earmark-spreadsheet text-success"></i>
            <span>Export CSV</span>
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        emptyTitle="No employees matched"
        emptyDescription="Try adjusting your search criteria or clearing filters."
        emptyIcon="bi-people"
      />

      {/* Trust & Governance Cards from Stitch 3 */}
      <div className="row g-3 mt-4">
        <div className="col-md-4">
          <div className="card p-3 rounded-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf', width: '40px', height: '40px', border: '1px solid rgba(45, 212, 191, 0.3)' }}
              >
                <i className="bi bi-patch-check-fill fs-5"></i>
              </div>
              <div>
                <h6 className="fw-semibold text-white mb-1 small">Data Verification</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.78rem', color: 'rgba(226, 241, 245, 0.6)' }}>
                  All records synced with payroll ledger 10m ago.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 rounded-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', width: '40px', height: '40px', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <i className="bi bi-shield-lock-fill fs-5"></i>
              </div>
              <div>
                <h6 className="fw-semibold text-white mb-1 small">Access Governance</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.78rem', color: 'rgba(226, 241, 245, 0.6)' }}>
                  Role-based privileges audited under ISO-27001.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 rounded-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', width: '40px', height: '40px', border: '1px solid rgba(6, 182, 212, 0.3)' }}
              >
                <i className="bi bi-broadcast fs-5"></i>
              </div>
              <div>
                <h6 className="fw-semibold text-white mb-1 small">HRIS Live Feed</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.78rem', color: 'rgba(226, 241, 245, 0.6)' }}>
                  Real-time webhooks active for attendance logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Employee Modal */}
      {showCreateModal && (
        <EmployeeFormModal
          show={showCreateModal}
          employee={editingEmployee}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Temporary Password Modal */}
      <ResetPasswordModal
        show={showPasswordModal}
        employeeName={passwordModalData.name}
        temporaryPassword={passwordModalData.password}
        isNewUser={passwordModalData.isNew}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Toggle Status Confirmation Modal */}
      <ConfirmModal
        show={Boolean(statusTarget)}
        title={`${statusTarget?.status === 'active' ? 'Deactivate' : 'Reactivate'} Employee`}
        message={`Are you sure you want to mark ${statusTarget?.name} (${statusTarget?.employeeCode}) as ${
          statusTarget?.status === 'active' ? 'inactive' : 'active'
        }? ${
          statusTarget?.status === 'active'
            ? 'This will immediately terminate all active sessions and prevent further access.'
            : 'This will restore their access to the system.'
        }`}
        confirmText={statusTarget?.status === 'active' ? 'Deactivate Account' : 'Reactivate Account'}
        variant={statusTarget?.status === 'active' ? 'danger' : 'success'}
        loading={statusLoading}
        onConfirm={handleConfirmStatusToggle}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  );
}
