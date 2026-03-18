export function generateSlug(title: string, location: string) {
  const slugText = `${title} ${location}`;

  return slugText
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}