# Google Apps Script Setup Guide

## Step 1: Open Apps Script Editor

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/14NkOAwIaYMLTTBpABHHUPoNUNNJdP4gta2HJFVCBmeM
2. Click **Extensions** > **Apps Script**
3. Delete any existing code

## Step 2: Paste the Code

1. Copy all code from `backend/Code.gs`
2. Paste into the Apps Script editor
3. Save (Ctrl+S or Cmd+S)
4. Name it "CRM Backend"

## Step 3: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in:
   - **Description**: "CRM API v1"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize** the script (click "Authorize access")
7. Choose your Google account
8. Click "Advanced" > "Go to CRM Backend (unsafe)"
9. Click "Allow"

## Step 4: Copy Deployment URL

1. After deployment, you'll see a **Web app URL**
2. It looks like: `https://script.google.com/macros/s/AKfycby.../exec`
3. **Copy this URL** - you'll need it for the frontend

## Step 5: Update Frontend Configuration

1. Open `src/services/googleSheets.js`
2. Find the line: `const APPS_SCRIPT_URL = 'YOUR_DEPLOYMENT_URL_HERE';`
3. Replace with your copied URL
4. Save the file

## Step 6: Test the Connection

1. Run your CRM app: `npm run dev`
2. Login with admin/1234
3. Go to Clients page
4. Try adding a new client
5. Check your Google Sheet - the new client should appear!

## Troubleshooting

### Error: "Script function not found"
- Make sure you deployed as **Web app**, not API executable

### Error: "Authorization required"
- Re-deploy and authorize again
- Make sure "Execute as" is set to "Me"

### Error: "CORS policy"
- This shouldn't happen with Apps Script
- If it does, check the deployment URL is correct

### Changes not appearing in sheet
- Check the sheet name in Code.gs matches your actual sheet
- Verify the deployment URL in frontend is correct
- Check browser console for errors

## Security Note

The deployment is set to "Anyone" access because:
- Your CRM needs to access it from any domain
- The sheet ID acts as authentication
- You can add additional security in the script if needed

## Next Steps

Once deployed and tested:
1. All client CRUD operations will sync to Google Sheets
2. Credential changes will save to the Keys sheet
3. User management will work with the Users sheet

Enjoy your fully integrated CRM! 🎉
