import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Button } from "@mui/material";
import AuthContext from "../Auth/AuthContext";
 
const InitiateLearningAssignCourse = () => {
  const [requestDetails, setRequestDetails] = useState(null);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { requestid } = useParams();
  const { user } = useContext(AuthContext);
 
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
const response = await axios.get(`http://localhost:8000/api/training-request/${requestid}`);
setRequestDetails(response.data);
        setLoading(false);
 
        // Navigate when status is 'spoc approved' or 'capdev approved'
if (response.data.status === "spoc approved" || response.data.status === "capdev approved") {
          navigate(`/initiate-learning-details/${requestid}`);
        }
 
        // Fetch learners data
const learnerResponse = await axios.get(`http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested/${requestid}`);
setLearners(learnerResponse.data);
      } catch (error) {
        console.error("Error fetching request details:", error);
        setError("Failed to fetch request details.");
        setLoading(false);
      }
    };
 
    fetchRequestDetails();
  }, [requestid, navigate]);
 
  return (
    <Paper sx={{ p: 3, mt: 2, boxShadow: 2, borderRadius: "8px" }}>
      <Typography variant="h6" fontWeight="bold">Assign Courses & Track the Learning Progress</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Typography>Status: {requestDetails?.status || "Unknown"}</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#CCE3FF" }}>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Available From</TableCell>
                  <TableCell>Daily Bandwidth</TableCell>
                  <TableCell>Weekend Availability</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {learners.length > 0 ? (
learners.map((learner) => (
                    <TableRow key={learner.emp_id}>
                      <TableCell>{learner.emp_id}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar alt="User" src={learner.profile_image} />
                          {learner.emp_name}
                        </Box>
                      </TableCell>
                      <TableCell>{learner.availablefrom}</TableCell>
                      <TableCell>{learner.dailyband}</TableCell>
                      <TableCell>{learner.availableonweekend === 1 ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No learners found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
};
 
export default InitiateLearningAssignCourse;