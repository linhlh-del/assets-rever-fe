export function useToast() {
  return {
    toast: {
      success: (msg) => console.log('✓', msg),
      error: (msg) => console.error('✗', msg),
      warning: (msg) => console.warn('!', msg),
    },
  }
}
