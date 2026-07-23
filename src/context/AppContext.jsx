import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

export function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

export { useAuth } from './AuthContext';
export { useTheme } from './ThemeContext';
