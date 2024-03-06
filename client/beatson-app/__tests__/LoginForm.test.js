import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../components/login/LoginForm'; 
import postFormAsJSON from '../services/BackendAPI';

jest.mock('../services/BackendAPI', () => ({
  __esModule: true, 
  default: jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ token: 'fake_user' }) })),
}));

beforeAll(() => {
  HTMLFormElement.prototype.requestSubmit = jest.fn().mockImplementation(function() {
    this.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('LoginForm', () => {

  beforeEach(() => {
    postFormAsJSON.mockClear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it('allows the user to login successfully', async () => {

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(postFormAsJSON).toHaveBeenCalledWith(expect.anything(),'http://localhost:2020/login');  
    });
  });
});