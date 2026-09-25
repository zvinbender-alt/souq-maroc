/**
 * Safe browser utilities for iframe-sandboxed web applications
 */

/**
 * Safely copy text to clipboard without throwing 'Document is not focused' DOMException.
 * Handles iframe focus limitations, permission blocks, and fallback DOM selection.
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  // Try bringing focus to the current window
  try {
    if (typeof window !== 'undefined' && typeof window.focus === 'function') {
      window.focus();
    }
  } catch {
    // Ignore focus error
  }

  // 1. Try modern navigator.clipboard if supported and secure
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Modern clipboard writeText failed (e.g. Document is not focused in iframe).
      // Fall through to fallback DOM method.
    }
  }

  // 2. Fallback: Hidden input/textarea with document.execCommand('copy')
  try {
    if (typeof document !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      // Prevent zooming on iOS / mobile
      textArea.style.fontSize = '16px';
      // Prevent scrolling to the bottom of the page
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '-9999px';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.setAttribute('readonly', '');

      document.body.appendChild(textArea);
      textArea.focus({ preventScroll: true });
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch {
    // Both methods failed gracefully without throwing
  }

  return false;
}

/**
 * Safely open external links (tel, WhatsApp, web URLs) avoiding iframe window.open pop-up restrictions
 */
export function safeOpenExternal(url: string, target: '_blank' | '_self' = '_blank'): void {
  try {
    if (url.startsWith('tel:') || target === '_self') {
      window.location.href = url;
      return;
    }

    const a = document.createElement('a');
    a.href = url;
    a.target = target;
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    try {
      window.open(url, target, 'noopener,noreferrer');
    } catch {
      // Blocked or failed gracefully
    }
  }
}
