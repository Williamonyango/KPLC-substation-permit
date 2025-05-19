function safeValue(value) {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return JSON.stringify(value);
  return value;
}

function parseJSONField(field) {
  try {
    return JSON.parse(field);
  } catch {
    return [];
  }
}
function tryParseJSON(value) {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) return parsed;
  } catch (e) {}
  return value; // fallback to original string if not JSON
}

module.exports = { safeValue, parseJSONField, tryParseJSON };
