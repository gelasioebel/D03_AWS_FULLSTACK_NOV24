import { useLocation } from "react-router";

import './style.css'

export function NoMatch() {
  const location = useLocation();
  
  return (
    <div className="no-match-container">
      <h1 className="no-match-title eb-garamond">404</h1>
      <h3 className="no-match-message lato">
        No match for <code className="no-match-code">{location.pathname}</code>
      </h3>
      <a href="/" className="no-match-home-link lato">Go back to Home</a>
    </div>
  );
}
