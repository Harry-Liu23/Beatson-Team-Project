import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import UploadForm from '../components/Study/UploadForm'; 

fetchMock.enableMocks();

describe('UploadForm', () => {
    beforeEach(() => {
      render(<UploadForm />);
    });

    test('renders upload form with initial state', () => {
        expect(screen.getByLabelText('Accession')).toBeInTheDocument();
        expect(screen.getByLabelText('Study Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Publication')).toBeInTheDocument();
        expect(screen.getByLabelText('Organism')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByLabelText('Number of Samples')).toHaveValue("");
        expect(screen.getByRole('button', { name: 'Create Study' })).toBeInTheDocument();
      });

    test('allows the user to input study details', () => {
        fireEvent.change(screen.getByLabelText('Accession'), { target: { value: 'Accession' } });
        fireEvent.change(screen.getByLabelText('Study Type'), { target: { value: 'studyType' } });
        fireEvent.change(screen.getByLabelText('Publication'), { target: { value: 'publication' } });
        fireEvent.change(screen.getByLabelText('Organism'), { target: { value: 'organism' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'description' } });
    
        expect(screen.getByLabelText('Accession')).toHaveValue('Accession');
        expect(screen.getByLabelText('Study Type')).toHaveValue('studyType');
        expect(screen.getByLabelText('Publication')).toHaveValue('publication');
        expect(screen.getByLabelText('Organism')).toHaveValue('organism');
        expect(screen.getByLabelText('Description')).toHaveValue('description');
      });

    test('can open the dialog and toggle additional characteristics', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Add/Remove Characteristics' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
