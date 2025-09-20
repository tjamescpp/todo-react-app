// date formatting

export const dateUtils = {
    // Convert DateTime to YYYY-MM-DD
    toDateString: (dateTime) => {
        if (!dateTime) return '';
        return new Date(dateTime).toISOString().split('T')[0];
    },

    // Convert YYYY-MM-DD to Date object
    toDateObject: (dateString) => {
        if (!dateString) return null;
        return new Date(dateString);
    },

    // Format for display
    formatForDisplay: (dateTime) => {
        if (!dateTime) return '';
        return new Date(dateTime).toLocaleDateString();
    },
};
