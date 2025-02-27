import { useContext, useEffect, useState } from 'react';
import RequestTable from "./Training/RequestTable";
import TrainingHeaderBtn from "./Training/TrainingHeaderBtn";
import AuthContext from './Auth/AuthContext';
 
const TrainingContainer = () => {
  const { user } = useContext(AuthContext);
  const [roleId, setRoleId] = useState(null);
 
  useEffect(() => {
    if (user) {
      setRoleId(user.role_id);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setRoleId(parsedUser.role_id);
      }
    }
  }, [user]);
 
  const styles = {
    mainContent: {
      flex: 'auto',
      boxSizing: 'border-box',
      padding: '10px 0px 0 0',
      // marginLeft: '240px',
      // marginright: '0',
      maxHeight: '100vh',
      maxWidth: '100%',
      // minWidth: '100%',
     marginBottom: '35px',
    }
  };
 
  return (
    <div style={styles.mainContent}>
      <TrainingHeaderBtn />
      {roleId && <RequestTable roleId={roleId} />}

    </div>
  );
};
 
export default TrainingContainer;
