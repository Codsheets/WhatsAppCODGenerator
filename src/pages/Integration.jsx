import React, { useState, useEffect } from 'react';
import { fetchCredentials, saveCredential } from '../services/googleSheets';
import { Save, ExternalLink, CheckCircle, AlertCircle, Plus, Edit2, Trash2, Key } from 'lucide-react';
import styles from './Integration.module.css';

const Integration = () => {
    const [credentials, setCredentials] = useState({});
    const [status, setStatus] = useState('');
    const [editingKey, setEditingKey] = useState(null);
    const [newKey, setNewKey] = useState({ key: '', value: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        loadCredentials();
    }, []);

    const loadCredentials = async () => {
        const creds = await fetchCredentials();
        setCredentials(creds);
    };

    const handleSave = async (key, value) => {
        setStatus('saving');
        await saveCredential(key, value);
        await loadCredentials();
        setStatus('saved');
        setEditingKey(null);
        setTimeout(() => setStatus(''), 2000);
    };

    const handleAddNew = async () => {
        if (newKey.key && newKey.value) {
            await saveCredential(newKey.key, newKey.value);
            await loadCredentials();
            setNewKey({ key: '', value: '' });
            setShowAddForm(false);
        }
    };

    const credentialsList = Object.entries(credentials).map(([key, value]) => ({ key, value }));

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* WhatsApp Setup Guide */}
                <div className={`glass-panel ${styles.guidePanel}`}>
                    <h3><ExternalLink size={20} /> Connect Meta WhatsApp API</h3>

                    <div className={styles.stepList}>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>1</div>
                            <p>Go to the <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer">Meta Developers Portal</a> and create a new App (Type: Business).</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>2</div>
                            <p>Add the <strong>WhatsApp</strong> product to your app.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>3</div>
                            <p>In the API Setup tab, copy the temporary <strong>Access Token</strong> and <strong>Phone Number ID</strong>.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>4</div>
                            <p>Add them to your credentials below.</p>
                        </div>
                    </div>

                    <div className={styles.alert}>
                        <AlertCircle size={18} />
                        <span>For permanent access, you will need to configure a System User token.</span>
                    </div>
                </div>

                {/* Credentials Management */}
                <div className={`glass-panel ${styles.formPanel}`}>
                    <div className={styles.panelHeader}>
                        <h3><Key size={20} /> API Credentials</h3>
                        <button
                            className={styles.addKeyBtn}
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            <Plus size={18} />
                            Add Key
                        </button>
                    </div>

                    {showAddForm && (
                        <div className={styles.addKeyForm}>
                            <div className={styles.formRow}>
                                <input
                                    type="text"
                                    placeholder="Key name (e.g., api_key)"
                                    value={newKey.key}
                                    onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={newKey.value}
                                    onChange={(e) => setNewKey({ ...newKey, value: e.target.value })}
                                />
                                <button onClick={handleAddNew} className={styles.saveBtn}>
                                    <Save size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.credentialsList}>
                        {credentialsList.map(({ key, value }) => (
                            <div key={key} className={styles.credentialItem}>
                                <div className={styles.credentialKey}>
                                    <Key size={16} />
                                    <strong>{key}</strong>
                                </div>

                                {editingKey === key ? (
                                    <div className={styles.editForm}>
                                        <input
                                            type="password"
                                            value={value}
                                            onChange={(e) => setCredentials({ ...credentials, [key]: e.target.value })}
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleSave(key, credentials[key])}
                                            className={styles.saveIconBtn}
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.credentialValue}>
                                        <span className={styles.maskedValue}>
                                            {value ? '•'.repeat(Math.min(value.length, 20)) : 'Not set'}
                                        </span>
                                        <button
                                            onClick={() => setEditingKey(key)}
                                            className={styles.editIconBtn}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {status === 'saved' && (
                        <div className={styles.successMessage}>
                            <CheckCircle size={18} />
                            <span>Credentials saved successfully!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Integration;

