function makePhoneCall() {

  var message = 'YOUR_PERSONAL_CALL_MESSAGE';
  
  var ACCOUNT_SID = 'YOUR_ACCOUNT_SID';
  var ACCOUNT_TOKEN = 'YOUR_ACCOUNT_TOKEN';
  
  var TWILIO_NUMBER = 'YOUR_TWILIO_NUMBER';
  
  var PHONE_NUMBER = 'YOUR_PHONE_NUMBER';

  var urlGet = ScriptApp.getService().getUrl();
  
  var payload = {
    "From" : TWILIO_NUMBER
    ,"To" : PHONE_NUMBER
    ,"Url": urlGet
    ,"Method" : "GET"
  };
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(ACCOUNT_SID + ':' + ACCOUNT_TOKEN)
  };
  
  var options =
      {
        "method" : "post",
        "payload" : payload,
        "headers" : headers,
        "muteHttpExceptions": true
      };

  var url = 'https://api.twilio.com/2010-04-01/Accounts/'+ACCOUNT_SID+'/Calls.json';
  var response = UrlFetchApp.fetch(url, options);
}

function doGet() {
  var content = HtmlService.createHtmlOutputFromFile("twiml.html").getContent();
  var output = ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.XML);
  return output;
}
