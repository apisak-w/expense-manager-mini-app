import { ReactNode, useEffect, useState } from 'react';
import { initData, useSignal } from '@tma.js/sdk-react';
import { AppRoot, Placeholder, Spinner, Blockquote, LargeTitle } from '@telegram-apps/telegram-ui';
import { checkPermission } from '@/services/permission.service';

interface PermissionGuardProps {
  children: ReactNode;
}

export function PermissionGuard({ children }: PermissionGuardProps) {
  const initDataState = useSignal(initData.state);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyPermission() {
      const userId = initDataState?.user?.id.toString();

      if (!userId) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      const hasPermission = await checkPermission(userId);
      setIsAuthorized(hasPermission);
      setIsLoading(false);
    }

    void verifyPermission();
  }, [initDataState]);

  if (isLoading) {
    return (
      <AppRoot>
        <Placeholder
          header="Checking permissions"
          description="Please wait while we verify your access..."
        >
          <Spinner size="l" />
        </Placeholder>
      </AppRoot>
    );
  }

  if (isAuthorized === false) {
    return (
      <AppRoot>
        <Placeholder
          header="Access Denied"
          description="You do not have permission to view this content."
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <LargeTitle weight="1">Restricted</LargeTitle>
            <Blockquote>
              Please contact the administrator if you believe this is a mistake.
            </Blockquote>
          </div>
        </Placeholder>
      </AppRoot>
    );
  }

  return <>{children}</>;
}
