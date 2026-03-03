import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkPermission } from './permission.service';

describe('PermissionService', () => {
  const userId = '12345';
  const apiUrl = 'http://localhost:8787';

  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', apiUrl);
    vi.clearAllMocks();
  });

  it('returns true when user has permission', async () => {
    const mockResponse = { userId: 12345, isAuthorized: true };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await checkPermission(userId);

    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(`${apiUrl}/users/${userId}/permissions`);
  });

  it('returns false when user does not have permission', async () => {
    const mockResponse = { userId: 12345, isAuthorized: false };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await checkPermission(userId);

    expect(result).toBe(false);
  });

  it('returns false when API request fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    const result = await checkPermission(userId);

    expect(result).toBe(false);
  });

  it('returns false when fetch throws error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await checkPermission(userId);

    expect(result).toBe(false);
  });
});
