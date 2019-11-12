/*
 * @Author: Virendra Patidar 
 * @Date: 2018-08-09 10:23:00 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2018-11-20 12:21:04
 */

import React from 'react'
import Config from 'constants/Config'

const Accounts = (props) => {
    const { selectAccount } = props
    let customClass = 'active'
    if (selectAccount.id !== 'all') {
        customClass = 'disabled'
    }
    const account = { id: 'all', name: 'All Accounts', cloud: 'all' }
    return (<span>
        <span className="services">
            <a key={0} className={customClass} href="javascript:void(0)" onClick={() => props.setSelectAccount(account)}>
                <img alt="Cloud" src={Config.cloudStaticData['all'].cloudIconPath} />
                <span>{account.name}</span>
            </a>
            {renderAccounts(props)}
        </span>
    </span>);
}

const renderAccounts = (props) => {
    const { selectAccount } = props
    return (props.accounts.map((account, index) => {
        if (selectAccount.cloud === 'all' || selectAccount.cloud === account.cloud){
            let customClass = ''
            if(account.id !== selectAccount.id || !account.enabled){
                customClass='disabled'
            } else if(account.id === selectAccount.id){
                customClass='active'
            }
            return <a key={index+1} className={customClass} href="javascript:void(0)" onClick={() => props.setSelectAccount(account)}>
                <img alt="Cloud" src={Config.cloudStaticData[account.cloud].cloudIconPath} />
                <span>{account.name}</span>
            </a>
        }
    }));
}

export default Accounts;