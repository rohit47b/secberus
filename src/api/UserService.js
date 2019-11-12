import requestWithToken from './requestWithToken'

function fetchUserList(data) {
    return requestWithToken({
        url: '/api/1.0/account/users',
        method: 'GET'
    });
}
function AddEditUser(data) {
    return requestWithToken({
        url: '/api/1.0/account/users',
        method: 'POST',
        data
    });
}

function DeleteUser(userId) {
    return requestWithToken({
        url: '/api/1.0/account/user/'+userId,
        method: 'DELETE',
    });
}

function fetchUserListByAdmin(data) {
    return requestWithToken({
        url: 'admin/list-company/users',
        method: 'POST',
        data
    });
}

function fetchInviteUserList(data) {
    return requestWithToken({
        url: 'company/users/list-invitees',
        method: 'POST',
        data
    });
}

function fetchUserCount() {
    return requestWithToken({
        url: 'company/users/state/count',
        method: 'GET',
    });
}

function fetchUserCountByAdmin(data) {
    return requestWithToken({
        url: 'admin/count-company/users',
        method: 'POST',
        data
    });
}

function fetchLastUpdateTime(data) {
    return requestWithToken({
        url: 'security-policy/last/update/state',
        method: 'POST',
        data
    });
}

function userActiveDeactive(data) {
    return requestWithToken({
        url: 'company/users/state/change',
        method: 'POST',
        data
    });
}

function resetPasswordSendMail(data) {
    return requestWithToken({
        url: 'company/users/password/email',
        method: 'POST',
        data
    });
}

function enableTwoFactorAuth(data) {
    return requestWithToken({
        url: 'api/1.0/account/user/enable-two-factor-auth',
        method: 'POST',
        data
    });
}

function disableTwoFactorAuth(data) {
    return requestWithToken({
        url: 'api/1.0/account/user/disable-two-factor-auth',
        method: 'POST',
        data
    });
}


const UserService = {
    fetchUserList,
    AddEditUser,
    DeleteUser,
    
    fetchUserListByAdmin,
    fetchUserCount,
    fetchUserCountByAdmin,
    fetchLastUpdateTime,
    userActiveDeactive,
    resetPasswordSendMail,
    fetchInviteUserList,
    enableTwoFactorAuth,
    disableTwoFactorAuth

}

export default UserService;
