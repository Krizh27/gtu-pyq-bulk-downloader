import { Router } from "express";
import { CheckPyqBody, CheckPyqResponse } from "../../api/index.js";

const router = Router();

const GTU_BASE_URL = "https://gtu.ac.in/uploads";

/**
 * @param {string} subjectCode
 * @param {string} course
 * @param {number} startYear
 * @param {number} endYear
 * @param {string[]} sessions
 * @returns {string[]}
 */
function generateUrls(
  subjectCode,
  course,
  startYear,
  endYear,
  sessions
) {
  const urls = [];
  for (let year = startYear; year <= endYear; year++) {
    for (const session of sessions) {
      const sessionPrefix = session.toUpperCase().startsWith("W") ? "W" : "S";
      urls.push(`${GTU_BASE_URL}/${sessionPrefix}${year}/${course}/${subjectCode}.pdf`);
    }
  }
  return urls;
}

router.post("/pyq/check", async (req, res) => {
  const parsed = CheckPyqBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { subjectCode, course, startYear, endYear, sessions } = parsed.data;

  if (startYear > endYear) {
    res.status(400).json({ error: "Start year must be less than or equal to end year" });
    return;
  }

  const urls = generateUrls(subjectCode, course, startYear, endYear, sessions);
  req.log.info({ subjectCode, course, startYear, endYear, sessions, totalUrls: urls.length }, "Generated PYQ candidate URLs");

  const result = CheckPyqResponse.parse({
    availableUrls: urls,
    totalFound: urls.length,
    checkedUrls: urls.length,
  });

  res.json(result);
});

export default router;
