/*
 * @Author: Virendra Patidar 
 * @Date: 2018-10-10 14:39:44 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-04-03 16:04:26
 */
import React from 'react'
import { Route, Switch, Redirect } from 'react-router'

import Login from 'components/login'
import { SignupRoute } from 'components/signUp/SignupRoutes'
import { DashboardRoute } from 'components/app/components/dashboard/DashboardRoute'
import { MultiTenancyDashboardRoute } from 'components/app/components/multiTenancyDashboard/MultiTenancyDashboardRoute'

import { onboardRoutes } from 'components/app/components/onBoard/onboardRoutes'

import { SettingRoutes } from 'components/app/components/setting/SettingRoutes'
import { CompanyRoutes } from 'components/app/components/company/CompanyRoutes'
import { SecurityRuleRoutes } from 'components/app/components/securityRule/SecurityRuleRoutes'
import { ReportRoutes } from 'components/app/components/reports/ReportRoutes'
import { NotificationSettingRoutes } from 'components/app/components/notification/NotificationSettingRoutes'
import { IntegrationRoutes } from 'components/app/components/integrations/IntegrationRoutes'
import { InvestigationAlertRoutes } from 'components/app/components/investigateAlert/InvestigationAlertRoutes'

import { RemediationRoutes } from 'components/app/components/remediation/RemediationRoutes'
import { AssetsRoutes } from 'components/app/components/assets/AssetsRoutes'
import { AssetsComputeRoutes } from 'components/app/components/assets/compute/AssetsComputeRoutes'
import { AssetsStorageRoutes } from 'components/app/components/assets/storage/AssetsStorageRoutes'
import { AssetsLoggingMonitoringRoutes } from 'components/app/components/assets/loggingMonitoring/AssetsLoggingMonitoringRoutes'
import { AssetsTransitRoutes } from 'components/app/components/assets/transit/AssetsTransitRoutes'
import { PoliciesRoutes } from 'components/app/components/policies/PoliciesRoutes'
import { AssetsIdentityManagementRoutes } from 'components/app/components/assets/identityManagement/AssetsIdentityManagementRoutes'
import { RulesRoutes } from 'components/app/components/rules/RulesRoutes'


import UserMgmt from 'components/app/components/usersMgmt'
import OrganizationMgmt from 'components/app/components/organizationMgmt'
import Comunication from 'components/app/components/comunication'
import Subscribe from 'components/app/components/subscribe'
import Billing from 'components/app/components/billing'
import AdminUser from 'components/app/components/adminUser'
import BillingAnalysis from 'components/app/components/billingAnalysis'
import Reports from 'components/app/components/reports'


import ForgotPassword from 'components/forgotPassword'
import ForgotPasswordEmail from 'components/forgotPasswordEmail'
import ResetPassword from 'components/resetPassword'
import Invite from 'components/invite'
import Welcome from 'components/welcome'
import NotFound from 'components/404'
import InternalServerError from 'components/500'

import MainRoute from 'components/app/MainRoute'
import history from 'customHistory'

import { store } from 'client'

import { isAlreadyLogin, requireAuth, checkTrailRemainingDays, checkIsAdmin, checkIsUser } from './client'

import 'style/app.scss';
import 'style/datatable.scss';
import "react-datepicker/dist/react-datepicker.css";

