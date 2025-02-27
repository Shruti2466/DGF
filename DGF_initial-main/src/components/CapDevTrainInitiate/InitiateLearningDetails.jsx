import InitiateLearningAssignCourse from './InitiateLearningAssignCourse';
import RequestInformation from './RequestInformation';
import { Divider, Typography, Box } from "@mui/material";
 
const InitiateLearningDetails = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>Learning Details</Typography>
      <Divider sx={{ my: 1 }} />
      <RequestInformation />
      <InitiateLearningAssignCourse />
    </Box>
  );
};
 
export default InitiateLearningDetails;
 