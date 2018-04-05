//MODULE 1
function RaidLogTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("RAID LOG"));
}

function RiskRegisterTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("Risk Register"));
}

function AssumptionsTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("Assumptions"));
}

function IssuesLogTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("Issues Log"));
}

function DependenciesTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("Dependencies"));
}

function LessonsLearntLogTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("Lessons Learnt Log"));
}

function ActionLogTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("ActionLog"));
}

function HundredDayPlanTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("100 Day Plan"));
}

function DashboardTab(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.setActiveSheet(ss.getSheetByName("Dashboard"));
}


function Refresh() {
  SpreadsheetApp.flush();
}
