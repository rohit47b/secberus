import requestWithToken from './requestWithToken'

function logout() {
    return requestWithToken({
      url: '/api/1.0/auth/logout',
      method: 'POST',
    });
  }


  const LogoutService = {
    logout
  }

  export default LogoutService;

