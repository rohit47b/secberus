import React from 'react';
import { Button} from '@material-ui/core'

import history from 'customHistory'

const Error404 = () => (
  <div className="err-container text-center">
    <div className="err">
        <img src="/assets/images/404.png" alt="404" />
    </div>
    <div className="err-body">
    <h1>Page Not Found !</h1>
    <p>The page you are looking for was moved, removed, renamed or might never existed.</p>
    <Button  onClick={() => history.push('/login')} type="button" variant="contained" className="btn btn-success">Go Home</Button>
    </div>
    <div className="err-footer">
        <span>For more information</span> <a href="javascript:void(0)">Contact Us</a>
    </div>
  </div>
);

const Page = () => (
  <div className="page-err">
      <Error404 />
  </div>
);

export default Page;
