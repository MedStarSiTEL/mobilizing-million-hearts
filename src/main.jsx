import ReactDOM from 'react-dom/client';
import log from "./services/log";
//import authCentral from "./services/authCentral";
import { environ } from './utilities/config.js';
import App from './App.jsx'
import "./furia.css";

//INIT THE APP can be from env or hard coded
log.init.setLogHandler(environ.logHandler);
log.init.setLogLevel(environ.logLevel);
//authCentral.setTokenKeyName(environ.authTokenKeyName);

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
