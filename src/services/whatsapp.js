/**
 * WhatsApp Cloud API Service
 */

/**
 * Send a WhatsApp message using Meta Cloud API
 * @param {string} to - Recipient phone number
 * @param {string} message - Personal message text
 * @param {object} credentials - WhatsApp API credentials (phone_id, access_token)
 */
export const sendWhatsAppMessage = async (to, message, credentials) => {
    const { whatsapp_phone_id, whatsapp_access_token } = credentials;

    if (!whatsapp_phone_id || !whatsapp_access_token) {
        throw new Error('WhatsApp API credentials missing');
    }

    // Clean phone number (remove +, spaces, etc)
    const cleanNumber = to.replace(/[^0-9]/g, '');

    const url = `https://graph.facebook.com/v18.0/${whatsapp_phone_id}/messages`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${whatsapp_access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanNumber,
                type: 'text',
                text: {
                    body: message
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to send WhatsApp message');
        }

        return data;
    } catch (error) {
        console.error('WhatsApp API Error:', error);
        throw error;
    }
};
