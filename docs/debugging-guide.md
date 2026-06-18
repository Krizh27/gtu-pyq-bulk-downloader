# Debugging Guide

When things go wrong, this guide will help you identify where the error is occurring and how to fix it.

## 1. Identifying the Error Layer

The application is split into two halves. You must first determine which half is failing.
- **Frontend Errors**: The UI looks broken, buttons don't work, or the browser console shows red text.
- **Backend Errors**: The UI works, but when you click "Get Paper Links", a red toast appears saying "Network Error" or "Bad Request".
- **External Errors (GTU)**: The UI works, the links generate, but downloading fails or shows "Browser blocked the download".

---

## 2. Debugging the Backend

The backend is an Express API running in Node.js.

### Common Issues
1. **`PORT environment variable is required`**: Node can't start because it doesn't know what port to bind to. We added a fallback to `8080` in `index.js`, but if it fails, try running `export PORT=8080 && npm start`.
2. **`400 Bad Request`**: The frontend sent data that the backend rejected.
3. **`500 Internal Server Error`**: The backend crashed while processing a request.

### How to Debug
1. **Read the Server Logs**: The backend uses `pino-http` to log *every* incoming request to the terminal. Look at the terminal running the backend. You will see the incoming payload and the exact response code.
2. **Test Manually**: You don't need the frontend to test the backend. You can use Postman, `curl`, or an API client to send a raw JSON POST request to `http://localhost:8080/api/pyq/check` to isolate the problem.

---

## 3. Debugging the Frontend

The frontend is a React application running in the browser.

### Common Issues
1. **White Screen of Death**: A React component threw an unhandled error during rendering.
2. **Network Error / Backend Unreachable**: The frontend cannot connect to the backend. Ensure the backend is actually running on `localhost:8080`.
3. **CORS Errors**: The browser blocked the frontend from making a request due to Cross-Origin constraints. 

### How to Debug
1. **Open Browser Developer Tools**: Press `F12` or `Ctrl+Shift+I`.
2. **Console Tab**: Look for red text. This will tell you if there are Javascript errors, React state issues, or uncaught exceptions.
3. **Network Tab**: This is the most powerful tool. It shows exactly what HTTP requests the browser sent. You can click on the `check` request to see the raw JSON sent to the backend and the raw JSON received.
4. **Vite Terminal**: Look at the terminal running `npm run dev`. If there's a syntax error in your `.jsx` files, Vite will print a giant red error message pointing to the exact line number.

---

## 4. Debugging GTU External Downloads

The application relies on GTU hosting the PDFs predictably.
- **Error**: "Browser blocked the download"
- **Reason**: GTU servers don't always send the correct `Access-Control-Allow-Origin` headers. When this happens, JavaScript in the browser is strictly forbidden from downloading the file programmatically (for security reasons).
- **Fix**: There is no code fix for this other than proxying the PDF through our backend (which wastes massive bandwidth). The intended fallback is to instruct the user to manually click the generated direct links.
