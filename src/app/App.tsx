import './App.scss';
import Container from '../components/Container';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../script/query-client';
import { useState } from 'react';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <QueryClientProvider client={queryClient}>
        <Container
          isDark={isDark}
          setIsDark={() => setIsDark((prev) => !prev)}
        />
      </QueryClientProvider>
    </div>
  );
}
