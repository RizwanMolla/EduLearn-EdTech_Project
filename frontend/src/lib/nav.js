// Opens the command palette from anywhere
export const openSearch = () => window.dispatchEvent(new CustomEvent('edulearn:search'));

// Only allow same-site redirects after sign in
export const safeRedirect = (value) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard');
