/*
 * @Author: Virendra Patidar 
 * @Date: 2018-11-16 10:09:19 
 * @Desciption :- errorHandle method used for API error response handle, 
 *               If custom error exist return that else return 500 Internal server error
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-16 10:11:50
 */

export function errorHandle(error) {
    if (error.data && error.data.items && error.data.items.non_field_errors) {
        return error.data.items.non_field_errors[0];
    } else if (error.data && error.data.items && Object.keys(error.data.items).length > 0){
        return error.data.items
    }else if (error.data && error.data.message) {
        return error.data.message;
    }else if (error.data && error.data.detail) {
        return error.data.detail;
    } else {
        return 'Internal server error, Please try after some time'
    }
}