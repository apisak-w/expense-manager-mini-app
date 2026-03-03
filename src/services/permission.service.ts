/**
 * Fetches user permissions from the API.
 * @param userId The Telegram user ID.
 * @returns A promise that resolves to true if the user is authorized, false otherwise.
 */
export async function checkPermission(userId: string): Promise<boolean> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  
  try {
    const response = await fetch(`${apiUrl}/users/${userId}/permissions`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return !!data.isAuthorized;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return false;
  }
}
