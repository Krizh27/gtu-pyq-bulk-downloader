# Request Lifecycle

This document traces exactly what happens when a user clicks the "Get Paper Links" button.

## Step-by-Step Flow

1. **User Action**: 
   The user fills out the subject code, selects "BE", years 2021-2023, and clicks "Get Paper Links" on the frontend.

2. **Frontend Interception**:
   - `react-hook-form` intercepts the click and prevents the page from refreshing.
   - It validates the inputs client-side (e.g., ensuring year ranges are valid).
   - If valid, it passes the data to the `onCheck` function.

3. **API Call (`useCheckPyq`)**:
   - The React component calls the custom hook.
   - The hook uses the `customFetch` utility to send an HTTP POST request to `http://localhost:8080/api/pyq/check`.

4. **Backend Reception (`Express`)**:
   - The Express server receives the POST request.
   - `express.json()` middleware parses the raw bytes into a JavaScript object (`req.body`).
   - The request hits the `router.post("/pyq/check")` endpoint.

5. **Backend Validation (`Zod`)**:
   - `CheckPyqBody.safeParse(req.body)` runs.
   - It checks if `subjectCode` is a string, `startYear` is a number, etc.
   - If valid, execution continues.

6. **URL Generation (Business Logic)**:
   - The backend runs `generateUrls()`, looping over 2021, 2022, 2023 for both Summer and Winter.
   - It constructs an array of strings like `https://gtu.ac.in/uploads/W2021/BE/3150703.pdf`.

7. **Backend Response**:
   - The backend packages these URLs into a JSON object and sends it back with a `200 OK` status.

8. **Frontend Rendering**:
   - The React Query hook receives the response and updates its internal `data` state.
   - The React component detects the state change and automatically re-renders the UI, displaying the list of generated URLs to the user.
