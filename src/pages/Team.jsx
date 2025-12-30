import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/googleSheets';
import { UserPlus, DollarSign, Award } from 'lucide-react';
import styles from './Team.module.css';

const Team = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers().then(setUsers);
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={`glass-panel ${styles.kpi}`}>
                    <div className={styles.iconBox}><DollarSign /></div>
                    <div>
                        <h4>Total Commissions</h4>
                        <span>$4,250</span>
                    </div>
                </div>

                <button className={styles.addBtn}>
                    <UserPlus size={18} /> Add New Agent
                </button>
            </header>

            <div className={`glass-panel ${styles.tableContainer}`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Agent Name</th>
                            <th>Role</th>
                            <th>Commission Model</th>
                            <th>Rate/Value</th>
                            <th>Performance</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div className={styles.agentCell}>
                                        <div className={styles.agentAvatar}>{user.Name.charAt(0)}</div>
                                        <div>
                                            <div className={styles.agentName}>{user.Name}</div>
                                            <div className={styles.agentUser}>@{user.Username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={styles.badge}>{user.Role}</span></td>
                                <td>{user['Commission Type'] || 'N/A'}</td>
                                <td>
                                    {user['Commission Type'] === 'fixed'
                                        ? `${user['Commission Value']} fixed`
                                        : user['Commission Type'] === '$'
                                            ? `$${user['Commission Value']}`
                                            : user['Commission Value'] || 'N/A'}
                                </td>
                                <td>
                                    <div className={styles.performance}>
                                        <div className={styles.bar}>
                                            <div className={styles.fill} style={{ width: `${Math.random() * 100}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={styles.activeDot}>Active</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Team;
