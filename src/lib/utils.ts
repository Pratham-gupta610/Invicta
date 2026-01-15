import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Params = Partial<
  Record<keyof URLSearchParams, string | number | null | undefined>
>;

export function createQueryString(
  params: Params,
  searchParams: URLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

/**
 * Extracts and formats a display name from an email address
 * @param email - The email address to extract name from
 * @returns Formatted name (e.g., "aditya.bhatt23b@iiitg.ac.in" → "Aditya Bhatt")
 */
export function extractNameFromEmail(email: string | null | undefined): string {
  if (!email) return 'User';

  try {
    // Extract the part before @ symbol
    const localPart = email.split('@')[0];
    
    if (!localPart) return 'User';

    // Remove all numbers and any single trailing letters after numbers (like "23b" → "")
    const withoutNumbers = localPart.replace(/\d+[a-z]?/gi, '');

    // Split by dots, underscores, or hyphens
    const parts = withoutNumbers
      .split(/[._-]+/)
      .filter(part => part.length > 0)
      .map(part => {
        // Remove any remaining special characters
        const cleaned = part.replace(/[^a-zA-Z]/g, '');
        // Capitalize first letter, lowercase the rest
        if (cleaned.length === 0) return '';
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
      })
      .filter(part => part.length > 0);

    // Join parts with space
    const formattedName = parts.join(' ').trim();

    // If we got a valid name, return it; otherwise return 'User'
    return formattedName.length > 0 ? formattedName : 'User';
  } catch (error) {
    console.error('Error extracting name from email:', error);
    return 'User';
  }
}

/**
 * Gets a display name for a user, with fallback to email extraction
 * @param fullName - The user's full name (if available)
 * @param email - The user's email address
 * @param userId - The user's ID (for fallback display)
 * @returns Display name for the user
 */
export function getUserDisplayName(
  fullName: string | null | undefined,
  email: string | null | undefined,
  userId?: string
): string {
  // If we have a full name and it's not just an email address, use it
  if (fullName && fullName.trim().length > 0 && !fullName.includes('@')) {
    return fullName.trim();
  }

  // Try to extract name from email
  if (email) {
    const extractedName = extractNameFromEmail(email);
    if (extractedName !== 'User') {
      return extractedName;
    }
  }

  // Fallback to User with ID if available
  if (userId) {
    const shortId = userId.slice(0, 8);
    return `User #${shortId}`;
  }

  return 'User';
}
