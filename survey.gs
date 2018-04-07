/**
 * Performs entity sentiment analysis on english text data in a sheet using Cloud Natural Language (cloud.google.com/natural-language/).
 */

var COLUMN_NAME = {
  COMMENTS: 'comments',
  ENTITY: 'entity_sentiment',
  ID: 'id'
};

/**
 * Creates a ML Tools menu in Google Spreadsheets.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ML Tools CHECK')
    .addItem('Mark Entities and Sentiment CHECK', 'markEntitySentimentCHECK')
    .addToUi();
};
  

/**
* For each row in the reviewData sheet with a value in "comments" field, 
* will run the retrieveEntitySentiment function
* and copy results into the entitySentiment sheet.
*/

function markEntitySentimentCHECK() {
  // set variables for reviewData sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getActiveSheet();
  var rows = dataSheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var headerRow = values[0];
  
  // checks to see if entitySentiment sheet is present; if not, creates new sheet and sets header row
  var entitySheet = ss.getSheetByName('entitySentiment');
  if (entitySheet == null) {
   ss.insertSheet('entitySentiment');
   var entitySheet = ss.getSheetByName('entitySentiment');
   var esHeaderRange = entitySheet.getRange(1,1,1,6);
   var esHeader = [['Review ID','Entity','Salience','Sentiment Score','Sentiment Magnitude','Number of mentions']];
   esHeaderRange.setValues(esHeader);
  };
  
  // find the column index for comments, language_detected, comments_english
  var commentsColumnIdx = headerRow.indexOf(COLUMN_NAME.COMMENTS);
  var entityColumnIdx = headerRow.indexOf(COLUMN_NAME.ENTITY);
  var idColumnIdx = headerRow.indexOf(COLUMN_NAME.ID);
  if (entityColumnIdx == -1) {
    Browser.msgBox("Error: Could not find the column named " + COLUMN_NAME.ENTITY + ". Please create an empty column with header \"entity_sentiment\" on the reviewData tab.");
    return; // bail
  };
  
  
  ss.toast("Analyzing entities and sentiment...");
  // Process each row 
  for (var i = 0; i < numRows; ++i) {
    var value = values[i];
    var commentEnCellVal = value[commentsColumnIdx];
    var entityCellVal = value[entityColumnIdx];
    var reviewId = value[idColumnIdx];
    
    // Call retrieveEntitySentiment function for each row that has comments and also an empty entity_sentiment cell
    if(commentEnCellVal && !entityCellVal) {
        var nlData = retrieveEntitySentiment(commentEnCellVal);
        // Paste each entity and sentiment score into entitySentiment sheet
        for (var j = 0; j < nlData.entities.length; ++j) {  
          var entityInResponse = nlData.entities[j];
          var lastRowIdx = entitySheet.getLastRow() + 1;
          var newValues = [[reviewId, entityInResponse.name, entityInResponse.salience, entityInResponse.sentiment.score, entityInResponse.sentiment.magnitude, entityInResponse.mentions.length]];
          var pastingRange = entitySheet.getRange(lastRowIdx,1,1,6);
          pastingRange.setValues(newValues);
        }
        // Paste "complete" into entity_sentiment column to denote completion of NL API call
        dataSheet.getRange(i+1, entityColumnIdx+1).setValue("complete");
     }
   }
};

/**
 * Calls the NL API with a string
 * @param {String} line The line of string
 * @return {Object} the entities and related sentiment present in the string.
 */

function retrieveEntitySentiment (line) {
  var apiKey = "AIzaSyCvvbeGPLaCP9TtIWp05iuW8vhXioEGgRo";
  var apiEndpoint = 'https://language.googleapis.com/v1/documents:analyzeEntitySentiment?key=' + apiKey;
  // Create our json request, w/ text, language, type & encoding
  var nlData = {
    document: {
      language: 'en-us',
      type: 'PLAIN_TEXT',
      content: line
    },
    encodingType: 'UTF8'
  };
  //  Package all of the options and the data together for the call
  var nlOptions = {
    method : 'post',
    contentType: 'application/json',  
    payload : JSON.stringify(nlData)
  };
  //  And make the call
  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);
  return JSON.parse(response);
};
