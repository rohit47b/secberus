/*
 * @Author: Virendra Patidar 
 * @Date: 2018-12-14 09:39:14 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-19 10:41:31
 */


const STATIC_DATA = {
    USER_ROLES:
    [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Report Recipient', value: 'report_recipient' }
    ],
    STATUS_LIST:
        [
            { display_name: 'PASS', value: 'pass' },
            { display_name: 'FAIL', value: 'fail' },
            { display_name: 'ERROR', value: 'error' }
        ],
    PRIORITY_LIST: [
        { display_name: 'High', value: 'high' },
        { display_name: 'Low', value: 'low' },
        { display_name: 'Medium', value: 'medium' }
    ],
    REGION_LIST:
        [
            { region_code: "us-east-1", region_name: "US East (N. Virginia)" },
            { region_code: "us-east-2", region_name: "US East (Ohio)" },
            { region_code: "us-west-1", region_name: "US West (N. California)" },
            { region_code: "us-west-2", region_name: "US West (Oregon)" },
            { region_code: "ca-central-1", region_name: "Canada (Central)" },
            { region_code: "eu-west-1", region_name: "EU (Ireland)" },
            { region_code: "eu-central-1", region_name: "EU (Frankfurt)" },
            { region_code: "eu-west-2", region_name: "EU (London)" },
            { region_code: "eu-west-3", region_name: "EU (Paris)" },
            { region_code: "ap-northeast-1", region_name: "Asia Pacific (Tokyo)" },
            { region_code: "ap-northeast-2", region_name: "Asia Pacific (Seoul)" },
            { region_code: "ap-southeast-1", region_name: "Asia Pacific (Singapore)" },
            { region_code: "ap-southeast-2", region_name: "Asia Pacific (Sydney)" },
            { region_code: "ap-south-1", region_name: "Asia Pacific (Mumbai)" },
            { region_code: "sa-east-1", region_name: "South America (São Paulo)" },
            { region_code: "us-gov-west-1", region_name: "US Gov West 1" }
        ]
}

export default STATIC_DATA;