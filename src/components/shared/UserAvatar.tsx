import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function UserAvatar() {
  const { user } = useAuth();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const photo = user?.fotoUrl;
  return (
    <span className="user-avatar">
      {photo && photo !== failedUrl ? <img src={photo} alt="" onError={() => setFailedUrl(photo)} /> :
        <span aria-hidden="true">{((user?.nombre?.[0] ?? 'S') + (user?.apellido?.[0] ?? 'P')).toUpperCase()}</span>}
    </span>
  );
}
