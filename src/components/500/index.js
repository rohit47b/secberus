import React from 'react';

const Error500 = () => (
  <div className="err-container text-center">
    <div className="err">
      <h1>500</h1>
      <h2>Sorry, server goes wrong</h2>
    </div>

    <div className="err-body">
      <a href="#/" className="btn btn-raised btn-lg btn-default">
        Go Back to Home Page
      </a>
    </div>
  </div>
);

const Page = () => (
  <div className="page-err">
    <div key="1">
      <Error500 />
    </div>
  </div>
);

export default Page;
