// Tenant middleware to automatically inject tenantId into requests

const tenantMiddleware = (req, res, next) => {
    // Extract tenantId from authenticated user
    if (req.user) {
        // For regular users and admins, use their tenantId
        if (req.user.tenantId) {
            req.tenantId = req.user.tenantId;
        }

        // Super admins can optionally specify a tenant via header
        if (req.user.role === 'superadmin') {
            const headerTenantId = req.headers['x-tenant-id'];
            if (headerTenantId) {
                req.tenantId = headerTenantId;
            }
        }
    }

    // If no tenantId found from user (or public request), check header
    if (!req.tenantId && req.headers['x-tenant-id']) {
        req.tenantId = req.headers['x-tenant-id'];
    }

    next();
};

module.exports = tenantMiddleware;
