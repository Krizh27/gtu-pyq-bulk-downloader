# Request Flow

This document traces the exact path data takes from the moment a user clicks "Get Paper Links" to the moment the UI updates.

### 1. Form Interception (`frontend/app.js`)
When the user clicks submit, the native HTML form tries to reload the page. Our JavaScript intercepts this:
```javascript
document.getElementById("pyqForm").addEventListener("submit", handleFormSubmit);
e.preventDefault(); // Stops page reload
```

### 2. Data Gathering & Validation (`frontend/app.js`)
The JS manually queries the DOM for values:
```javascript
const subjectCode = document.getElementById("subjectCode").value.trim();
const startYear = parseInt(document.getElementById("startYear").value);
```
It performs simple validation (e.g., `startYear > endYear`).

### 3. HTTP Request (`frontend/app.js`)
The browser sends an asynchronous HTTP POST request to the backend:
```javascript
const response = await fetch("/api/pyq/check", { ... });
```

### 4. Express Routing (`backend/src/app.js` & `routes/pyq/index.js`)
The Node.js server receives the request. The `express.json()` middleware parses the raw HTTP text into a JavaScript object (`req.body`). 

### 5. Backend Validation (`backend/src/routes/pyq/index.js`)
The route runs a simple, native JS validation function `validateBody(req.body)`. If it fails, it returns a `400 Bad Request`.

### 6. Logic Engine (`backend/src/routes/pyq/index.js`)
If valid, the backend computes all mathematical permutations of the subject code across the requested years:
```javascript
const urls = generateUrls(subjectCode, course, startYear, endYear, sessions);
res.json({ availableUrls: urls });
```

### 7. UI Re-render (`frontend/app.js`)
The frontend awaits the JSON response, maps the raw URLs into objects with a `pending` status, and calls `renderPapersList()` to inject them into the DOM.
