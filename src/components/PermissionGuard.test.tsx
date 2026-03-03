import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermissionGuard } from './PermissionGuard';
import { checkPermission } from '@/services/permission.service';
import { useSignal } from '@tma.js/sdk-react';

vi.mock('@/services/permission.service');
vi.mock('@tma.js/sdk-react', async () => {
  const actual = await vi.importActual('@tma.js/sdk-react');
  return {
    ...actual,
    useSignal: vi.fn(),
    initData: {
      state: {},
    },
  };
});

describe('PermissionGuard', () => {
  const userId = '12345';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSignal).mockReturnValue({
      user: { id: userId },
    });
  });

  it('shows loading state while checking permissions', () => {
    (checkPermission as any).mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <PermissionGuard>
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
    );

    expect(screen.getByText(/Checking permissions/i)).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('shows children when user has permission', async () => {
    (checkPermission as any).mockResolvedValue(true);

    render(
      <PermissionGuard>
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Checking permissions/i)).not.toBeInTheDocument();
  });

  it('shows access denied when user does not have permission', async () => {
    (checkPermission as any).mockResolvedValue(false);

    render(
      <PermissionGuard>
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('shows access denied when user data is missing', async () => {
    vi.mocked(useSignal).mockReturnValue({});

    render(
      <PermissionGuard>
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
  });
});
