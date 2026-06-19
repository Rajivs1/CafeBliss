import { useState, useEffect, useCallback } from 'react';
import { menuService } from '../../services/menuService';
import './ManageMenu.css';

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '',
  image: '', available: true, isVegetarian: false, preparationTime: 15
};

const ManageMenu = () => {
  const [items, setItems]                   = useState([]);
  const [categories, setCategories]         = useState([]);
  const [formData, setFormData]             = useState(EMPTY_FORM);
  const [editingId, setEditingId]           = useState(null);
  const [showCatInput, setShowCatInput]     = useState(false);
  const [newCategory, setNewCategory]       = useState('');
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [searchTerm, setSearchTerm]         = useState('');
  const [filterCat, setFilterCat]           = useState('all');
  const [toast, setToast]                   = useState(null);
  const [previewImg, setPreviewImg]         = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = useCallback(() => {
    menuService.getAllItems()
      .then(data => {
        setItems(data);
        setCategories([...new Set(data.map(i => i.category))]);
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to load menu items', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (name === 'image') setPreviewImg(value);
  };

  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setCategories(prev => [...prev, cat]);
      setFormData(prev => ({ ...prev, category: cat }));
    }
    setNewCategory('');
    setShowCatInput(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await menuService.updateItem(editingId, formData);
        showToast('✓ Item updated successfully');
      } else {
        await menuService.createItem(formData);
        showToast('✓ Item added to menu');
      }
      resetForm();
      fetchItems();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name, description: item.description,
      price: item.price, category: item.category,
      image: item.image || '', available: item.available,
      isVegetarian: item.isVegetarian || false,
      preparationTime: item.preparationTime || 15
    });
    setPreviewImg(item.image || '');
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await menuService.deleteItem(id);
      showToast('Item removed from menu');
      fetchItems();
    } catch {
      showToast('Failed to delete item', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM, category: categories[0] || '' });
    setEditingId(null);
    setPreviewImg('');
  };

  const toggleAvailability = async (item) => {
    try {
      await menuService.updateItem(item._id, { ...item, available: !item.available });
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, available: !i.available } : i));
      showToast(`"${item.name}" marked ${!item.available ? 'available' : 'unavailable'}`);
    } catch {
      showToast('Failed to update availability', 'error');
    }
  };

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = filterCat === 'all' || i.category === filterCat;
    return matchSearch && matchCat;
  });

  const catCounts = categories.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="mm-loading">
        <div className="mm-spinner" />
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="manage-menu">
      {/* Ambient orbs */}
      <div className="mm-orb mm-orb-1" />
      <div className="mm-orb mm-orb-2" />

      {/* Toast */}
      {toast && (
        <div className={`mm-toast mm-toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mm-header">
        <div>
          <span className="mm-badge">🍽️ Menu Management</span>
          <h1 className="mm-title">Manage Menu</h1>
          <p className="mm-subtitle">{items.length} items across {categories.length} categories</p>
        </div>
      </div>

      <div className="mm-layout">
        {/* ── Sidebar Form ── */}
        <aside className="mm-sidebar">
          <div className="mm-form-card">
            <div className="mm-form-header">
              <h2>{editingId ? '✏️ Edit Item' : '＋ Add New Item'}</h2>
              {editingId && <button className="mm-form-cancel-x" onClick={resetForm}>✕</button>}
            </div>

            <form onSubmit={handleSubmit} className="mm-form">
              {/* Image preview */}
              {previewImg && (
                <div className="mm-img-preview">
                  <img src={previewImg} alt="Preview" onError={() => setPreviewImg('')} />
                </div>
              )}

              <div className="mm-field">
                <label>Item Name *</label>
                <input name="name" value={formData.name} onChange={handleChange}
                  placeholder="e.g. Cappuccino" required />
              </div>

              <div className="mm-field">
                <label>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange}
                  placeholder="Describe the item..." required rows={3} />
              </div>

              <div className="mm-field-row">
                <div className="mm-field">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" step="0.01" min="0"
                    value={formData.price} onChange={handleChange} placeholder="150" required />
                </div>
                <div className="mm-field">
                  <label>Prep Time (min)</label>
                  <input name="preparationTime" type="number" min="0"
                    value={formData.preparationTime} onChange={handleChange} placeholder="15" />
                </div>
              </div>

              <div className="mm-field">
                <label>Category *</label>
                {showCatInput ? (
                  <div className="mm-cat-row">
                    <input value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      placeholder="New category name..."
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())} />
                    <button type="button" className="mm-btn-cat-add" onClick={handleAddCategory}>Add</button>
                    <button type="button" className="mm-btn-cat-cancel" onClick={() => setShowCatInput(false)}>✕</button>
                  </div>
                ) : (
                  <div className="mm-cat-row">
                    <select name="category" value={formData.category}
                      onChange={handleChange} required>
                      {categories.length === 0 && <option value="">-- No categories yet --</option>}
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="button" className="mm-btn-new-cat" onClick={() => setShowCatInput(true)}>＋</button>
                  </div>
                )}
              </div>

              <div className="mm-field">
                <label>Image URL</label>
                <input name="image" value={formData.image} onChange={handleChange}
                  placeholder="https://images.unsplash.com/..." />
              </div>

              <div className="mm-checks">
                <label className="mm-check-label">
                  <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                  <span className="mm-check-box" />
                  <span>Available for ordering</span>
                </label>
                <label className="mm-check-label">
                  <input type="checkbox" name="isVegetarian" checked={formData.isVegetarian} onChange={handleChange} />
                  <span className="mm-check-box" />
                  <span>🌿 Vegetarian</span>
                </label>
              </div>

              <div className="mm-form-actions">
                <button type="submit" className="mm-btn-save" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? '✓ Update Item' : '＋ Add Item'}
                </button>
                {editingId && (
                  <button type="button" className="mm-btn-cancel" onClick={resetForm}>Cancel</button>
                )}
              </div>
            </form>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="mm-main">
          {/* Category Filter Tabs */}
          <div className="mm-filter-row">
            <div className="mm-cat-tabs">
              <button
                className={`mm-cat-tab ${filterCat === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCat('all')}
              >
                All <span className="mm-tab-count">{items.length}</span>
              </button>
              {categories.map(cat => (
                <button key={cat}
                  className={`mm-cat-tab ${filterCat === cat ? 'active' : ''}`}
                  onClick={() => setFilterCat(cat)}
                >
                  {cat} <span className="mm-tab-count">{catCounts[cat] || 0}</span>
                </button>
              ))}
            </div>
            <div className="mm-search-wrap">
              <span>🔍</span>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search items..." className="mm-search" />
              {searchTerm && <button onClick={() => setSearchTerm('')} className="mm-search-clear">✕</button>}
            </div>
          </div>

          {/* Items Grid */}
          {filtered.length === 0 ? (
            <div className="mm-empty">
              <span>🍽️</span>
              <p>{searchTerm ? 'No items match your search.' : 'No items yet. Add your first menu item!'}</p>
            </div>
          ) : (
            <div className="mm-grid">
              {filtered.map((item, i) => (
                <div key={item._id} className="mm-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="mm-card-img">
                    {item.image ? (
                      <img src={item.image} alt={item.name}
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <div className="mm-card-img-fallback" style={{ display: item.image ? 'none' : 'flex' }}>🍽️</div>
                    <div className="mm-card-badges">
                      {item.isVegetarian && <span className="mm-veg-dot" title="Vegetarian">🌿</span>}
                      <span
                        className={`mm-avail-pill ${item.available ? 'avail-yes' : 'avail-no'}`}
                        onClick={() => toggleAvailability(item)}
                        title="Click to toggle"
                      >
                        {item.available ? '● Live' : '○ Off'}
                      </span>
                    </div>
                  </div>
                  <div className="mm-card-body">
                    <div className="mm-card-top">
                      <span className="mm-card-cat">{item.category}</span>
                      <span className="mm-card-prep">⏱ {item.preparationTime || 15}m</span>
                    </div>
                    <h3 className="mm-card-name">{item.name}</h3>
                    <p className="mm-card-desc">{item.description}</p>
                    <div className="mm-card-footer">
                      <span className="mm-card-price">₹{Number(item.price).toFixed(2)}</span>
                      <div className="mm-card-actions">
                        <button className="mm-act-edit" onClick={() => handleEdit(item)}>✏️</button>
                        <button className="mm-act-delete" onClick={() => handleDelete(item._id, item.name)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageMenu;
