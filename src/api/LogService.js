import requestWithToken from './requestWithToken'


function fetchLogs(data) {
    return requestWithToken({
        url: 'logs/list-logs/',
        method: 'POST',
        data
    });
}

const LogService = {
    fetchLogs
}

export default LogService;