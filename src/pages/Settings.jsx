import React, { useState, useEffect } from 'react';
import { fetchCredentials, saveCredential } from '../services/googleSheets';
import { Settings as IconSettings, Bot, Palette, Database, Link2, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './Settings.module.css';

const Settings = () => {
    const [apiKey, setApiKey] = useState('');
    const [appsScriptUrl, setAppsScriptUrl] = useState('');
    const [urlStatus, setUrlStatus] = useState('');

    useEffect(() => {
        fetchCredentials().then(c => {
            if (c.aiApiKey) setApiKey(c.aiApiKey);
            if (c.apps_script_url) setAppsScriptUrl(c.apps_script_url);
        });

        // Check current URL from localStorage or default
        const savedUrl = localStorage.getItem('appsScriptUrl') || 'YOUR_DEPLOYMENT_URL_HERE';
        setAppsScriptUrl(savedUrl);
    }, []);

    const handleSaveApiKey = () => {
        saveCredential('aiApiKey', apiKey);
        alert('AI API Key saved!');
    };

    const handleSaveAppsScriptUrl = () => {
        if (!appsScriptUrl || appsScriptUrl === 'YOUR_DEPLOYMENT_URL_HERE') {
            setUrlStatus('error');
            alert('Please enter a valid Apps Script URL');
            return;
        }

        // Save to localStorage
        localStorage.setItem('appsScriptUrl', appsScriptUrl);

        // Also save to credentials
        saveCredential('apps_script_url', appsScriptUrl);

        setUrlStatus('success');
        setTimeout(() => {
            alert('Apps Script URL saved! Reload the page to apply changes.');
            window.location.reload();
        }, 500);
    };

    const isUrlConfigured = appsScriptUrl && appsScriptUrl !== 'YOUR_DEPLOYMENT_URL_HERE';

    return (
        <div className={styles.container}>
            {/* Google Apps Script Configuration */}
            <div className={`glass-panel ${styles.section}`}>
                <div className={styles.header}>
                    <Database size={24} className={styles.icon} />
                    <div>
                        <h3>Google Sheets Integration</h3>
                        <p>Configure your Google Apps Script deployment URL to enable real-time sync.</p>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.setupSteps}>
                        <p className={styles.stepTitle}>📋 Setup Instructions:</p>
                        <ol className={styles.stepsList}>
                            <li>Open your Google Sheet</li>
                            <li>Go to <strong>Extensions → Apps Script</strong></li>
                            <li>Copy code from <code>backend/Code.gs</code></li>
                            <li>Click <strong>Deploy → New deployment</strong></li>
                            <li>Choose <strong>Web app</strong>, set access to <strong>Anyone</strong></li>
                            <li>Copy the deployment URL and paste below</li>
                        </ol>
                    </div>

                    <label>Apps Script Deployment URL</label>
                    <div className={styles.inputRow}>
                        <input
                            type="text"
                            value={appsScriptUrl}
                            onChange={e => setAppsScriptUrl(e.target.value)}
                            placeholder="https://script.google.com/macros/s/AKfycby.../exec"
                            className={styles.urlInput}
                        />
                        <button onClick={handleSaveAppsScriptUrl} className={styles.saveBtn}>
                            <Link2 size={18} />
                            Connect
                        </button>
                    </div>

                    <div className={styles.statusIndicator}>
                        {isUrlConfigured ? (
                            <div className={styles.statusConnected}>
                                <CheckCircle size={16} />
                                <span>Google Sheets Connected - All changes will sync!</span>
                            </div>
                        ) : (
                            <div className={styles.statusDisconnected}>
                                <AlertCircle size={16} />
                                <span>Using mock data - Configure URL to enable real sync</span>
                            </div>
                        )}
                    </div>

                    {urlStatus === 'success' && (
                        <div className={styles.successMessage}>
                            ✅ Configuration saved! Reloading to apply changes...
                        </div>
                    )}
                </div>
            </div>

            {/* AI Configuration */}
            <div className={`glass-panel ${styles.section}`}>
                <div className={styles.header}>
                    <Bot size={24} className={styles.icon} />
                    <div>
                        <h3>AI Configuration</h3>
                        <p>Configure your OpenAI or custom AI provider key.</p>
                    </div>
                </div>

                <div className={styles.content}>
                    <label>AI API Key</label>
                    <div className={styles.inputRow}>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="sk-..."
                        />
                        <button onClick={handleSaveApiKey}>Update</button>
                    </div>
                </div>
            </div>

            <div className={`glass-panel ${styles.section}`}>
                <div className={styles.header}>
                    <Palette size={24} className={styles.icon} />
                    <div>
                        <h3>Status Definitions</h3>
                        <p>Manage order status colors and labels.</p>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.statusRow}>
                        <span className={styles.colorDot} style={{ background: '#10b981' }}></span>
                        <input defaultValue="New" />
                    </div>
                    <div className={styles.statusRow}>
                        <span className={styles.colorDot} style={{ background: '#f59e0b' }}></span>
                        <input defaultValue="Pending" />
                    </div>
                    <div className={styles.statusRow}>
                        <span className={styles.colorDot} style={{ background: '#ef4444' }}></span>
                        <input defaultValue="Closed" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
