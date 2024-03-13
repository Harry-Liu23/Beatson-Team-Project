import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import StudiesTable from '../components/dataDiscoverability/StudiesTable'; 


describe('StudiesTable', () => {

    beforeEach(() => {
        fetchMock.enableMocks(); 
        fetchMock.resetMocks();
    });

    it('renders study data correctly ', async () => {
    const mockStudyData = {
        study: [
            {
                accession: 'E-MTAB-6265',
                studyType: 'RNA-seq of coding RNA',
                publication: 'Port,J., Muthalagu, N., Raja, M., Ceteci, F., Monteverde',
                organism: 'Mus musculus',
                description: 'The aim of the project is to determine the impact of NUAK1 depletion on the transcriptome of in situ colon tumours.'
            },
            {
                accession: 'E-MTAB-6363',
                studyType: 'High-throughput sequencing, RNA-seq of coding RNA',
                publication: 'Undefined',
                organism: 'Mus musculus',
                description: 'Intestinal tumours from genetically engeenierd mouse modesl (GEMMs), of various gentopyes, were isolated at endpoint and RNA was isolated'
            },
            {
                accession: 'E-MTAB-6620',
                studyType: 'RNA-seq of coding RNA',
                publication: 'Juliana B Candido, Jennifer P Morton, Peter Bailey',
                organism: 'Mus musculus',
                description: 'Recently, we defined four subtypes of pancreatic cancer that are associated with distinct histopathological characteristics and differential survival, namely, Squamous, Pancreatic Progenitor, Immunogenic, and ADEX (Bailey et al 2016, Nature).'
            },
        ]
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockStudyData));

    render(<StudiesTable studies={mockStudyData.study}/>);

    const columnHeaders = [
        'Accession', 'Study Type', 'Publication', 'Organism','Description',
    ];

    await waitFor(() => {
        columnHeaders.forEach(async header => {
            expect(screen.findByText(header)).resolves.toBeInTheDocument();
            });
        });
    });
});