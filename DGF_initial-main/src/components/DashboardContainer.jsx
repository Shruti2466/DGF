import Dashboard from "./Training/Dashboard";
import TrainingHeaderBtn from "./Training/TrainingHeaderBtn";

const DashboardContainer = () => {

  const styles = {
    mainContent: {
      flex: 'auto',
      boxSizing: 'border-box',
      padding: '10px 10px 0 0',
      marginLeft: '240px',
      marginright: '0',
      maxHeight: '100vh',
      maxWidth: '100%',
    }
  };

  return (
    <div style={styles.mainContent}>
      <TrainingHeaderBtn />
      <Dashboard/>
    </div>
  );
};


export default DashboardContainer;
