import { useRouter } from 'next/router';
import DisplayStudy from '../../components/dataDiscoverability/DisplayStudy';

export default function Study() {
  const router = useRouter();
  const {study} = router.query;

  if (!study) {
    return <div>Loading Study...</div>; 
  }

  const studyData = typeof study === 'string' ? JSON.parse(study) : null;

  return (
    <div>
      <DisplayStudy studyData={studyData} />
    </div>
  )
}
