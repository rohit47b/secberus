import React, { PureComponent } from 'react';

class LoginSignUpHeader extends PureComponent {

  render() { 
    return (
      <div>
        <div className="bx-header">
          <nav className="navbar navbar-expand-md navbar-light fixed-top bg-light">
            <div className="container">
              <div className="row" style={{ width: "100%" }}>
                <div className="col-md-6">
                  <span className="navbar-brand" href="index.html"><img src="/assets/images/bixex.png" alt="" /></span>
                </div>
                <div className="col-md-6 collapse navbar-collapse pull-right" id="navbarsExampleDefault">
                  <ul className="navbar-nav mr-auto bx-top-nav-before-login">
                    <li className="nav-item">
                      Lading Page Header
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default LoginSignUpHeader;
