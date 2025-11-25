export function logSecurityEvent(eventType, message, req = null) {
    const timestamp = new Date().toISOString();
    const ip = req ? (req.ip || req.connection?.remoteAddress) : 'N/A';
    const userAgent = req ? req.get('user-agent') : 'N/A';
    const url = req ? req.originalUrl : 'N/A';
    const method = req ? req.method : 'N/A';

    console.log(`[SECURITY] ${timestamp} - ${eventType}: ${message}`);
    console.log(`  IP: ${ip} | User-Agent: ${userAgent} | ${method} ${url}`);
}

export function logActivity(action, details, req = null) {
    const timestamp = new Date().toISOString();
    const userId = req?.user?.uid || 'N/A';
    const userEmail = req?.user?.email || 'N/A';
    const ip = req ? (req.ip || req.connection?.remoteAddress) : 'N/A';

    console.log(`[ACTIVITY] ${timestamp} - ${action}`);
    console.log(`  User: ${userEmail} (${userId}) | IP: ${ip} | Details:`, details);
}
