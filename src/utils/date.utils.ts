// Always parse dates as UTC, preserving any existing offset
export function formatRelativeTime(input: string | Date): string {
  let date: Date;
  if (typeof input === "string") {
    // if string already ends with 'Z' or '+hh:mm' offset, trust it
    if (input.endsWith("Z") || /[+\-]\d{2}:\d{2}$/.test(input)) {
      date = new Date(input);
    } else {
      // bare ISO? append 'Z' to force UTC
      date = new Date(`${input}Z`);
    }
  } else {
    date = input;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
}