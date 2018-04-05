var ss        = SpreadsheetApp.getActiveSpreadsheet();
var SUPPLIERS = ss.getSheetByName("SUPPLIERS");
var CUSTOMERS = ss.getSheetByName("CUSTOMERS");
var LEADS     = ss.getSheetByName("LEADS");
var BIDS      = ss.getSheetByName("BIDS");
var OFFERS    = ss.getSheetByName("OFFERS");
var ORDERS    = ss.getSheetByName("ORDERS");
var DEFS      = ss.getSheetByName("Definitions");
 
var RULE1_CUSTOMERIDS    = SpreadsheetApp.newDataValidation().requireValueInRange(CUSTOMERS.getRange('A2:A1000')).build();
var RULE2_WEIGHTS        = SpreadsheetApp.newDataValidation().requireValueInRange(DEFS.getRange('A2:A10')).build();
var RULE3_RFQIDS         = SpreadsheetApp.newDataValidation().requireValueInRange(LEADS.getRange('A2:A')).build();
var RULE4_SUPPLIERIDS    = SpreadsheetApp.newDataValidation().requireValueInRange(SUPPLIERS.getRange('A2:A1000')).build();  
var RULE5_SHIPPINGMETHOD = SpreadsheetApp.newDataValidation().requireValueInRange(DEFS.getRange('B2:B10')).build();
var RULE6_BIDIDS         = SpreadsheetApp.newDataValidation().requireValueInRange(BIDS.getRange('A2:A')).build();
var RULE7_OFFERIDS       = SpreadsheetApp.newDataValidation().requireValueInRange(OFFERS.getRange('A2:A')).build();

function onOpen(){
  //validation on every sheet when ss is opened
  validationOnOpen(LEADS);
  validationOnOpen(BIDS);
  validationOnOpen(OFFERS);
  validationOnOpen(ORDERS);
 
  //setting initial formulas and values
  setOnOpen(LEADS);
  setOnOpen(BIDS);
  setOnOpen(OFFERS);
  setOnOpen(ORDERS);
}

function validationOnOpen(validateSheet){
  var validateSheetId = validateSheet.getSheetId();
  
  switch(validateSheetId){
    case(LEADS.getSheetId()):
      validateSheet.getRange('C2').setDataValidation(RULE1_CUSTOMERIDS);
      validateSheet.getRange('I2').setDataValidation(RULE2_WEIGHTS);
      break;
    case(BIDS.getSheetId()):
      validateSheet.getRange('B2').setDataValidation(RULE3_RFQIDS);
      validateSheet.getRange('D2').setDataValidation(RULE4_SUPPLIERIDS);
      validateSheet.getRange('L2').setDataValidation(RULE5_SHIPPINGMETHOD);
      break;
    case(OFFERS.getSheetId()):
      validateSheet.getRange('B2').setDataValidation(RULE6_BIDIDS);
      break;
    case(ORDERS.getSheetId()):
      validateSheet.getRange('B2').setDataValidation(RULE7_OFFERIDS);
  }
}

function setOnOpen(sheet){
  var sheetId = sheet.getSheetId();

  switch(sheetId){
    case(LEADS.getSheetId()):
      setId(sheet,'A2','RFQ');
      setVlookup(sheet,'D2',"C2:C","CUSTOMERS!A2:D1000",3);
      break;
    case(BIDS.getSheetId()):
      setId(sheet,'A2','BD');
      setVlookup(sheet,'E2',"D2:D","SUPPLIERS!A2:D1000",3);
      setVlookup(sheet,'F2',"B2:B","LEADS!A2:I",5);
      setVlookup(sheet,'G2',"B2:B","LEADS!A2:I",6);
      setVlookup(sheet,'H2',"B2:B","LEADS!A2:I",7);
      setVlookup(sheet,'I2',"B2:B","LEADS!A2:I",8);
      setVlookup(sheet,'J2',"B2:B","LEADS!A2:I",9);
      break;
    case(OFFERS.getSheetId()):
      setId(sheet,'A2','OI');
      setVlookup(sheet,'C2',"B2:B","BIDS!A2:B",2);
      setVlookup(sheet,'D2',"C2:C","LEADS!A2:N",3);
      setVlookup(sheet,'E2',"C2:C","LEADS!A2:N",4);
      setVlookup(sheet,'F2',"B2:B","BIDS!A2:O",4);
      setVlookup(sheet,'G2',"B2:B","BIDS!A2:O",5);
      setVlookup(sheet,'H2',"B2:B","BIDS!A2:O",7);
      setVlookup(sheet,'I2',"B2:B","BIDS!A2:O",8);
      setVlookup(sheet,'J2',"B2:B","BIDS!A2:O",9);
      setVlookup(sheet,'K2',"B2:B","BIDS!A2:O",10);
      break;
    case(ORDERS.getSheetId()):
      setId(sheet,'A2','OR');
      setVlookup(sheet,'C2',"B2:B","OFFERS!A2:P",2);
      setVlookup(sheet,'F2',"B2:B","OFFERS!A2:P",4);
      setVlookup(sheet,'G2',"B2:B","OFFERS!A2:P",5);
      setVlookup(sheet,'H2',"B2:B","OFFERS!A2:P",6);
      setVlookup(sheet,'I2',"B2:B","OFFERS!A2:P",7);
      setVlookup(sheet,'J2',"B2:B","OFFERS!A2:P",8);
      setVlookup(sheet,'K2',"B2:B","OFFERS!A2:P",9);
      setVlookup(sheet,'L2',"B2:B","OFFERS!A2:P",10);
      setVlookup(sheet,'M2',"B2:B","OFFERS!A2:P",11);
      setVlookup(sheet,'N2',"C2:C","BIDS!A2:O",11);
      setVlookup(sheet,'O2',"B2:B","OFFERS!A2:P",13);
      setVlookup(sheet,'P2',"B2:B","OFFERS!A2:P",14);
      setVlookup(sheet,'Q2',"C2:C","BIDS!A2:O",13);
      setExtCost(sheet,'U2',"L:L2","N:N2");
      setExtCost(sheet,'V2',"L:L2","O:O2");
      setGP(sheet,'W2',"U2:U","V2:V");
      break;
  }
}

