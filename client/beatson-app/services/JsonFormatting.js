
export const studyFormat = (accession, studyType, publication, organism, description ) => {
  let studyObject = { 
    "study" : {
      "accession" : accession,
      "study_type" : studyType,
      "publication" : publication,
      "organism" : organism,
      "description" : description
    }
  }
  return studyObject;
}

export const experimentFormat = (experiment_id, description, accession) => {
  let experimentForm = { 
    "experiment" : {
        "experiment_id": experiment_id,
        "description": description,
        "accession": accession
    }
  }
  return experimentForm;
}