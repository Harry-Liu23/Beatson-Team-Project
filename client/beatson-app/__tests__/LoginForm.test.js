import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import LoginForm from '../components/login/LoginForm'; 

fetchMock.enableMocks();

beforeAll(() => {
    
    fetch.resetMocks();

    jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('LoginForm', () => {
  it('allows the user to login successfully', async () => {

    fetch.mockResponseOnce(JSON.stringify({ token: 'fake_user' }));

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:2020/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        headers: {
          'Content-Type': 'application/json',

          'Access-Control-Allow-Origin': 'http://localhost:2020',
        },
        mode: 'cors'
      });
    });
  });
});