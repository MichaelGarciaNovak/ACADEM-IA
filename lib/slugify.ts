/** Derives a URL-safe slug from a course title (mirrors admin logic) */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove accent marks
    .replace(/[^a-z0-9\s-]/g, '')   // remove special characters
    .trim()
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse repeated hyphens
}
