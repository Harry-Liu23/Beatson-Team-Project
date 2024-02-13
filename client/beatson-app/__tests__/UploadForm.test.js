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
    });

    test('DataGrid with their static columns', async() => {
        const columnHeaders = [
            'Sample ID', 'Sample Group', 'Sample Project', 'Description',
            'Organism', 'Tissue', 'Sex', 'Cell Line', 'Biomaterial Provider',
            'Mouse Model', 'Date', 'Biological Repeat', 'FASTQ',
        ];
        
        columnHeaders.forEach(header => {
            expect(screen.findByText(header)).resolves.toBeInTheDocument();
        });
    });

    test('Checkboxes can be toggled and is updated in the data grid', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Add/Remove Characteristics' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        const toggleCheckbox = (label) => {
            const checkbox = screen.getByLabelText(label);
            fireEvent.click(checkbox);
            expect(checkbox).toBeChecked();
        };

        toggleCheckbox('Cancer Type');
        toggleCheckbox('Weight');
        toggleCheckbox('Control');
        toggleCheckbox('Another Field');

        fireEvent.click(screen.getByText('Update Sample Characteristics'));

        fireEvent.click(screen.getByText('Add/Remove Characteristics'));
        expect(screen.getByLabelText('Cancer Type')).toBeChecked();
        expect(screen.getByLabelText('Weight')).toBeChecked();
        expect(screen.getByLabelText('Control')).toBeChecked();
        expect(screen.getByLabelText('Another Field')).toBeChecked();

        fireEvent.click(screen.getByText('Cancel'));
    });

    test('Add a new sample row when "Add Sample" is clicked', () => {
        const rowsBeforeClick = screen.getAllByRole('row').length;
        fireEvent.click(screen.getByRole('button', { name: 'Add Sample' }));
        const rowsAfterClick = screen.getAllByRole('row').length;
        expect(rowsAfterClick).toBe(rowsBeforeClick + 1);
    });
});
