function doGet(e) {
    if (e.parameter.toThanks) {
      return HtmlService.createHtmlOutputFromFile('thanks')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }  else {
        return HtmlService.createTemplateFromFile("form").evaluate()
                 .setTitle('CIH FORM')
                 .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      }
  
}

function confirmCode(code) { 
  
  var SERVICE_SID = PropertiesService.getUserProperties().getProperty('SERVICE_SID');
  var phoneNo = PropertiesService.getUserProperties().getProperty('phoneNo');
    
  var check = verifyApiCall("check", SERVICE_SID, phoneNo, code);
  check = JSON.parse(check); Logger.log(check);
  
  var status = check.status; Logger.log(status);
  
  return status;
}

function sendCode(phoneNo) {

  var service = verifyApiCall("service");
  service = JSON.parse(service); Logger.log(service);
  
  var SERVICE_SID = service.sid; Logger.log(SERVICE_SID);
  
  PropertiesService.getUserProperties().setProperty('SERVICE_SID', SERVICE_SID);
  PropertiesService.getUserProperties().setProperty('phoneNo', phoneNo);
  
  var verification = verifyApiCall("verification", SERVICE_SID, phoneNo);
  verification = JSON.parse(verification); Logger.log(verification);
  
}

function verifyApiCall(requestType, serviceSid, phoneNo, code) {
  
  var ACCOUNT_SID = 'YOUR_ACCOUNT_SID';
  var ACCOUNT_TOKEN = 'YOUR_ACCOUNT_TOKEN';

  var base_url = "https://verify.twilio.com/v2/Services";
  
  var url_service = base_url;
  var url_verification = base_url + '/' + serviceSid + '/Verifications';
  var url_check = base_url + '/' + serviceSid + '/VerificationCheck';
 
  // Create Verification Service
  var payload_service = {
    "FriendlyName":"DIH"
  };
  
  // Start New Verification
  var payload_verification = {
    "To": phoneNo,
    "Channel": "sms"
  }
  
  // Verification Check
  var payload_check = {
    "To": phoneNo,
    "Code": code
  }
  
  var url;
  var payload;
  
  switch(requestType) {
      
    case ("service"):
      url = url_service;
      payload = payload_service;
      break;
      
    case ("verification"):
      url = url_verification;
      payload = payload_verification;
      break;
      
    case ("check"):
      url = url_check;
      payload = payload_check;
      break;
  }
  
  var options = {
    "method" : "post",
    "payload" : payload,
    "muteHttpExceptions" : true
  };
 
  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode(ACCOUNT_SID + ':' + ACCOUNT_TOKEN)
  };
  
  return UrlFetchApp.fetch(url, options);
  
}
