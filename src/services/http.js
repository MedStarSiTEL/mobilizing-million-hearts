import axios from "axios";
import log from "./log";

//Set this up on init if u want some actions done on 401/403 responses
let logoutCallback = null;
export const setLogoutCallback = i_logoutCallback => logoutCallback = i_logoutCallback;

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status <= 500;

  if (!expectedError) {
    if(error.code === "ERR_NETWORK"){ //Probably outside the network
      log.fatal("This app is available only inside the netwrok!");
      throw new Error("ERR_NETWORK");
    } else {
      log.error('Axios response error',error);
      throw new Error(error);
    }
  }
  //
  // TODO - NEED TO REVISIT THIS PLACE SOON FOR BETTER ERROR HANDLING 
  //
  if(error && error.response && error.response.status){//not authorized - login out
    console.error(error.response);
    // TODO SILENCED UNTIL I DECIDE WHAT TO DO HERE  || error.response.status === 500
    if(error.response.status === 401){
        logoutCallback && logoutCallback();
    }
    if(error.response.status === 403){
      window.alert("You have tried to access the Forbidden Forest!");
      window.history.back();
    }
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export function setAppApiRootUrl(app_url) {
  axios.defaults.baseURL = app_url;
  log.debug("APP api root url: ", axios.defaults.baseURL);
}

export function getApiRootUrl(){
  return axios.defaults.baseURL;
}

 const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
  setJwt
};

export default http;

/**
 * Wrapps a response from a TalisAPI call and check it is not an internal PHP error, which does not reflect as 500
 * @param {*} response 
 * @param {*} callback 
 */
export function fastApiWrapper(response,callback){
  log.debug("Response from FastAPI:",response);

  //TODO HEre u can add special status handlers (like 500, 404, 403 etc)
  if(!response.status || response.status>299 || response.status<200){
    console.error('fastApiWrapper error',response);
    throw new Error(response);    
  }

  return callback(response);
}

/**
 * Wraps an API call with all error handling functionality
 * 
 * @param {*} myPromise 
 * @param {*} successCallback 
 * @param {*} errorCallback 
 */
export function responsePromiseChainHandler(myPromise,successCallback,errorCallback,finallyCallback=null){
  if(finallyCallback){
    myPromise.then(response=>fastApiWrapper(response,successCallback)).catch(errorCallback).finally(finallyCallback);
  } else {
    myPromise.then(response=>fastApiWrapper(response,successCallback)).catch(errorCallback);
  }
}
