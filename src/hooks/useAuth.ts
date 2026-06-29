import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { api } from '../lib/api';
import { triggerToast } from '../lib/toast';

function loadUserFromStorage(): User | null {
  const saved = localStorage.getItem('civic_current_user');
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    // Handle old schema migration to prevent crashes
    if (parsed && !parsed.fullName && parsed.name) {
      parsed.fullName = parsed.name;
    }
    if (parsed && !parsed.fullName) return null; // Force sign-out if corrupted
    return parsed as User;
  } catch {
    return null;
  }
}

export function useAuth() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(loadUserFromStorage);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('civic_current_user', JSON.stringify(user));
    triggerToast(`Welcome back, ${user.fullName}! Access granted.`, 'success');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('civic_current_user');
    localStorage.removeItem('civic_token');
    navigate('/');
    triggerToast('Signed out securely. Session ended.', 'info');
  };

  const handleUpdateUserPoints = async (newPoints: number) => {
    if (!currentUser) return;
    const updated = { ...currentUser, reputationPoints: newPoints };
    setCurrentUser(updated);
    localStorage.setItem('civic_current_user', JSON.stringify(updated));
    const token = localStorage.getItem('civic_token');
    if (token) {
      await api.patch(`/api/users/${currentUser.id}/points`, { points: newPoints });
    }
  };

  return { currentUser, setCurrentUser, handleAuthSuccess, handleSignOut, handleUpdateUserPoints };
}
