import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SampleForm from '../components/study/SampleForm';
import BackendAPI from "../services/BackendAPI";


jest.mock('../services/BackendAPI', () => ({
  sendJsonToFlask: jest.fn(),
}));

describe('SampleForm', () => {
    let rerender;

    beforeEach(() => {
      const utils = render(<SampleForm />);
      rerender = utils.rerender;
    });

    it('DataGrid with their static columns', () => {

        const columnHeaders = [
            'Sample ID', 'Sample Group', 'Sample Project', 'Description',
            'Organism', 'Tissue', 'Sex', 'Cell Line', 'Biomaterial Provider',
            'Mouse Model', 'Date', 'Biological Repeat', 'FASTQ',
        ];
        
        columnHeaders.forEach(header => {
            expect(screen.findByText(header)).resolves.toBeInTheDocument();
        });
    });

    it('Checkboxes can be toggled and is updated in the data grid', () => {

        fireEvent.click(screen.getByText('Add/Remove Characteristics'));
        expect(screen.getByText('Select characteristic to add or remove')).toBeInTheDocument();

        rerender(<SampleForm additionalColumns={mockAdditionalColumns} />);
        const mockAdditionalColumns = {
            'cancer_type': { field: 'cancer_type' },
            'weight': { field: 'weight' },
            'control': { field: 'control' },
            'another_field': { field: 'another_field' }
        };

        fireEvent.click(screen.getByText('Update Sample Characteristics'));
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    });

    it('Add a new sample row when "Add Sample" is clicked', () => {

        const rowsBeforeClick = screen.getAllByRole('row').length;
        fireEvent.click(screen.getByRole('button', { name: 'Add Sample' }));
        const rowsAfterClick = screen.getAllByRole('row').length;
        expect(rowsAfterClick).toBe(rowsBeforeClick + 1);
    });

    it('Submits samples when "Submit" is clicked', () => {

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        expect(BackendAPI.sendJsonToFlask).toBeDefined();
    });

    it('Should show an error if submission fails due to incomplete data', () => {

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        
        expect(screen.findByDisplayValue('Submission Failed'));
        expect(screen.findByDisplayValue('You did not enter values for all samples.'));
    });
});
