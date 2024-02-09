
export const studyFormat = (accession, studyType, publication, organism, description ) => {
  let studyObject = { 
    "study" : {
      "assession" : accession,
      "study_type" : studyType,
      "publication" : publication,
      "organism" : organism,
      "description" : description
    }
  }
  return Object.toString(studyObject);
}

export const experiementFormat = (experiment_id, description, accession) => {
  let experiementForm = { 
    "experiment" : {
        "experiment_id": experiment_id,
        "description": description,
        "accession": accession
    }
  }
  return Object.toString(experiementForm);
}