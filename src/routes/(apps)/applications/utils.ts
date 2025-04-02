const DIVISIONS = [
	{ amount: 60, name: "seconds" },
	{ amount: 60, name: "minutes" },
	{ amount: 24, name: "hours" },
	{ amount: 7, name: "days" },
	{ amount: 4.34524, name: "weeks" },
	{ amount: 12, name: "months" },
	{ amount: Number.POSITIVE_INFINITY, name: "years" },
] as const;

const formatter = new Intl.RelativeTimeFormat(undefined, {
	numeric: "auto",
});

export function formatTimeAgo(input: Date | undefined | null): string {
	if (!(input instanceof Date) || isNaN(input.getTime())) {
		return "Invalid date";
	}

	let duration = (input.getTime() - Date.now()) / 1000;

	for (const division of DIVISIONS) {
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}

	return "a long time ago";
}

