/**
 * Phone Number Formatter Utility
 * Normalizes phone numbers for WhatsApp API compatibility
 * Handles various formats: +212679752339, 212 679-752339, 0679752339, etc.
 */

/**
 * Normalize a phone number to international format without symbols
 * @param {string} phone - Raw phone number in any format
 * @param {string} defaultCountryCode - Default country code if not present (e.g., '212' for Morocco)
 * @returns {string} Normalized phone number (e.g., '212679752339')
 */
export const normalizePhone = (phone, defaultCountryCode = '212') => {
    if (!phone) return '';
    
    // Convert to string and remove all non-digit characters except leading +
    let cleaned = String(phone).trim();
    
    // Remove all symbols and spaces: -, (, ), spaces, etc.
    cleaned = cleaned.replace(/[\s\-\(\)\.]/g, '');
    
    // Remove leading + if present
    if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
    }
    
    // Remove leading 00 (international prefix)
    if (cleaned.startsWith('00')) {
        cleaned = cleaned.substring(2);
    }
    
    // Handle local format starting with 0 (e.g., 0679752339)
    if (cleaned.startsWith('0') && cleaned.length === 10) {
        // Remove leading 0 and add country code
        cleaned = defaultCountryCode + cleaned.substring(1);
    }
    
    // If number doesn't start with country code and is 9 digits, add country code
    if (!cleaned.startsWith(defaultCountryCode) && cleaned.length === 9) {
        cleaned = defaultCountryCode + cleaned;
    }
    
    return cleaned;
};

/**
 * Format phone number for display (with country code separated)
 * @param {string} phone - Normalized phone number
 * @returns {string} Formatted phone number (e.g., '+212 679752339')
 */
export const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    
    const normalized = normalizePhone(phone);
    
    // Add + and space after country code (assuming 3-digit country code)
    if (normalized.length >= 10) {
        return `+${normalized.substring(0, 3)} ${normalized.substring(3)}`;
    }
    
    return `+${normalized}`;
};

/**
 * Validate if phone number is valid for WhatsApp
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidWhatsAppPhone = (phone) => {
    const normalized = normalizePhone(phone);
    
    // WhatsApp numbers should be 10-15 digits
    return normalized.length >= 10 && normalized.length <= 15 && /^\d+$/.test(normalized);
};

/**
 * Batch normalize phone numbers in an array of objects
 * @param {Array} items - Array of objects with phone field
 * @param {string} phoneField - Name of the phone field (default: 'Phone')
 * @param {string} defaultCountryCode - Default country code
 * @returns {Array} Array with normalized phone numbers
 */
export const normalizePhoneBatch = (items, phoneField = 'Phone', defaultCountryCode = '212') => {
    return items.map(item => ({
        ...item,
        [phoneField]: normalizePhone(item[phoneField], defaultCountryCode)
    }));
};
