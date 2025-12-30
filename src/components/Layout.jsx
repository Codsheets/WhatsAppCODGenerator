import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    Link,
    Briefcase,
    LogOut
} from 'lucide-react';
import styles from './Layout.module.css';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/whatsapp', label: 'WhatsApp', icon: MessageSquare },
        { path: '/clients', label: 'Clients', icon: Users },
        { path: '/team', label: 'Team', icon: Briefcase },
        { path: '/integration', label: 'Integration', icon: Link },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>C</div>
                    <h2>CRM Pro</h2>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.active : ''}`
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                        {user?.Name?.charAt(0) || 'U'}
                    </div>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{user?.Name || 'User'}</p>
                        <p className={styles.userRole}>{user?.Role || 'Role'}</p>
                    </div>
                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h1>
                    <div className={styles.actions}>
                        {/* Placeholder for header actions */}
                    </div>
                </header>

                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;

