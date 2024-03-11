import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExperimentForm from '../components/study/ExperimentForm';
import sendJsonToFlask from '../services/BackendAPI';
import { experimentFormat } from '../services/JsonFormatting';

jest.mock('../services/BackendAPI', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../services/JsonFormatting', () => ({
    experimentFormat: jest.fn(),
}));

describe('ExperimentForm', () => {
    const mockExpId = 'E-MTAB-6265-Sample';

    beforeEach(() => {
        sendJsonToFlask.mockClear();
        experimentFormat.mockClear();
        experimentFormat.mockImplementation((title, description, accession) => ({
            experiment: { title, description, accession },
        }));
        render(<ExperimentForm id={mockExpId} />);
    });

    it('Renders the Experiment Form', () => {

        expect(screen.getByText(`Experiment ${mockExpId}`)).toBeInTheDocument();
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByLabelText('Number of Samples')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Sample Form' })).toBeInTheDocument();
    });

    it('Updates state on text field change', () => {

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'title' },});
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'description.' },});
        fireEvent.change(screen.getByLabelText('Number of Samples'), { target: { value: '3' },});

        fireEvent.click(screen.getByRole('button', { name: 'Create Sample Form' }));
    });

    it('Calls sendJsonToFlask with the correct data on submit', async () => {

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'title' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'description' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create Sample Form' }));
    
        await waitFor(() => {
            expect(sendJsonToFlask).toHaveBeenCalledWith(
            {
                experiment: {
                    accession: 'E-MTAB-6265',
                    description: 'description',
                    title: 'title',
                }
            },
            'http://127.0.0.1:2020/create_experiment'
            );
        });
    });
});
