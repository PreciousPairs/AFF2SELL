// /frontend/components/AdminDashboardContent.tsx
import React, { useState, useEffect } from 'react';
import { fetchSystemHealth, fetchUserLogs, fetchAnalyticsData, getSystemSettings, getSecurityAudits } from '../api/adminServices';
import SystemHealthIndicator from './common/SystemHealthIndicator';
import UserManagementPanel from './UserManagementPanel';
import AnalyticsCharts from './AnalyticsCharts';
import SystemSettingsForm from './SystemSettingsForm';
import FeedbackReports from './FeedbackReports';
import SecurityAuditLogs from './SecurityAuditLogs';

const AdminDashboardContent = () => {
    const [systemHealth, setSystemHealth] = useState({});
    const [userLogs, setUserLogs] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({});
    const [systemSettings, setSystemSettings] = useState({});
    const [securityAudits, setSecurityAudits] = useState([]);

    useEffect(() => {
        // Fetch all necessary data for the admin dashboard on component mount
        const loadData = async () => {
            setSystemHealth(await fetchSystemHealth());
            setUserLogs(await fetchUserLogs());
            setAnalyticsData(await fetchAnalyticsData());
            setSystemSettings(await getSystemSettings());
            setSecurityAudits(await getSecurityAudits());
        };
        loadData();
    }, []);

    return (
        <div className="admin-dashboard-content">
            <h1>Admin Dashboard</h1>
            <SystemHealthIndicator healthData={systemHealth} />
            <UserManagementPanel userLogs={userLogs} />
            <AnalyticsCharts data={analyticsData} />
            <SystemSettingsForm settings={systemSettings} />
            <FeedbackReports />
            <SecurityAuditLogs logs={securityAudits} />
        </div>
    );
};

export default AdminDashboardContent;