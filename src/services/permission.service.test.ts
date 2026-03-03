import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkPermission } from './permission.service';

describe('PermissionService', () => {
  const userId = '12345';
  const apiUrl = 'http://localhost:8787';

  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', apiUrl);
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  it('returns true when user has permission', async () => {
    const mockResponse = { userId: 12345, isAuthorized: true };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await checkPermission(userId);

    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/users/${userId}/permissions`);
  });

  it('returns false when user does not have permission', async () => {
    const mockResponse = { userId: 12345, isAuthorized: false };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await checkPermission(userId);

    expect(result).toBe(false);
  });

  it('returns false when API request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const result = await checkPermission(userId);

    expect(result).toBe(false);
  });

  it('returns false when fetch throws error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const result = await checkPermission(userId);

    expect(result).toBe(false);
  });
});
