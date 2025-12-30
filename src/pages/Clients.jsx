import React, { useEffect, useState } from 'react';
import { fetchClients, addClient, updateClient, deleteClient } from '../services/googleSheets';
import { Search, Filter, MoreVertical, Phone, MapPin, Tag, Plus, Edit2, Trash2, X, Grid, List, Package } from 'lucide-react';
import styles from './Clients.module.css';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [filter, setFilter] = useState('');
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [formData, setFormData] = useState({
        Client: '',
        Phone: '',
        City: '',
        Address: '',
        Items: '',
        Qty: 1,
        Price: 0,
        Statuses: 'Confirmed',
        Note: '',
        Date: new Date().toLocaleDateString('en-US')
    });

    useEffect(() => {
        loadClients();
        // Load view preference
        const savedView = localStorage.getItem('clientsView');
        if (savedView) setViewMode(savedView);
    }, []);

    const loadClients = async () => {
        const data = await fetchClients();
        setClients(data);
    };

    const filteredClients = clients.filter(c =>
        c.Client.toLowerCase().includes(filter.toLowerCase()) ||
        c.City.toLowerCase().includes(filter.toLowerCase()) ||
        c.Phone.includes(filter)
    );

    const handleViewChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('clientsView', mode);
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            Client: '',
            Phone: '',
            City: '',
            Address: '',
            Items: '',
            Qty: 1,
            Price: 0,
            Statuses: 'Confirmed',
            Note: '',
            Date: new Date().toLocaleDateString('en-US')
        });
        setShowModal(true);
    };

    const openEditModal = (client, index) => {
        setModalMode('edit');
        setSelectedClient(client);
        setSelectedIndex(index);
        setFormData({ ...client });
        setShowModal(true);
    };

    const openDeleteModal = (client, index) => {
        setModalMode('delete');
        setSelectedClient(client);
        setSelectedIndex(index);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (modalMode === 'add') {
            await addClient(formData);
        } else if (modalMode === 'edit') {
            await updateClient(selectedIndex, formData);
        }

        await loadClients();
        setShowModal(false);
    };

    const handleDelete = async () => {
        await deleteClient(selectedIndex);
        await loadClients();
        setShowModal(false);
    };

    const handleStatusChange = async (index, newStatus) => {
        await updateClient(index, { Statuses: newStatus });
        await loadClients();
    };

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.leftActions}>
                    <div className={`glass-panel ${styles.searchBar}`}>
                        <Search size={20} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>

                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'card' ? styles.active : ''}`}
                            onClick={() => handleViewChange('card')}
                        >
                            <Grid size={18} />
                            Cards
                        </button>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                            onClick={() => handleViewChange('list')}
                        >
                            <List size={18} />
                            List
                        </button>
                    </div>
                </div>

                <button className={`${styles.filterBtn} glass-panel`}>
                    <Filter size={20} />
                    Filter
                </button>

                <button className={styles.addBtn} onClick={openAddModal}>
                    <Plus size={20} />
                    Add Client
                </button>
            </div>

            {viewMode === 'card' ? (
                <div className={styles.cardGrid}>
                    {filteredClients.map((client, index) => (
                        <div
                            key={index}
                            className={`glass-panel ${styles.clientCard}`}
                            data-status={client.Statuses?.toLowerCase()}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}>{client.Client.charAt(0)}</div>
                                <div className={styles.cardActions}>
                                    <button
                                        className={`${styles.actionBtn} ${styles.edit}`}
                                        onClick={() => openEditModal(client, index)}
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${styles.delete}`}
                                        onClick={() => openDeleteModal(client, index)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className={styles.name}>{client.Client}</h3>

                            <div className={styles.infoRow}>
                                <Phone size={14} /> <span>{client.Phone}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <MapPin size={14} /> <span>{client.City}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <Package size={14} /> <span>{client.Items} (x{client.Qty})</span>
                            </div>

                            <select
                                className={`${styles.statusBadge}`}
                                data-status={client.Statuses?.toLowerCase()}
                                value={client.Statuses}
                                onChange={(e) => handleStatusChange(index, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Returned">Returned</option>
                            </select>

                            <div className={styles.footer}>
                                <small>Date: {client.Date}</small>
                                <small>Price: ${client.Price}</small>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.listView}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Items</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className={styles.clientName}>
                                            <div className={styles.smallAvatar}>{client.Client.charAt(0)}</div>
                                            <div className={styles.clientInfo}>
                                                <strong>{client.Client}</strong>
                                                <small>{client.Address}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{client.Phone}</td>
                                    <td>{client.City}</td>
                                    <td>{client.Items} (x{client.Qty})</td>
                                    <td>${client.Price}</td>
                                    <td>
                                        <select
                                            className={styles.statusBadge}
                                            data-status={client.Statuses?.toLowerCase()}
                                            value={client.Statuses}
                                            onChange={(e) => handleStatusChange(index, e.target.value)}
                                        >
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Returned">Returned</option>
                                        </select>
                                    </td>
                                    <td>{client.Date}</td>
                                    <td>
                                        <div className={styles.cardActions}>
                                            <button
                                                className={`${styles.actionBtn} ${styles.edit}`}
                                                onClick={() => openEditModal(client, index)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.delete}`}
                                                onClick={() => openDeleteModal(client, index)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {modalMode === 'delete' ? (
                            <div className={styles.deleteConfirm}>
                                <div className={styles.modalHeader}>
                                    <h2>Delete Client</h2>
                                    <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <p>Are you sure you want to delete <strong>{selectedClient?.Client}</strong>?</p>
                                <p>This action cannot be undone.</p>
                                <div className={styles.modalActions}>
                                    <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button className={styles.dangerBtn} onClick={handleDelete}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.modalHeader}>
                                    <h2>{modalMode === 'add' ? 'Add New Client' : 'Edit Client'}</h2>
                                    <button type="button" className={styles.closeBtn} onClick={() => setShowModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Client Name *</label>
                                        <input
                                            type="text"
                                            value={formData.Client}
                                            onChange={(e) => setFormData({ ...formData, Client: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Phone *</label>
                                        <input
                                            type="text"
                                            value={formData.Phone}
                                            onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            value={formData.City}
                                            onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Items *</label>
                                        <input
                                            type="text"
                                            value={formData.Items}
                                            onChange={(e) => setFormData({ ...formData, Items: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Quantity *</label>
                                        <input
                                            type="number"
                                            value={formData.Qty}
                                            onChange={(e) => setFormData({ ...formData, Qty: parseInt(e.target.value) })}
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Price *</label>
                                        <input
                                            type="number"
                                            value={formData.Price}
                                            onChange={(e) => setFormData({ ...formData, Price: parseFloat(e.target.value) })}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Status *</label>
                                        <select
                                            value={formData.Statuses}
                                            onChange={(e) => setFormData({ ...formData, Statuses: e.target.value })}
                                            required
                                        >
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Returned">Returned</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Date *</label>
                                        <input
                                            type="text"
                                            value={formData.Date}
                                            onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>Address *</label>
                                        <input
                                            type="text"
                                            value={formData.Address}
                                            onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>Note</label>
                                        <textarea
                                            value={formData.Note}
                                            onChange={(e) => setFormData({ ...formData, Note: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.saveBtn}>
                                        {modalMode === 'add' ? 'Add Client' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
