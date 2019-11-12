/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-11 16:42:19 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-10-12 12:18:10
 */
import requestWithToken from './requestWithToken'
import requestWithTokenFile from './requestWithTokenFile'


function fetchProfileDetail() {
    return requestWithToken({
        url: 'users/getDetails/',
        method: 'GET'
    });
}

function updateProfileDetail(data) {
    return requestWithToken({
        url: 'users/updateDetails/',
        method: 'POST',
        data
    });
}
function photoUpload(data) {
    return requestWithTokenFile({
        url: 'users/photoUpload/',
        method: 'PUT',
        data
    });
}


const ProfileService = {
    fetchProfileDetail,
    updateProfileDetail,
    photoUpload
}

export default ProfileService;