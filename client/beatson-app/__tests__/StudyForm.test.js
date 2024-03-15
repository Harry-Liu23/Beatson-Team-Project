import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudyForm from '../components/study/StudyForm';
import sendJsonToFlask from '../services/BackendAPI';
import { studyFormat } from '../services/JsonFormatting';

jest.mock('../services/BackendAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../services/JsonFormatting', () => ({
  studyFormat: jest.fn(),
}));

describe('StudyForm Component', () => {
    beforeEach(() => {
        render(<StudyForm />);
        sendJsonToFlask.mockClear();
        studyFormat.mockClear();
        studyFormat.mockImplementation((accession, studyType, publication, organism, description) => ({
            accession,
            studyType,
            publication,
            organism,
            description,
        }));
    });
    
    it('Renders all fields and the create experiments button', () => {

        expect(screen.getByLabelText('Accession')).toBeInTheDocument();
        expect(screen.getByLabelText('Study Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Publication')).toBeInTheDocument();
        expect(screen.getByLabelText('Organism')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByLabelText('Number of Experiments')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Experiments' })).toBeInTheDocument();
    });
  
    it('Submits the study details correctly', async () => {

        fireEvent.change(screen.getByLabelText('Accession'), { target: { value: 'E-MTAB-1234' } });
        fireEvent.change(screen.getByLabelText('Study Type'), { target: { value: 'RNA-seq' } });
        fireEvent.change(screen.getByLabelText('Publication'), { target: { value: 'Undefined' } });
        fireEvent.change(screen.getByLabelText('Organism'), { target: { value: 'Mus musculus' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'The aim of the project is to determine the impact of NUAK1 depletion on the transcriptome of in situ colon tumours.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create Experiments' }));

        await waitFor(() => {
            expect(studyFormat).toHaveBeenCalledWith('E-MTAB-1234', 'RNA-seq', 'Undefined', 'Mus musculus', 'The aim of the project is to determine the impact of NUAK1 depletion on the transcriptome of in situ colon tumours.');
            expect(sendJsonToFlask).toHaveBeenCalledWith({
            accession: 'E-MTAB-1234',
            studyType: 'RNA-seq',
            publication: 'Undefined',
            organism: 'Mus musculus',
            description: 'The aim of the project is to determine the impact of NUAK1 depletion on the transcriptome of in situ colon tumours.',
            }, 'http://127.0.0.1:2020/create_study');
        });
    });
});
