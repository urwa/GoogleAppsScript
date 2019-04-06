function doPost(e) {  
  return handleResponse(e);
}

function handleResponse(e) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Form Responses");
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1;
    var row = []; 
    for (i in headers) {
      if (headers[i] == "timestamp"){
        row.push(new Date());
      } else if(headers[i] == "files"){
          var url = saveFile(e);
          row.push(url);
     } else {
             row.push(e.parameter[headers[i]]);
        }
    }
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    
    return ContentService
    .createTextOutput(JSON.stringify({"result":"success", "row": nextRow, "data": row}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}


function saveFile(e) {
  
  var data = Utilities.base64Decode(e.parameters.data);
  var blob = Utilities.newBlob(data, e.parameters.mimetype, e.parameters.filename);
  
  var DOCS_FOLDER_ID = 'YOUR_DOCS_FOLDER_ID';
  var docsFolder = DriveApp.getFolderById(DOCS_FOLDER_ID);
  var docsFiles = docsFolder.createFile(blob);
  var url = docsFiles.getId();
                           
  return url;
}
