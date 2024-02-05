const AuditLog = require('../models/AuditLog'); // Assuming an AuditLog model exists

class AuditLogService {
    /**
     * Record an action, event, or change in the application.
     * @param {Object} logDetails - Details of the log to record.
     */
    static async record(logDetails) {
        try {
            const logEntry = new AuditLog(logDetails);
            await logEntry.save();
            console.log('Audit log recorded:', logEntry);
        } catch (error) {
            console.error('Failed to record audit log:', error);
            throw error;
        }
    }

    /**
     * Retrieve audit logs with optional filtering.
     * @param {Object} filter - Criteria to filter logs.
     * @param {Object} options - Options for sorting, pagination, etc.
     */
   /**
 * Retrieve audit logs with advanced filtering, sorting, and pagination.
 * @param {Object} filter - Criteria to filter logs. Supports complex queries.
 * @param {Object} options - Enhanced options for sorting, pagination, etc.
 */
static async getLogs(filter = {}, options = {}) {
    try {
        // Extract pagination and sorting options, providing defaults
        const { page = 1, pageSize = 10, sortBy = 'timestamp', sortOrder = -1 } = options;

        // Calculate skip value for pagination
        const skip = (page - 1) * pageSize;

        // Construct sorting object based on input
        const sort = { [sortBy]: sortOrder };

        // Remove pagination and sorting keys from options to avoid conflicts in .find()
        delete options.page;
        delete options.pageSize;
        delete options.sortBy;
        delete options.sortOrder;

        // Merge remaining options with sort and skip for final query
        const queryOptions = { ...options, sort, limit: pageSize, skip };

        const logs = await AuditLog.find(filter, null, queryOptions).exec();

        // Optionally, add logic to count total logs matching filter for pagination metadata
        const totalLogs = await AuditLog.countDocuments(filter);

        // Construct and return response object with logs and pagination details
        return {
            logs,
            totalLogs,
            totalPages: Math.ceil(totalLogs / pageSize),
            currentPage: page,
        };
    } catch (error) {
        console.error('Failed to retrieve audit logs:', error);
        throw error;
    }
}


module.exports = AuditLogService;
