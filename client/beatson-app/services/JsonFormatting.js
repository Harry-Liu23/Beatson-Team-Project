
function Study(accession, studyType, publication, organism, description ) {

  var studyObject = { 
    "study" : {
      "assession" : assession,
      "study_type" : studyType,
      "publication" : publication,
      "organism" : organism,
      "description" : description
    }
  }
  return Object.toString(studyObject);
}

function Experiement(experiment_id, description, accession){
  var experiementForm = { 
    "experiment" : {
        "experiment_id": experiment_id,
        "description": description,
        "accession": accession
    }
  }
  return Object.toString(experiementForm);
}