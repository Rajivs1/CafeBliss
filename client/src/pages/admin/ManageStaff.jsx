import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import './ManageStaff.css';

const ManageStaff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'staff', phone: '', address: ''
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role, phone: user.phone || '', address: user.address || '' });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'staff', phone: '', address: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'staff', phone: '', address: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.updateUser(editingUser._id, updateData);
      } else {
        await userService.createUser(formData);
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getRoleConfig = (role) => {
    const map = {
      admin:    { label: 'Admin',    icon: '👑', cls: 'role-admin' },
      staff:    { label: 'Staff',    icon: '👨‍🍳', cls: 'role-staff' },
      customer: { label: 'Customer', icon: '☕', cls: 'role-customer' },
    };
    return map[role] || { label: role, icon: '•', cls: 'role-customer' };
  };

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    admin:    users.filter(u => u.role === 'admin').length,
    staff:    users.filter(u => u.role === 'staff').length,
    customer: users.filter(u => u.role === 'customer').length,
  };

  if (loading) {
    return (
      <div className="staff-loading">
        <div className="loading-spinner" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="manage-staff">
      {/* Ambient background orbs */}
      <div className="staff-orb staff-orb-1" />
      <div className="staff-orb staff-orb-2" />

      {/* Header */}
      <div className="staff-header">
        <div className="staff-header-left">
          <span className="staff-badge">👤 User Management</span>
          <h1 className="staff-title">Manage Staff & Users</h1>
          <p className="staff-subtitle">Control access, roles and account settings</p>
        </div>
        <button className="btn-add-user" onClick={() => handleOpenModal()}>
          <span>＋</span> Add New User
        </button>
      </div>

      {/* Summary cards */}
      <div className="staff-summary">
        {[
          { role: 'admin',    label: 'Admins',    icon: '👑', count: roleCounts.admin,    cls: 'sum-admin' },
          { role: 'staff',    label: 'Staff',     icon: '👨‍🍳', count: roleCounts.staff,    cls: 'sum-staff' },
          { role: 'customer', label: 'Customers', icon: '☕', count: roleCounts.customer, cls: 'sum-customer' },
          { role: 'all',      label: 'Total',     icon: '📋', count: users.length,        cls: 'sum-total' },
        ].map(s => (
          <button
            key={s.role}
            className={`sum-card ${s.cls} ${filterRole === s.role ? 'active' : ''}`}
            onClick={() => setFilterRole(s.role)}
          >
            <span className="sum-icon">{s.icon}</span>
            <span className="sum-count">{s.count}</span>
            <span className="sum-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="staff-search-row">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="staff-search"
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        <span className="results-count">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="staff-table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>{searchTerm ? 'No users match your search.' : 'No users found.'}</p>
          </div>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => {
                const rc = getRoleConfig(user.role);
                return (
                  <tr key={user._id} className="staff-row">
                    <td className="row-num">{idx + 1}</td>
                    <td>
                      <div className="user-cell">
                        <div className={`user-avatar ${rc.cls}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td className="user-phone">{user.phone || '—'}</td>
                    <td>
                      <span className={`role-badge ${rc.cls}`}>
                        {rc.icon} {rc.label}
                      </span>
                    </td>
                    <td className="user-date">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="row-actions">
                      <button onClick={() => handleOpenModal(user)} className="btn-edit">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="btn-delete">
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingUser ? '✏️ Edit User' : '＋ Add New User'}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="field-group">
                  <label>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rajeev Kumar" required />
                </div>
                <div className="field-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="user@cafebliss.com" required disabled={!!editingUser} />
                </div>
              </div>

              <div className="form-row">
                <div className="field-group">
                  <label>Password {!editingUser && '*'}</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={editingUser ? 'Leave blank to keep current' : 'Min. 6 characters'} required={!editingUser} />
                </div>
                <div className="field-group">
                  <label>Role *</label>
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="customer">☕ Customer</option>
                    <option value="staff">👨‍🍳 Staff</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="field-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
                <div className="field-group">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="City, State" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-save">
                  {editingUser ? '✓ Save Changes' : '＋ Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
