import { useRouter } from 'next/router';
import DisplayStudy from '../../components/Study/DisplayStudy';

export default function Study() {
  const router = useRouter();
  const {study} = router.query;

  // studyData is always null, because study is a JSON object
  // console.log(studyData);
  if (!study) {
    return <div>Loading Study...</div>; 
  }
  console.log(study);
  const studyData = typeof study === 'string' ? JSON.parse(study) : null;
  console.log(typeof studyData);
  console.log(studyData.accession);

  return (
    <div>
      {/* {studyData && <DisplayStudy study={studyData} />}
      {study}
      {studyData} */}
      <DisplayStudy studyData={studyData} />
    </div>
  )
}
