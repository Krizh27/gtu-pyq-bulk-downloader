import { Router } from "express";

const router = Router();
const GTU_BASE_URL = "https://gtu.ac.in/uploads";

/**
 * Purpose: Generates a list of all mathematically possible GTU paper URLs based on the given parameters.
 * Input: subjectCode (String), course (String), startYear (Number), endYear (Number), sessions (Array of Strings)
 * Output: Array of URL strings
 * Example: generateUrls("315", "BE", 2021, 2021, ["W"]) -> ["https://gtu.ac.in/uploads/W2021/BE/315.pdf"]
 */
function generateUrls(subjectCode, course, startYear, endYear, sessions) {
  const urls = [];
  for (let year = startYear; year <= endYear; year++) {
    for (const session of sessions) {
      const sessionPrefix = session.toUpperCase().startsWith("W") ? "W" : "S";
      urls.push(`${GTU_BASE_URL}/${sessionPrefix}${year}/${course}/${subjectCode}.pdf`);
    }
  }
  return urls;
}

/**
 * Purpose: Validates the incoming JSON body using native JavaScript constraints.
 * Input: body (Object from req.body)
 * Output: { isValid: boolean, error?: string }
 * Example: validateBody({ subjectCode: "" }) -> { isValid: false, error: "Subject code is required" }
 */
function validateBody(body) {
  if (!body) return { isValid: false, error: "Missing request body" };
  if (!body.subjectCode || typeof body.subjectCode !== "string") return { isValid: false, error: "Valid subjectCode is required" };
  if (!body.course || typeof body.course !== "string") return { isValid: false, error: "Valid course is required" };
  if (!body.startYear || typeof body.startYear !== "number") return { isValid: false, error: "Valid startYear is required" };
  if (!body.endYear || typeof body.endYear !== "number") return { isValid: false, error: "Valid endYear is required" };
  if (!Array.isArray(body.sessions) || body.sessions.length === 0) return { isValid: false, error: "Valid sessions array is required" };
  if (body.startYear > body.endYear) return { isValid: false, error: "startYear must be less than or equal to endYear" };
  
  return { isValid: true };
}

/**
 * Purpose: API Endpoint handler for POST /api/pyq/check
 * Input: Express Request (req), Express Response (res)
 * Output: Sends a JSON response with the generated URLs.
 * Example: Client POSTs { subjectCode: "3150703"... } -> Responds with 200 OK and JSON { availableUrls: [...] }
 */
router.post("/pyq/check", async (req, res) => {
  const validation = validateBody(req.body);
  
  if (!validation.isValid) {
    res.status(400).json({ error: validation.error });
    return;
  }

  const { subjectCode, course, startYear, endYear, sessions } = req.body;

  const urls = generateUrls(subjectCode, course, startYear, endYear, sessions);
  console.log("Generated PYQ candidate URLs:", { subjectCode, course, startYear, endYear, sessions, totalUrls: urls.length });

  res.json({
    availableUrls: urls,
    totalFound: urls.length,
    checkedUrls: urls.length,
  });
});

export default router;
