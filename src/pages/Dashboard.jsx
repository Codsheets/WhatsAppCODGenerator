import React, { useEffect, useState } from 'react';
import { fetchClients } from '../services/googleSheets';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import styles from './Dashboard.module.css';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className={`glass-panel ${styles.statCard}`}>
        <div className={styles.statIcon} style={{ background: color }}>
            <Icon size={24} color="#fff" />
        </div>
        <div className={styles.statInfo}>
            <h3>{title}</h3>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statTrend}>
                <span className={trend >= 0 ? styles.positive : styles.negative}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span> from last month
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [data, setData] = useState({ clients: [], sales: [] });

    useEffect(() => {
        // Load data
        fetchClients().then(clients => {
            setData(prev => ({ ...prev, clients }));
        });
    }, []);

    const chartData = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ];

    const pieData = [
        { name: 'VIP', value: 400 },
        { name: 'Returning', value: 300 },
        { name: 'New', value: 300 },
        { name: 'Inactive', value: 200 },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className={styles.dashboard}>
            <div className="grid-cards">
                <StatCard
                    title="Total Clients"
                    value={data.clients.length || 124}
                    icon={Users}
                    color="#6366f1"
                    trend={12}
                />
                <StatCard
                    title="Total Orders"
                    value="45"
                    icon={ShoppingBag}
                    color="#10b981"
                    trend={8}
                />
                <StatCard
                    title="Revenue"
                    value="$12,340"
                    icon={DollarSign}
                    color="#f59e0b"
                    trend={-2}
                />
                <StatCard
                    title="Active Campaigns"
                    value="3"
                    icon={Activity}
                    color="#ec4899"
                    trend={5}
                />
            </div>

            <div className={styles.chartsGrid}>
                <div className={`glass-panel ${styles.chartContainer}`}>
                    <h3>Revenue Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={`glass-panel ${styles.chartContainer}`}>
                    <h3>Client Segmentation</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
