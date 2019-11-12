/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-01 11:34:33 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-26 13:09:34
 */

import React from 'react'

import Grid from '@material-ui/core/Grid'

const LoginBackground = (props) => {
    return (
        <Grid item md={9} className="sb-loging-bg pd0">
            <div className="top-inside-divider"></div>
	        <svg width="100%" height="100%">      
	          <image xlinkHref="/assets/images/secberus-logo.png" height="30%" width="30%" x="35%" y="35%"/>
			</svg>
            <div className="bottom-inside-divider"></div>
        </Grid>
    )
}
export default LoginBackground;