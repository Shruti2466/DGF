import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress, Divider } from "@mui/material";
import AuthContext from "../Auth/AuthContext";
 
const RequestInformation = () => {
  const [requestDetails, setRequestDetails] = useState(null);
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
      <Typography variant="h6" fontWeight="bold">Request Information</Typography>
      <Divider sx={{ my: 2 }} />
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          <Typography>Request ID: #{requestDetails?.requestid}</Typography>
          <Typography>Requested By: {requestDetails?.requestedby}</Typography>
          <Typography>Project: {requestDetails?.project}</Typography>
          <Typography>Service Division: {requestDetails?.service_division}</Typography>
          <Typography>Expected Completion: {requestDetails?.expecteddeadline}</Typography>
          <Typography>Tech Stack / Area: {requestDetails?.techstack}</Typography>
        </Box>
      )}
    </Paper>
  );
};
 
export default RequestInformation;