// set RFQ1000 and BD1000
function setId(sheet,cellRange,idName){
  var cell = sheet.getRange(cellRange);
  var ID_START_VALUE = 1000;
  if(cell.isBlank()){
    cell.setValue(idName+ID_START_VALUE);
  }
}

// set vlookup array formula in relevant cells
function setVlookup(sheet,cellRange,searchKey,range,index){
  var cell = sheet.getRange(cellRange);
  if(cell.isBlank()){
    var vlookup = "=ARRAYFORMULA(IFERROR(VLOOKUP(" + searchKey + "," + range + "," + index + ",FALSE),\"\"))";
    cell.setFormula(vlookup);
  }
}

function setExtCost(sheet,cellRange,qty,cost){
  var cell = sheet.getRange(cellRange);
  if(cell.isBlank()){
    var prod = qty + "*" + cost;
    var extCost = "=ARRAYFORMULA(IF(" + prod + "=0,\"\"," + prod + "))";
    cell.setFormula(extCost);
  }
}

function setGP(sheet,cellRange,cell1,cell2){
  var cell = sheet.getRange(cellRange);
  if(cell.isBlank()){
    var diff = cell2 + "-" + cell1;
    var gp = "=ARRAYFORMULA(IF(" + diff + "=0,\"\"," + diff + "))";
    cell.setFormula(gp);
  }
}

function onEdit(){
  Validation(LEADS,DEFS,"A2:A10",9);           // Weight
  Validation(LEADS,CUSTOMERS,"A2:A1000",3);    // Customer ID
  IncrementID(LEADS,1,3);                      // Increment RFQ#
  
  Validation(BIDS,SUPPLIERS,"A2:A1000",4);     // Supplier ID
  Validation(BIDS,LEADS,"A2:A",2);             // RFQ ID
  Validation(BIDS,DEFS,"B2:B10",12);           // Shipping Method
  IncrementID(BIDS,1,2);                       // Increment BD#

  Validation(OFFERS,BIDS,"A2:A",2);            // BID ID
  IncrementID(OFFERS,1,2);                     // Increment OFFER#
  
  Validation(ORDERS,OFFERS,"A2:A",2);          // OFFER ID
  IncrementID(ORDERS,1,2);                     // Increment ORDER#
}

// Add a folder to Google Drive - new LEAD
function addLEADFolder(){
  
}

// Add a validation one below the edited cell
function Validation(dstSheet,srcSheet,srcRange,editColumn){
  var EDIT_COL = editColumn;
  
  var activeCell = dstSheet.getActiveCell();
  var activeRow = activeCell.getRow();
  var activeCol = activeCell.getColumn();
  var range = srcSheet.getRange(srcRange);
  
  if(activeCol == EDIT_COL){
    var rule = SpreadsheetApp.newDataValidation().requireValueInRange(range).build();
    var validationCell = dstSheet.getRange(activeRow+1,activeCol);
    validationCell.setDataValidation(rule);
  }
}

// increment IDs (RFQs and BDs)
function IncrementID(sheet,incColumn,editColumn){
  var EDIT_COL = editColumn;
  var ID_COL = incColumn;
  
  var activeCell = sheet.getActiveCell();
  var activeRow = activeCell.getRow();
  var activeCol = activeCell.getColumn();
  if(activeCol == EDIT_COL && activeRow != 2){
    var lastVal = sheet.getRange(activeRow-1,ID_COL).getValue();
    var id = lastVal.slice(0,-4);
    var ID_NUM = Number(lastVal.slice(-4))+1;
    sheet.getRange(activeRow,ID_COL).setValue(id + ID_NUM);
  }
}
