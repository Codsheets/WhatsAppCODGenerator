import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authenticateUser } from '../services/googleSheets';
import { Copy, CheckCircle, FileSpreadsheet, LogIn, AlertCircle } from 'lucide-react';
import styles from './Login.module.css';

const TEMPLATE_URL = 'https://docs.google.com/spreadsheets/d/14NkOAwIaYMLTTBpABHHUPoNUNNJdP4gta2HJFVCBmeM';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        sheetId: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyTemplate = async () => {
        try {
            await navigator.clipboard.writeText(TEMPLATE_URL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

            // Open template in new tab
            window.open(TEMPLATE_URL, '_blank');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Authenticate user
            const user = await authenticateUser(formData.username, formData.password, formData.sheetId);

            if (user) {
                // Login successful
                login(user, formData.sheetId);
                navigate('/');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError(err.message || 'Failed to login. Please check your credentials and Sheet ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>C</div>
                    </div>
                    <h1>WhatsApp CRM Pro</h1>
                    <p>Professional Customer Relationship Management</p>
                </div>

                <div className={`glass-panel ${styles.templateSection}`}>
                    <div className={styles.templateHeader}>
                        <FileSpreadsheet size={24} />
                        <h3>Google Sheets Template</h3>
                    </div>

                    <div className={styles.templateLink}>
                        <span className={styles.linkText}>{TEMPLATE_URL}</span>
                        <button
                            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                            onClick={handleCopyTemplate}
                        >
                            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy Template'}
                        </button>
                    </div>

                    <div className={styles.instructions}>
                        <h4>Setup Instructions:</h4>
                        <div className={styles.stepList}>
                            <div className={styles.step}>
                                <div className={styles.stepNum}>1</div>
                                <p>Click "Copy Template" above to open and duplicate the Google Sheet to your account</p>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNum}>2</div>
                                <p>Make a copy: File → Make a copy → Save to your Google Drive</p>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNum}>3</div>
                                <p>Copy your Sheet ID from the URL (the long string between /d/ and /edit)</p>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNum}>4</div>
                                <p>Enter your credentials below (default: username: <strong>admin</strong>, password: <strong>1234</strong>)</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.sheetPreview}>
                        <h5>Template includes 3 sheets:</h5>
                        <div className={styles.sheetTabs}>
                            <span className={styles.sheetTab}>📊 Clients</span>
                            <span className={styles.sheetTab}>👥 Users</span>
                            <span className={styles.sheetTab}>🔑 Keys</span>
                        </div>
                    </div>
                </div>

                <form className={`glass-panel ${styles.loginForm}`} onSubmit={handleSubmit}>
                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Google Sheet ID (Optional for Demo)</label>
                        <input
                            type="text"
                            value={formData.sheetId}
                            onChange={(e) => setFormData({ ...formData, sheetId: e.target.value })}
                            placeholder="Paste your Google Sheet ID here"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={loading}
                    >
                        <LogIn size={20} />
                        {loading ? 'Logging in...' : 'Login to CRM'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
