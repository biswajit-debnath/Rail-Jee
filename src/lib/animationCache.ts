// Shared animation cache — module-level so it survives re-mounts.
// Kept separate from LoadingScreen so NavigationProvider can import
// preloadAnimation without pulling in lottie-react into the initial bundle.

export const animationCache = new Map<string, any>();

export function preloadAnimation(
  animationPath = '/animation/Train Animation.lottie/a/Main Scene.json'
) {
  if (animationCache.has(animationPath)) return; // already cached
  fetch(animationPath, { cache: 'force-cache' })
    .then((r) => r.json())
    .then((data) => animationCache.set(animationPath, data))
    .catch(() => {});
}
