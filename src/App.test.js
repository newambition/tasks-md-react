import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/SplashScreen', () => () => <div>SplashScreen</div>);
jest.mock('./utils/confetti', () => ({
  initializeConfetti: jest.fn(),
  triggerConfetti: jest.fn(),
}));

test('renders the splash screen', () => {
  render(<App />);
  const splashScreen = screen.getByText(/SplashScreen/i);
  expect(splashScreen).toBeInTheDocument();
});
