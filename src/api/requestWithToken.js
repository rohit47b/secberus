/*
 * @Author: Virendra Patidar 
 * @Date: 2018-07-11 14:09:03 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-08 19:25:04
 */
import axios from 'axios'

import Config from 'constants/Config'

import history from 'customHistory'

/**
 * Create an Axios Client with defaults
 */


/**
 * Request Wrapper with default success/error actions
 */
let requestWithToken = function (options) {
    const onSuccess = function (response) {
        return response.data;
    }

    const onError = function (error) {
        console.error('Request Failed:', error.config);

        if (error.response) {
            // Request was made but server responded with something
            // other than 2xx
            console.error('Status:', error.response.status);
            // console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
            if(error.response.status === 403){
                localStorage.setItem('token','')
                history.push('/login')
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the 
            // browser and an instance of
            // http.ClientRequest in node.js
            console.log('Error Message:', error.request);
            
        } else {
            // Something else happened while setting up the request
            // triggered the error
            console.error('Error Message:', error.message);
        }

        return Promise.reject(error.response || error.message);
    }

    let client = axios.create({
        baseURL: Config.api_url,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    });

    return client(options)
        .then(onSuccess)
        .catch(onError);
}

export default requestWithToken;
