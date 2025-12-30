export const generateMessage = async (prompt, templateType, clientName) => {
    // Simulate AI latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const templates = {
        vip: `Hello ${clientName}, as one of our VIP customers, we have an exclusive offer for you based on your recent interest in [Product].`,
        returning: `Hi ${clientName}, it's been a while! We've updated our catalog and thought you might like these new items.`,
        new: `Welcome ${clientName}! Thanks for joining us. Here is a 10% discount code for your first order: WELCOME10`
    };

    const base = templates[templateType.toLowerCase()] || `Hello ${clientName}, checking in regarding your order.`;

    if (prompt) {
        return `${base}\n\n[AI Adjustment based on "${prompt}"]: We also noticed you prefer premium quality, so we've highlighted our top-tier selection just for you.`;
    }

    return base;
};
