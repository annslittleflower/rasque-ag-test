import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@/common/contexts/auth";
import { SummaryTable } from "@/features";


const Summary =  () => {
  const navigate = useNavigate();
  const {currentUser} = useAuthContext()

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
    }
  }, [currentUser])

  return (
    <div>
      <h2>Summary</h2>
      <SummaryTable />
    </div>
  );
}

export default Summary
