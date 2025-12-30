import { fetchClients, fetchCredentials } from '../services/googleSheets';
import { sendWhatsAppMessage } from '../services/whatsapp';
import { generateMessage } from '../services/ai';
import {
    Send, Users, Filter, Sparkles, MessageCircle, Clock,
    CheckCircle, Zap, Target, TrendingUp, Phone, MapPin,
    Package, Calendar, Smile, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import styles from './WhatsApp.module.css';

const WhatsApp = () => {
    const [clients, setClients] = useState([]);
    const [credentials, setCredentials] = useState({});
    const [selectedSegment, setSelectedSegment] = useState('all');
    const [customFilters, setCustomFilters] = useState({
        city: '',
        status: '',
        minPrice: '',
    });
    const [prompt, setPrompt] = useState('');
    const [tone, setTone] = useState('friendly');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sentCount, setSentCount] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const clientsData = await fetchClients();
        const credsData = await fetchCredentials();
        setClients(clientsData);
        setCredentials(credsData);
    };

    const filteredClients = clients.filter(client => {
        if (selectedSegment === 'confirmed') return client.Statuses === 'Confirmed';
        if (selectedSegment === 'delivered') return client.Statuses === 'Delivered';
        if (selectedSegment === 'cancelled') return client.Statuses === 'Cancelled';
        if (selectedSegment === 'custom') {
            let match = true;
            if (customFilters.city && !client.City.toLowerCase().includes(customFilters.city.toLowerCase())) match = false;
            if (customFilters.status && client.Statuses !== customFilters.status) match = false;
            if (customFilters.minPrice && client.Price < parseFloat(customFilters.minPrice)) match = false;
            return match;
        }
        return true;
    });

    const handleGenerateMessage = async () => {
        setLoading(true);
        const generatedMsg = await generateMessage(prompt, tone);
        setMessage(generatedMsg);
        setShowPreview(true);
        setLoading(false);
    };

    const insertVariable = (variable) => {
        setMessage(message + ` {${variable}}`);
    };

    const handleSendCampaign = async () => {
        if (!credentials.whatsapp_access_token || !credentials.whatsapp_phone_id) {
            alert('Please configure WhatsApp API credentials in the Integration page first.');
            return;
        }

        setSending(true);
        setSentCount(0);
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < filteredClients.length; i++) {
            const client = filteredClients[i];
            const personalizedMsg = personalizeMessage(message, client);

            try {
                await sendWhatsAppMessage(client.Phone, personalizedMsg, credentials);
                successCount++;
            } catch (error) {
                console.error(`Failed to send to ${client.Client}:`, error);
                errorCount++;
            }

            setSentCount(i + 1);
            // Throttle to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setSending(false);
        alert(`Campaign complete!\nSuccess: ${successCount}\nErrors: ${errorCount}`);
    };

    const personalizeMessage = (template, client) => {
        return template
            .replace('{name}', client.Client)
            .replace('{city}', client.City)
            .replace('{item}', client.Items)
            .replace('{price}', client.Price);
    };

    const estimatedCost = (filteredClients.length * 0.001).toFixed(2);

    return (
        <div className={styles.container}>
            {/* Header Stats */}
            <div className={styles.statsGrid}>
                <div className={`glass-panel ${styles.statCard}`}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>Total Audience</h3>
                        <p className={styles.statValue}>{filteredClients.length}</p>
                        <span className={styles.statLabel}>Selected clients</span>
                    </div>
                </div>

                <div className={`glass-panel ${styles.statCard}`}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>Est. Reach</h3>
                        <p className={styles.statValue}>{Math.round(filteredClients.length * 0.85)}</p>
                        <span className={styles.statLabel}>Expected opens</span>
                    </div>
                </div>

                <div className={`glass-panel ${styles.statCard}`}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <Zap size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>Est. Cost</h3>
                        <p className={styles.statValue}>${estimatedCost}</p>
                        <span className={styles.statLabel}>Per message $0.001</span>
                    </div>
                </div>

                <div className={`glass-panel ${styles.statCard}`}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>Sent Today</h3>
                        <p className={styles.statValue}>{sentCount}</p>
                        <span className={styles.statLabel}>Messages delivered</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainGrid}>
                {/* Left Panel - Audience & Message Builder */}
                <div className={styles.leftPanel}>
                    {/* Audience Selector */}
                    <div className={`glass-panel ${styles.section}`}>
                        <h3><Target size={20} /> Target Audience</h3>

                        <div className={styles.segmentButtons}>
                            <button
                                className={`${styles.segmentBtn} ${selectedSegment === 'all' ? styles.active : ''}`}
                                onClick={() => setSelectedSegment('all')}
                            >
                                All Clients
                            </button>
                            <button
                                className={`${styles.segmentBtn} ${selectedSegment === 'confirmed' ? styles.active : ''}`}
                                onClick={() => setSelectedSegment('confirmed')}
                            >
                                Confirmed
                            </button>
                            <button
                                className={`${styles.segmentBtn} ${selectedSegment === 'delivered' ? styles.active : ''}`}
                                onClick={() => setSelectedSegment('delivered')}
                            >
                                Delivered
                            </button>
                            <button
                                className={`${styles.segmentBtn} ${selectedSegment === 'custom' ? styles.active : ''}`}
                                onClick={() => setSelectedSegment('custom')}
                            >
                                <Filter size={16} /> Custom
                            </button>
                        </div>

                        {selectedSegment === 'custom' && (
                            <div className={styles.customFilters}>
                                <input
                                    type="text"
                                    placeholder="City..."
                                    value={customFilters.city}
                                    onChange={(e) => setCustomFilters({ ...customFilters, city: e.target.value })}
                                />
                                <select
                                    value={customFilters.status}
                                    onChange={(e) => setCustomFilters({ ...customFilters, status: e.target.value })}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Min Price..."
                                    value={customFilters.minPrice}
                                    onChange={(e) => setCustomFilters({ ...customFilters, minPrice: e.target.value })}
                                />
                            </div>
                        )}

                        <div className={styles.audiencePreview}>
                            <p><strong>{filteredClients.length}</strong> clients selected</p>
                            <div className={styles.clientChips}>
                                {filteredClients.slice(0, 5).map((client, idx) => (
                                    <div key={idx} className={styles.clientChip}>
                                        <div className={styles.chipAvatar}>{client.Client.charAt(0)}</div>
                                        <span>{client.Client}</span>
                                    </div>
                                ))}
                                {filteredClients.length > 5 && (
                                    <div className={styles.clientChip}>
                                        <span>+{filteredClients.length - 5} more</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Message Generator */}
                    <div className={`glass-panel ${styles.section}`}>
                        <h3><Sparkles size={20} /> AI Message Generator</h3>

                        <div className={styles.toneSelector}>
                            <label>Tone:</label>
                            <div className={styles.toneButtons}>
                                <button
                                    className={tone === 'professional' ? styles.active : ''}
                                    onClick={() => setTone('professional')}
                                >
                                    Professional
                                </button>
                                <button
                                    className={tone === 'friendly' ? styles.active : ''}
                                    onClick={() => setTone('friendly')}
                                >
                                    Friendly
                                </button>
                                <button
                                    className={tone === 'urgent' ? styles.active : ''}
                                    onClick={() => setTone('urgent')}
                                >
                                    Urgent
                                </button>
                            </div>
                        </div>

                        <textarea
                            className={styles.promptInput}
                            placeholder="Describe your campaign... (e.g., 'Promote our new winter collection with 20% discount')"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                        />

                        <button
                            className={styles.generateBtn}
                            onClick={handleGenerateMessage}
                            disabled={!prompt || loading}
                        >
                            <Sparkles size={18} />
                            {loading ? 'Generating...' : 'Generate Message'}
                        </button>

                        <div className={styles.variableButtons}>
                            <p>Insert variables:</p>
                            <button onClick={() => insertVariable('name')}>{'{name}'}</button>
                            <button onClick={() => insertVariable('city')}>{'{city}'}</button>
                            <button onClick={() => insertVariable('item')}>{'{item}'}</button>
                            <button onClick={() => insertVariable('price')}>{'{price}'}</button>
                        </div>

                        <textarea
                            className={styles.messageInput}
                            placeholder="Your message will appear here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                        />

                        <div className={styles.messageTools}>
                            <button className={styles.toolBtn}><Smile size={18} /> Emoji</button>
                            <button className={styles.toolBtn}><ImageIcon size={18} /> Image</button>
                            <button className={styles.toolBtn}><LinkIcon size={18} /> Link</button>
                            <span className={styles.charCount}>{message.length} / 1000</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Preview & Send */}
                <div className={styles.rightPanel}>
                    {/* WhatsApp Preview */}
                    <div className={`glass-panel ${styles.previewSection}`}>
                        <h3><MessageCircle size={20} /> Message Preview</h3>

                        <div className={styles.whatsappPreview}>
                            <div className={styles.whatsappHeader}>
                                <div className={styles.whatsappAvatar}>
                                    {filteredClients[0]?.Client?.charAt(0) || 'C'}
                                </div>
                                <div className={styles.whatsappInfo}>
                                    <strong>{filteredClients[0]?.Client || 'Client Name'}</strong>
                                    <span>{filteredClients[0]?.Phone || '+212 XXX XXX XXX'}</span>
                                </div>
                            </div>

                            <div className={styles.whatsappChat}>
                                {message && (
                                    <div className={styles.messageBubble}>
                                        <p>{personalizeMessage(message, filteredClients[0] || { Client: 'John', City: 'Casablanca', Items: 'Product', Price: 100 })}</p>
                                        <span className={styles.messageTime}>
                                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            <CheckCircle size={14} className={styles.checkMark} />
                                        </span>
                                    </div>
                                )}
                                {!message && (
                                    <div className={styles.emptyPreview}>
                                        <MessageCircle size={48} />
                                        <p>Generate or type a message to see preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Send Controls */}
                    <div className={`glass-panel ${styles.sendSection}`}>
                        <h3><Send size={20} /> Campaign Controls</h3>

                        <div className={styles.sendStats}>
                            <div className={styles.sendStat}>
                                <Phone size={16} />
                                <span>{filteredClients.length} recipients</span>
                            </div>
                            <div className={styles.sendStat}>
                                <Zap size={16} />
                                <span>${estimatedCost} cost</span>
                            </div>
                            <div className={styles.sendStat}>
                                <Clock size={16} />
                                <span>~{Math.ceil(filteredClients.length / 2)} min</span>
                            </div>
                        </div>

                        {sending && (
                            <div className={styles.sendingProgress}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${(sentCount / filteredClients.length) * 100}%` }}
                                    />
                                </div>
                                <p>Sending... {sentCount} / {filteredClients.length}</p>
                            </div>
                        )}

                        <div className={styles.sendButtons}>
                            <button
                                className={styles.scheduleBtn}
                                disabled={!message || sending}
                            >
                                <Clock size={18} />
                                Schedule
                            </button>
                            <button
                                className={styles.sendBtn}
                                onClick={handleSendCampaign}
                                disabled={!message || sending || filteredClients.length === 0}
                            >
                                <Send size={18} />
                                {sending ? 'Sending...' : 'Send Now'}
                            </button>
                        </div>

                        <div className={styles.apiStatus}>
                            {credentials.whatsapp_access_token ? (
                                <div className={styles.statusConnected}>
                                    <CheckCircle size={16} />
                                    <span>WhatsApp API Connected</span>
                                </div>
                            ) : (
                                <div className={styles.statusDisconnected}>
                                    <span>⚠️ Configure WhatsApp API in Integration</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsApp;
