// Custom global toast helper for Community Hero

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export function triggerToast(message: string, type: ToastType = 'success') {
  const event = new CustomEvent('civic_toast', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
}
