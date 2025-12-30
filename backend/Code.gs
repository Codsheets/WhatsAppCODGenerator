/**
 * WhatsApp CRM - Google Apps Script Backend
 * 
 * This script handles all CRUD operations for the CRM
 * Deploy as Web App with "Anyone" access
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Extensions > Apps Script
 * 3. Paste this code
 * 4. Deploy > New deployment
 * 5. Type: Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Copy the deployment URL
 * 9. Paste URL in your CRM frontend config
 */

// Configuration - Update with your sheet name
const SHEET_NAME = 'YOUR_SHEET_NAME_HERE'; // e.g., "WhatsApp CRM Template"

// Sheet names
const SHEETS = {
  CLIENTS: 'Clients',
  USERS: 'Users',
  KEYS: 'Keys'
};

/**
 * Handle GET requests - Fetch data
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const sheet = e.parameter.sheet;
    
    if (!action || !sheet) {
      return createResponse({ error: 'Missing action or sheet parameter' }, 400);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetObj = ss.getSheetByName(sheet);
    
    if (!sheetObj) {
      return createResponse({ error: `Sheet "${sheet}" not found` }, 404);
    }
    
    if (action === 'fetch') {
      const data = fetchSheetData(sheetObj);
      return createResponse({ success: true, data: data });
    }
    
    return createResponse({ error: 'Invalid action' }, 400);
    
  } catch (error) {
    return createResponse({ error: error.toString() }, 500);
  }
}

/**
 * Handle POST requests - Create, Update, Delete
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const sheet = params.sheet;
    
    if (!action || !sheet) {
      return createResponse({ error: 'Missing action or sheet parameter' }, 400);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetObj = ss.getSheetByName(sheet);
    
    if (!sheetObj) {
      return createResponse({ error: `Sheet "${sheet}" not found` }, 404);
    }
    
    let result;
    
    switch (action) {
      case 'create':
        result = createRow(sheetObj, params.data);
        break;
        
      case 'update':
        result = updateRow(sheetObj, params.index, params.data);
        break;
        
      case 'delete':
        result = deleteRow(sheetObj, params.index);
        break;
        
      case 'updateKey':
        result = updateKey(sheetObj, params.key, params.value);
        break;
        
      default:
        return createResponse({ error: 'Invalid action' }, 400);
    }
    
    return createResponse({ success: true, result: result });
    
  } catch (error) {
    return createResponse({ error: error.toString() }, 500);
  }
}

/**
 * Fetch all data from a sheet
 */
function fetchSheetData(sheet) {
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length === 0) {
    return [];
  }
  
  const headers = values[0];
  const data = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i][j];
    }
    data.push(row);
  }
  
  return data;
}

/**
 * Create a new row
 */
function createRow(sheet, data) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = [];
  
  headers.forEach(header => {
    newRow.push(data[header] || '');
  });
  
  sheet.appendRow(newRow);
  return { rowIndex: sheet.getLastRow() - 1 };
}

/**
 * Update an existing row
 */
function updateRow(sheet, index, data) {
  const rowNumber = parseInt(index) + 2; // +2 because: 1-indexed + header row
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  headers.forEach((header, colIndex) => {
    if (data.hasOwnProperty(header)) {
      sheet.getRange(rowNumber, colIndex + 1).setValue(data[header]);
    }
  });
  
  return { updated: true };
}

/**
 * Delete a row
 */
function deleteRow(sheet, index) {
  const rowNumber = parseInt(index) + 2; // +2 because: 1-indexed + header row
  sheet.deleteRow(rowNumber);
  return { deleted: true };
}

/**
 * Update a key-value pair in Keys sheet
 */
function updateKey(sheet, key, value) {
  const data = fetchSheetData(sheet);
  const rowIndex = data.findIndex(row => row.Key === key);
  
  if (rowIndex >= 0) {
    // Update existing key
    const rowNumber = rowIndex + 2;
    sheet.getRange(rowNumber, 2).setValue(value);
  } else {
    // Create new key
    sheet.appendRow([key, value]);
  }
  
  return { updated: true };
}

/**
 * Create JSON response with CORS headers
 */
function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  return output;
}

/**
 * Test function - run this to verify setup
 */
function testSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Spreadsheet name: ' + ss.getName());
  
  const clientsSheet = ss.getSheetByName(SHEETS.CLIENTS);
  if (clientsSheet) {
    Logger.log('Clients sheet found');
    const data = fetchSheetData(clientsSheet);
    Logger.log('Clients count: ' + data.length);
  } else {
    Logger.log('ERROR: Clients sheet not found');
  }
}
