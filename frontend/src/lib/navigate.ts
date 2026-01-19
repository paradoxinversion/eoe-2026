let navigatorFn: ((path: string) => void) | null = null;

export function registerNavigator(fn: (path: string) => void) {
  navigatorFn = fn;
}

export function navigate(path: string) {
  if (!path) return;
  // normalize leading hash or slash
  const p = path.startsWith("#/") ? path.slice(1) : path;
  if (navigatorFn) {
    navigatorFn(p);
  } else {
    // fallback: preserve previous behavior using hash
    try {
      window.location.hash = p.startsWith("/") ? `#${p}` : `#/${p}`;
    } catch (e) {
      // ignore in test environments
    }
  }
}

export default { registerNavigator, navigate };
