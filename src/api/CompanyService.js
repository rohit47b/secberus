/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-30 11:15:16 
 * @Last Modified by:   Virendra Patidar 
 * @Last Modified time: 2018-10-30 11:15:16 
 */
import requestWithToken from './requestWithToken'

function fetchCompanyList() {
    return requestWithToken({
        url: 'company/list',
        method: 'GET'
    });
}

const CompanyService = {
    fetchCompanyList
}

export default CompanyService;