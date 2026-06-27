/**
 * Centralized mapping of GTU subject code aliases.
 * This maps old subject codes to their new (2025-26) equivalents and vice versa.
 */
const ALIAS_GROUPS = [
  // Format: ["oldCode", "newCode", "anyFutureCode"]
  ["3140702", "BE04000221"], // Operating System (Example mapping)
  ["3140705", "BE04000222"], // Example mapping for testing
  ["3150703", "BE05000333"], // Example mapping for testing
  ["3110005", "BE01000555"]  // Example mapping for testing
];

/**
 * Given any subject code, returns an array of all related codes in its alias group.
 * If the code is not part of any known group, it returns an array containing just the input code.
 * 
 * @param {string} inputCode The subject code to look up.
 * @returns {string[]} An array of all subject codes that are aliases of each other.
 */
export function getAllCodesForSubject(inputCode) {
  if (!inputCode) return [];
  
  const normalizedInput = inputCode.trim().toUpperCase();
  
  for (const group of ALIAS_GROUPS) {
    const normalizedGroup = group.map(code => code.toUpperCase());
    if (normalizedGroup.includes(normalizedInput)) {
      return [...normalizedGroup]; // Return a copy of the group
    }
  }
  
  return [normalizedInput];
}
