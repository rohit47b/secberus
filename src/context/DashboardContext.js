import React from "react";

const state = {
    securityIssue: { count: 0, data: [] },
    totalAccounts: { count: 100, data: [] },
    totalAssets: { count: 0, data: [] },
    securityGroups: { count: 0, data: [] },
    externalIps: { count: 0, data: [] },
    assets_inventory: {},
    alert_region: {}
};

const DashboardContext = React.createContext(state); //passing initial value

export default DashboardContext