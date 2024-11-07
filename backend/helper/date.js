/**
 * Date parsing functions 
 * Source: https://stackoverflow.com/a/5510783/15919672
 * With Refactorings
*/

// Constants for date components
const YEAR = 'y';
const MONTH = 'm';
const DAY = 'd';
const DATE_PART_COUNT = 3;

/**
 * Attempts to parse a date from a string based on the provided format.
 * Supports multiple date formats, e.g., "yyyy/mm/dd", "mm-dd-yyyy".
 * 
 * @param {string} dateString - The date string to parse.
 * @param {string} format - The date format as a sequence of 'y', 'm', 'd' representing year, month, and day.
 * @returns {Date | undefined} - A Date object if parsing is successful, or undefined if invalid.
 */
function parseDateFromString(dateString, format = "ymd") {
    const dateParts = extractDateParts(dateString);
    if (dateParts.length < DATE_PART_COUNT) return undefined;
    
    const formatIndices = mapFormatToIndices(format);
    const dateComponents = getDateComponents(dateParts, formatIndices);
    
    return createValidDate(dateComponents);
}

/**
 * Splits the input date string into an array of numeric components, ignoring invalid parts.
 *
 * @param {string} dateString - The date string to split.
 * @returns {number[]} - An array of numeric components of the date.
 */
function extractDateParts(dateString) {
    return (dateString || '')
        .split(/[ :\-/]/)
        .map(Number)
        .filter(Number.isFinite);
}

/**
 * Maps format string characters ('y', 'm', 'd') to their respective positions in the date parts array.
 *
 * @param {string} format - The date format string, e.g., "ymd" or "mdy".
 * @returns {object} - An object mapping 'y', 'm', 'd' to their respective indices.
 */
function mapFormatToIndices(format) {
    return [...format].reduce((indices, part, index) => ({ ...indices, [part]: index }), {});
}

/**
 * Extracts date components (year, month, day) from the date parts array using format indices.
 *
 * @param {number[]} dateParts - The numeric components of the date.
 * @param {object} formatIndices - The indices of 'y', 'm', 'd' in the date parts array.
 * @returns {number[]} - An array with the year, month, and day in the correct order.
 */
function getDateComponents(dateParts, formatIndices) {
    return [
        dateParts[formatIndices[YEAR]],
        dateParts[formatIndices[MONTH]] - 1, // Month is zero-based in JavaScript Date
        dateParts[formatIndices[DAY]]
    ].concat(dateParts.length > DATE_PART_COUNT ? dateParts.slice(DATE_PART_COUNT) : []);
}

/**
 * Creates a valid Date object if the components represent a valid date, or undefined otherwise.
 *
 * @param {number[]} components - The year, month, day, and optional time components.
 * @returns {Date | undefined} - A Date object if valid, or undefined if invalid.
 */
function createValidDate(components) {
    const date = new Date(Date.UTC(...components));
    return isDateValid(date, components) ? date : undefined;
}

/**
 * Checks if the Date object matches the specified components, ensuring date validity.
 *
 * @param {Date} date - The Date object to validate.
 * @param {number[]} components - The year, month, and day to check against.
 * @returns {boolean} - True if the date is valid, otherwise false.
 */
function isDateValid(date, components) {
    return date.getUTCFullYear() === components[0] &&
           date.getUTCMonth() === components[1] &&
           date.getUTCDate() === components[2];
}

module.exports = { parseDateFromString };
