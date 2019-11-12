const date = new Date();
const year = date.getFullYear();

const APPCONFIG = {
  brand: 'ProjectName',
  user: 'OwnerName',
  year,
  productLink: 'project link',
  AutoCloseMobileNav: true,                         // true, false. Automatically close sidenav on route change (Mobile only)
  color: {
    primary: '#00BCD4',
    success: '#8BC34A',
    info: '#66BB6A',
    infoAlt: '#7E57C2',
    warning: '#FFCA28',
    danger: '#F44336',
    text: '#3D4051',
    gray: '#EDF0F1'
  },
  settings: {
    layoutBoxed: false,                             // true, false
    navCollapsed: false,                            // true, false
    navBehind: false,                               // true, false
    fixedHeader: true,                              // true, false
    sidebarWidth: 'middle',                         // small, middle, large
    colorOption: '14',                              // String: 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
    theme: 'light',                                 // light, gray, dark
  },
  api_url: process.env.API_URL,
  company_logo_path: '/assets/images/secberus-logo.png',
  company_logo_path2: '/assets/images/logo-white.png',
  cloudStaticData: { 
    'aws': { name: 'Amazon Web Service', cloudIconPath: '/assets/images/aws.png' },
    'gcp': { name: 'Google Cloud Platform', cloudIconPath: '/assets/images/google-cloud.png' },
    'azure': { name: 'Azure', cloudIconPath: '/assets/images/azure.png' },
    'all': { name: 'All', cloudIconPath: '/assets/images/all.png' },
    'slack': { name: 'Slack', cloudIconPath: '/assets/images/slack.png' },
    'cloud_aws': { name: 'Amazon Web Service', cloudIconPath: '/assets/images/cloud_aws.png' },
    'cloud_gcp': { name: 'Google Cloud Platform', cloudIconPath: '/assets/images/cloud_gcp.png' },
    'cloud_azure': { name: 'Azure', cloudIconPath: '/assets/images/cloud_azure.png' },
    'cloud_all': { name: 'All', cloudIconPath: '/assets/images/cloud_all.png' },
 }
};

export default APPCONFIG;