const Main = ({ }) => {
    if (localStorage.getItem('profile') !== undefined && localStorage.getItem('profile') !== null && localStorage.getItem('profile') !== {}) {
        let currentUser = JSON.parse(localStorage.getItem('profile'));
        mixpanel.identify(String(currentUser.id));
        mixpanel.people.set({
            "$Email Address": currentUser.email,
            "$first_name": currentUser.first_name,
            "$last_name": currentUser.last_name,
            "$Name": currentUser.first_name + ' ' + currentUser.last_name,
            "$Company": localStorage.getItem('company')
        });
    } else {
        mixpanel.identify('anonymous');
    }

    return <Switch>
        <Redirect from="/" exact to="/login" />
        <Route path='/login'
            render={() => (
                !isAlreadyLogin() ? (<Login />) : (<Login />)
            )}
        />

        <Route
            path="/sign-up/"
            render={({ match: { url } }) => (
                SignupRoute(url)
            )}
        />
        <Route
            path="/app/onboard/"
            render={({ match: { url } }) => (
                (requireAuth() && checkIsUser()) ? onboardRoutes(url) : ''
            )}
        />
        <Route path='/forgot-password' component={ForgotPassword} />
        <Route path='/forgot-password-email' component={ForgotPasswordEmail} />
        <Route path='/reset-password' component={ResetPassword} />
        <Route path='/invite' component={Invite} />
        <Route path='/welcome' exact component={Welcome} />
        <Redirect from="/app/dashboard/" exact to="/app/dashboard/home" />
        <Route
            path="/app/dashboard/"
            render={({ match: { url } }) => (
                (requireAuth() && checkTrailRemainingDays() && checkIsUser()) ? DashboardRoute(url) : ''
            )}
        />
        <Route
            path="/app/multi-tenancy-dashboard/"
            render={({ match: { url } }) => (
                (requireAuth() && checkTrailRemainingDays() && checkIsUser()) ? MultiTenancyDashboardRoute(url) : ''
            )}
        />

        <Route
            path="/app/assets/"
            render={({ match: { url } }) => (
                requireAuth() ? AssetsRoutes(url) : ''
            )}
        />

        <Route
            path="/app/assets-compute"
            render={({ match: { url } }) => (
                requireAuth() ? AssetsComputeRoutes(url) : ''
            )}
        />

        <Route
            path="/app/assets-storage"
            render={({ match: { url } }) => (
                requireAuth() ? AssetsStorageRoutes(url) : ''
            )}
        />

        <Route
            path="/app/assets-transit"
            render={({ match: { url } }) => (
                requireAuth() ? AssetsTransitRoutes(url) : ''
            )}
        />

        <Route
            path="/app/assets-identity-management"
            render={({ match: { url } }) => (
                requireAuth() ? AssetsIdentityManagementRoutes(url) : ''
            )}
        />

        <Route
            path="/app/assets-logging-monitoring"
            render={({ match: { url } }) => (
                requireAuth() ? AssetsLoggingMonitoringRoutes(url) : ''
            )}
        />

        <Route
            path="/app/policies/"
            render={({ match: { url } }) => (
                requireAuth() ? PoliciesRoutes(url) : ''
            )}
        />

        <Route
            path="/app/rules/"
            render={({ match: { url } }) => (
                requireAuth() ? RulesRoutes(url) : ''
            )}
        />


        <MainRoute exact path='/app/billing-analysis' component={BillingAnalysis} />

        <Route
            path="/app/alerts/"
            render={({ match: { url } }) => (
                requireAuth() ? InvestigationAlertRoutes(url) : ''
            )}
        />
        <MainRoute exact path='/app/reports' component={Reports} />


        <Route
            path="/app/security-rule/"
            render={({ match: { url } }) => (
                (requireAuth() && checkTrailRemainingDays() && checkIsUser()) ? SecurityRuleRoutes(url) : ''
            )}
        />

        <Route
            path="/app/reports/"
            render={({ match: { url } }) => (
                (requireAuth() && checkTrailRemainingDays() && checkIsUser()) ? ReportRoutes(url) : ''
            )}
        />

        <MainRoute exact path='/app/user-management' component={UserMgmt} />

        <MainRoute exact path='/app/organization-management' component={OrganizationMgmt} />

        <MainRoute exact path='/app/comunication' component={(props) => (
            checkIsUser()
                ? <Comunication {...props} />
                : ''
        )} />

        <Route
            path="/app/setting/"
            render={({ match: { url } }) => (
                requireAuth() ? SettingRoutes(url) : ''
            )}
        />
        <Route
            path="/app/integrations/"
            render={({ match: { url } }) => (
                requireAuth() ? IntegrationRoutes(url) : ''
            )}
        />

        <Route
            path="/app/notifications/"
            render={({ match: { url } }) => (
                requireAuth() ? NotificationSettingRoutes(url) : ''
            )}
        />

        <Route
            path="/app/remediation/"
            render={({ match: { url } }) => (
                requireAuth() ? RemediationRoutes(url) : ''
            )}
        />

        <MainRoute exact path='/app/subscribe' component={(props) => (
            checkIsUser()
                ? <Subscribe {...props} />
                : ''
        )} />

        <MainRoute exact path='/app/billing' component={(props) => (
            checkIsUser()
                ? <Billing {...props} />
                : ''
        )} />

        <MainRoute exact path='/app/admin-user' component={(props) => (

            checkIsAdmin()
                ? <AdminUser {...props} />
                : ''
        )} />

        <Route
            path="/app/companies/"
            render={({ match: { url } }) => (
                (requireAuth() && checkIsAdmin()) ? CompanyRoutes(url) : ''
            )}
        />

        <Route component={NotFound} />
        <Route component={InternalServerError} />

    </Switch>

}
export default Main;