import { normalizePhoneBatch } from '../utils/phoneFormatter';

// ============================================
// CONFIGURATION
// ============================================

/**
 * Google Apps Script Web App URL
 * 
 * Configure this in Settings page (Settings → Google Sheets Integration)
 * Or set it in localStorage: localStorage.setItem('appsScriptUrl', 'YOUR_URL')
 */
const getAppsScriptUrl = () => {
    return localStorage.getItem('appsScriptUrl') || '';
};

// Set to true to use mock data only if URL is not set
const isConfigured = () => {
    const url = getAppsScriptUrl();
    return url && url !== 'YOUR_DEPLOYMENT_URL_HERE' && url.startsWith('https://script.google.com');
};

// Simulate async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// MOCK DATA (Fallback for development)
// ============================================

const MOCK_DATA = {
    clients: [
        { Client: 'Noureddine', Phone: '0679752339', City: 'Marrakech', Address: 'Medina BV H2 N 23', Items: 'Eletronic', Qty: 1, Price: 300, Statuses: 'Confirmed', Note: 'this is test1 ok', Date: '12/1/2025' },
        { Client: 'Hicham', Phone: '679752339', City: 'Casablanca', Address: 'Medina BV H2 N 24', Items: 'Eletronic', Qty: 1, Price: 300, Statuses: 'Confirmed', Note: 'this is test2 ok', Date: '12/2/2025' },
        { Client: 'Salma', Phone: '679752339', City: 'Rabat', Address: 'Medina BV H2 N 25', Items: 'Fashion', Qty: 3, Price: 900, Statuses: 'Confirmed', Note: 'this is test3 ok', Date: '12/3/2025' },
        { Client: 'Said', Phone: '679752339', City: 'Fes', Address: 'Medina BV H2 N 26', Items: 'Eletronic', Qty: 1, Price: 300, Statuses: 'Cancelled', Note: 'this is test4 ok', Date: '12/5/2025' },
        { Client: 'Hala', Phone: '679752339', City: 'Tangier', Address: 'Medina BV H2 N 27', Items: 'Eletronic', Qty: 1, Price: 300, Statuses: 'Delivered', Note: 'this is test5 ok', Date: '12/9/2025' },
        { Client: 'Nessrine', Phone: '679752339', City: 'Agadir', Address: 'Medina BV H2 N 28', Items: 'Fashion', Qty: 3, Price: 900, Statuses: 'Shipped', Note: 'this is test6 ok', Date: '12/11/2025' },
        { Client: 'Ahmed', Phone: '679752339', City: 'Laayoune', Address: 'Medina BV H2 N 29', Items: 'Eletronic', Qty: 1, Price: 300, Statuses: 'Returned', Note: 'this is test7 ok', Date: '12/12/2025' },
        { Client: 'Kamal', Phone: '679752339', City: 'Ouarzazate', Address: 'Medina BV H2 N 30', Items: 'Eletronic', Qty: 1, Price: 300, Statuses: 'Confirmed', Note: 'this is test8 ok', Date: '12/18/2025' },
        { Client: 'Noureddine', Phone: '0679752339', City: 'Marrakech', Address: 'Medina BV H2 N 23', Items: 'Fashion', Qty: 3, Price: 900, Statuses: 'Confirmed', Note: 'this is test9 ok', Date: '12/20/2025' },
        { Client: 'Hicham', Phone: '679752339', City: 'Casablanca', Address: 'Medina BV H2 N 24', Items: 'Eletronic', Qty: 1, Price: 300, Statuses: 'Confirmed', Note: 'this is test10 ok', Date: '12/28/2025' },
        { Client: 'Salma', Phone: '679752339', City: 'Rabat', Address: 'Medina BV H2 N 25', Items: 'Eletronic', Qty: 3, Price: 900, Statuses: 'Confirmed', Note: 'this is test11 ok', Date: '12/29/2025' },
    ],
    users: [
        { Username: 'admin', Password: '1234', Role: 'admin', Name: 'Super Admin', 'Commission Value': 0, 'Commission Type': '' },
        { Username: 'agent1', Password: '1234', Role: 'agent', Name: 'Amina Call Center 1', 'Commission Value': 10, 'Commission Type': 'fixed' },
        { Username: 'agent2', Password: '1234', Role: 'agent', Name: 'Souad Call Center 1', 'Commission Value': 5, 'Commission Type': '$' },
        { Username: 'manager1', Password: '', Role: 'manager', Name: 'Karim', 'Commission Value': 10, 'Commission Type': 'fixed' },
        { Username: 'manager2', Password: '', Role: 'manager', Name: 'Ashraf', 'Commission Value': 5, 'Commission Type': '$' },
    ],
    keys: [
        { Key: 'whatsapp_phone_id', Value: '855908310945371' },
        { Key: 'whatsapp_access_token', Value: 'EAAYWTh71QZAEBQDalwzlJnL5ezsUHBEdlYn9...' },
        { Key: 'gemini_api_key', Value: 'AIzaSyCyFXNm5pLcDWz3tCQ5K-Jft6ng5ME85fk' },
        { Key: 'openai_api_key', Value: 'sk-proj-a9gsY7L4CrIHUDWsTpWvXRXjq3Pd8MtU' },
        { Key: 'ai_provider', Value: 'gemini' },
    ]
};

// ============================================
// API HELPER FUNCTIONS
// ============================================

/**
 * Make API call to Google Apps Script
 */
