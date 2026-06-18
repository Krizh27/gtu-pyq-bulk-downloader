# Download Flow

Because the GTU web server does not provide an API to download all PDFs as a single ZIP, our application must do it from the browser.

### 1. Initiation
The user clicks "Download ZIP". The JavaScript disables the button to prevent duplicate clicks:
```javascript
document.getElementById("downloadBtn").addEventListener("click", handleDownloadZip);
```

### 2. Instantiating the Archive
We use the JSZip library (loaded via a CDN script tag in `index.html`) to create an empty, in-memory ZIP archive:
```javascript
const zip = new JSZip();
```

### 3. The Fetch Loop
The JavaScript iterates over the `papersState` array. For each paper, it updates the status to `downloading` (re-rendering the UI to show an hourglass), and then makes a direct HTTP `GET` request to the GTU server:
```javascript
const response = await fetch(paper.url);
const blob = await response.blob(); // Get the raw binary data
```

### 4. Adding to the Archive
If the download succeeds, the raw PDF `blob` is injected into the JSZip instance under the calculated filename:
```javascript
zip.file(paper.filename, blob);
paper.status = "done"; // Renders a checkmark
```

### 5. Error Handling (CORS)
Because the browser is making a request from `localhost:8080` to `gtu.ac.in`, GTU's CORS security policies may block the request. If this happens, `fetch` throws a `TypeError`. We catch this, update the UI to show an error, and unhide a warning message explaining that the user must click the links manually.

### 6. Triggering the Browser Download
Once the loop finishes, JSZip compresses all the blobs into a single binary file. We create an invisible HTML `<a>` tag, attach the blob as a URL, and simulate a click to force the user's browser to save the file to their computer:
```javascript
const content = await zip.generateAsync({ type: "blob" });
const a = document.createElement("a");
a.href = URL.createObjectURL(content);
a.download = "papers.zip";
a.click();
```
