export const formatDate = (dateString) => {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return "Invalid Date";
	}

	// Use Intl.DateTimeFormat with IST timezone
	return new Intl.DateTimeFormat("en-IN", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	}).format(date);
};