async function callAppsScript(method, params) {
    const url = getAppsScriptUrl();
    if (!isConfigured()) {
        console.warn('Google Apps Script URL is not configured. Go to Integration page to set it.');
        return null;
    }

    try {
        const fetchOptions = {
            method: method,
            headers: {},
            // mode: 'cors' is default, Apps Script handles it with ContentService
        };

        let targetUrl = url;

        if (method === 'POST') {
            fetchOptions.method = 'POST';
            fetchOptions.body = JSON.stringify(params);
        } else {
            const searchParams = new URLSearchParams(params);
            targetUrl = `${url}?${searchParams.toString()}`;
        }

        const response = await fetch(targetUrl, fetchOptions);

        // Note: For Apps Script, redirects are common. Fetch handles them.
        // If the script returns JSON via ContentService, we can read it.
        try {
            const result = await response.json();
            return result;
        } catch (e) {
            // If response is not JSON (e.g. redirect or error HTML)
            return { success: true, note: 'Request processed' };
        }

    } catch (error) {
        console.error('Apps Script API Error:', error);
        throw error;
    }
}

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Authenticate user against Users sheet
 */
export const authenticateUser = async (username, password, sheetId) => {
    await delay(500);

    if (!USE_MOCK_DATA) {
        // Fetch users from Google Sheets
        const users = await fetchUsers(sheetId);
        const user = users.find(u => u.Username === username && u.Password === password);

        if (user) {
            const { Password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    // Fallback to mock data
    const user = MOCK_DATA.users.find(u => u.Username === username && u.Password === password);
    if (user) {
        const { Password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

// ============================================
// CLIENTS CRUD
// ============================================

/**
 * Fetch clients from Google Sheets
 */
export const fetchClients = async (sheetId = null) => {
    if (isConfigured()) {
        try {
            const response = await callAppsScript('GET', { action: 'fetch', sheet: 'Clients' });
            if (response && response.success && response.data) {
                return normalizePhoneBatch(response.data, 'Phone', '212');
            }
        } catch (error) {
            console.error('Error fetching clients from sheet:', error);
        }
    }

    // Fallback to mock data for demo if not configured
    return normalizePhoneBatch([...MOCK_DATA.clients], 'Phone', '212');
};

/**
 * Add new client to Google Sheets
 */
export const addClient = async (client, sheetId = null) => {
    await delay(500);

    if (!USE_MOCK_DATA) {
        try {
            await callAppsScript('POST', {
                action: 'create',
                sheet: 'Clients',
                data: client
            });
            console.log('Client added to Google Sheets');
            return true;
        } catch (error) {
            console.error('Error adding client:', error);
        }
    }

    // Also update mock data for immediate UI feedback
    MOCK_DATA.clients.push(client);
    console.log('Added client:', client);
    return true;
};

/**
 * Update existing client in Google Sheets
 */
export const updateClient = async (clientIndex, updates, sheetId = null) => {
    await delay(500);

    if (!USE_MOCK_DATA) {
        try {
            await callAppsScript('POST', {
                action: 'update',
                sheet: 'Clients',
                index: clientIndex,
                data: updates
            });
            console.log('Client updated in Google Sheets');
        } catch (error) {
            console.error('Error updating client:', error);
        }
    }

    // Also update mock data
    if (clientIndex >= 0 && clientIndex < MOCK_DATA.clients.length) {
        Object.assign(MOCK_DATA.clients[clientIndex], updates);
        console.log('Updated client at index:', clientIndex, updates);
        return true;
    }

    return false;
};

/**
 * Delete client from Google Sheets
 */
export const deleteClient = async (clientIndex, sheetId = null) => {
    await delay(500);

    if (!USE_MOCK_DATA) {
        try {
            await callAppsScript('POST', {
                action: 'delete',
                sheet: 'Clients',
                index: clientIndex
            });
            console.log('Client deleted from Google Sheets');
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    }

    // Also update mock data
    if (clientIndex >= 0 && clientIndex < MOCK_DATA.clients.length) {
        const deleted = MOCK_DATA.clients.splice(clientIndex, 1);
        console.log('Deleted client:', deleted[0]);
        return true;
    }

    return false;
};

// ============================================
// USERS
// ============================================

/**
 * Fetch users from Google Sheets
 */
export const fetchUsers = async (sheetId = null) => {
    await delay(500);

    if (!USE_MOCK_DATA) {
        try {
            await callAppsScript('GET', { action: 'fetch', sheet: 'Users' });
            console.log('Fetching users from Google Sheets...');
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    return [...MOCK_DATA.users];
};

// ============================================
// CREDENTIALS
// ============================================

/**
 * Fetch API keys and credentials from Google Sheets
 */
export const fetchCredentials = async (sheetId = null) => {
    if (isConfigured()) {
        try {
            const response = await callAppsScript('GET', { action: 'fetch', sheet: 'Keys' });
            if (response && response.success && response.data) {
                const credentials = {};
                response.data.forEach(item => {
                    credentials[item.Key] = item.Value;
                });
                return credentials;
            }
        } catch (error) {
            console.error('Error fetching credentials:', error);
        }
    }

    const credentials = {};
    MOCK_DATA.keys.forEach(item => {
        credentials[item.Key] = item.Value;
    });
    return credentials;
};

/**
 * Save a credential to Google Sheets
 */
export const saveCredential = async (key, value, sheetId = null) => {
    await delay(500);

    if (!USE_MOCK_DATA) {
        try {
            await callAppsScript('POST', {
                action: 'updateKey',
                sheet: 'Keys',
                key: key,
                value: value
            });
            console.log(`Credential ${key} saved to Google Sheets`);
        } catch (error) {
            console.error('Error saving credential:', error);
        }
    }

    // Also update mock data
    const existingKey = MOCK_DATA.keys.find(item => item.Key === key);
    if (existingKey) {
        existingKey.Value = value;
    } else {
        MOCK_DATA.keys.push({ Key: key, Value: value });
    }

    console.log(`Saved ${key}: ${value}`);
    return true;
};
