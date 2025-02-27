
import { Paper, Typography, Grid, Divider, Box, FormControl, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, Avatar, Button, RadioGroup, FormControlLabel, Radio, TextField, Autocomplete } from "@mui/material";
import { useState, useEffect ,useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton'; // Correct import for IconButton
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import './ClarificationRequested.css';
import AuthContext from "../Auth/AuthContext";
import formatDate from "../../utils/dateUtils";
import removeHtmlTags from "../../utils/htmlUtils";
import { arrayBufferToBase64 } from '../../utils/ImgConveter';
import { ChatContext } from '../Context/ChatContext'; // Import ChatContext


const ClarificationRequested = ({roleId}) => {
  const [learners, setLearners] = useState([]); // State to hold the fetched learners data
  const navigate = useNavigate();
  const { requestid } = useParams(); 
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const [requestDetails, setRequestDetails] = useState(null); // Store request details
   const { messages, sendMessage, newMessage, setNewMessage } = useContext(ChatContext);
   const [comments, setComments] = useState([]);
   const [userProfiles, setUserProfiles] = useState({}); // Store user profiles
   const [latestCommentId, setLatestCommentId] = useState(null); // State to store the latest comment ID

useEffect(() => {
  const fetchData = async () => {
    try {
      const learnerResponse = await fetch(`http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested/${requestid}`);
      const learnerdata = await learnerResponse.json();
      setLearners(learnerdata);

      const commentsResponse = await fetch(`http://localhost:8000/api/comments/${requestid}`);
      const commentsdata = await commentsResponse.json();
      setComments(commentsdata);
      if (commentsdata.length > 0) {
        const latestComment = commentsdata.reduce((latest, comment) =>
          new Date(comment.created_date) > new Date(latest.created_date) ? comment : latest
        );
        setLatestCommentId(latestComment.comment_id);
      }

      const userIds = new Set();
      commentsdata.forEach(comment => {
        if (comment.created_by) userIds.add(comment.created_by);
      });

      const profiles = {};
      for (let userId of userIds) {
        const userResponse = await fetch(`http://localhost:8000/api/getempdetails/getEmpbasedOnId/${userId}`);
        const userData = await userResponse.json();
        if (userData && userData.length > 0) {
          if (userData[0]?.profile_image?.data) {
            const base64Image = `data:image/jpeg;base64,${arrayBufferToBase64(userData[0].profile_image.data)}`;
            userData[0].profile_image = base64Image;
          }
          profiles[userId] = userData[0];
        } else {
          profiles[userId] = { emp_name: 'Unknown', profile_image: '/default-avatar.png' };
        }
      }
      setUserProfiles(profiles);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [requestid]);

const sortedComments = comments.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

useEffect(() => {
  const updatedLearners = learners.map(learner => {
    if (learner.profile_image && learner.profile_image.data) {
      const base64Flag = `data:image/jpeg;base64,${arrayBufferToBase64(learner.profile_image.data)}`;
      if (learner.profile_image !== base64Flag) {
        return { ...learner, profile_image: base64Flag };
      }
    }
    return learner;
  });
  setLearners(updatedLearners);
}, [learners.length]);

useEffect(() => {
  if (requestid) {
    fetch(`http://localhost:8000/api/training-request/${requestid}`)
      .then(response => response.json())
      .then(data => setRequestDetails(data))
      .catch(error => console.error('Error fetching data:', error));
  }
}, [requestid]);

const handleSubmit = async () => {
  if (newMessage.trim()) {
    sendMessage(newMessage, requestDetails?.requestid, user.emp_id, "Approval Requested");
  }

  const commentdata = {
    requestid: requestDetails?.requestid,
    comment_text: newMessage,
    created_by: user.emp_id,
    parent_comment_id: latestCommentId,
    requeststatus: "Approval Requested"
  };

  if (latestCommentId) {
    try {
      const response = await fetch("http://localhost:8000/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentdata),
      });

      if (response.ok) {
        console.log("Comment Added Successfully");
        setNewMessage('');
      } else {
        console.error("Error adding comment:", await response.json());
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  }
};
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box
  display="flex"
  style={{
    
    borderRadius: "10px",
    alignItems: "center",
  
  }}
>
  <IconButton style={{ color: "black", marginRight: "1rem"  , marginBottom: "-1rem",}}>
    <ArrowBackIosNewIcon />
  </IconButton></Box  ><Box style={{marginLeft: "-34rem"}}>   
  <Typography
    variant="h5"
    gutterBottom
    className="mainHeading"
    style={{ fontWeight: "600", fontSize: "14px"}}
  >
    Learning Request
  </Typography>
</Box>
      </Box>
      <Divider
        style={{ margin: "1rem 0 ", marginLeft: "-30px", marginRight: "-40px" }}
      />
      <Paper elevation={1} className="paper" style={{ height: "100%", width: "100%",marginLeft:"-1.5rem" }}>
        <div className="inner-container">
          <Box style={{ padding: "10px", marginTop: "1rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control" style={{ marginBottom: "1rem" }}>
                  <Typography className="typography-label-upper">Request ID/No:</Typography>
                  <Typography className="typography-value-upper"> #{requestDetails?.requestid}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Request By:</Typography>
                  <Typography className="typography-value-upper"> {requestDetails?.requestedby}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Project:</Typography>
                  <Typography className="typography-value-upper"> {requestDetails?.newprospectname || requestDetails?.project} </Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Service Division:</Typography>
                  <Typography className="typography-value-upper">{requestDetails?.service_division}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Expected Completion:</Typography>
                  <Typography className="typography-value-upper"> {formatDate(requestDetails?.expecteddeadline)  }  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Techstack / Area:</Typography>
                  <Typography className="typography-value-upper">Front-end</Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: "0.5rem" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Primary Skills / Competencies:</Typography>
                  <Typography className="typography-value-upper"> {requestDetails?.primarySkills && requestDetails?.primarySkills.length > 0 ? (
        <ul style={{ paddingLeft: '20px' }}>
          {requestDetails?.primarySkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <Typography className="typography-value-upper">No skills available</Typography>
      )}</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider className="divider" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} />
          <Box>
            <Grid container spacing={2} style={{ marginTop: "0.5rem",paddingLeft: "5px" }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Other Skill Information in Details:</Typography>
                  <Typography className="typography-value-upper"> { removeHtmlTags(requestDetails?.otherskill)}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Completion Criteria:</Typography>
                  <Typography className="typography-value-upper">
                  {removeHtmlTags(requestDetails?.suggestedcompletioncriteria)}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ paddingLeft: "5px",marginTop: "0.5rem",}}>
              <Grid item xs={12}>
                <FormControl fullWidth className="form-control">
                  <Typography className="typography-label-upper">Comments:</Typography>
                  <Typography className="typography-value-upper"  >
                  {removeHtmlTags(requestDetails?.comments)}</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider className="divider" style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Box>
            <div style={{ maxWidth: "100%", margin: "auto",paddingLeft: "0.5rem" }}>
<h5>Employee Details</h5>
<Typography className="typography-label-upper">Employee with upto 3 ongoing learnings cannot
   be included in this learning request
</Typography> <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  marginBottom="1rem"
                  marginTop="1rem"
                  gap={2}
                >
                  <FormControl fullWidth className="formControl">
  <Typography
    className="subheader"
    style={{ display: "inline", marginBottom: "0.5rem" }}
  >
    Select Employee <span className="required">*</span>
  </Typography>

  <Autocomplete
    // options={searchResults}
    getOptionLabel={(option) => option.name || ""}
    // onInputChange={handleEmployeeSearch}
    // onChange={(event, value) => setSelectedEmployee(value)}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        placeholder="Search Employees"
        style={{
          height: "20px",
            width: "250px", // Match the width of the Select component
          marginLeft: "2px",
          marginRight: "10px",
          fontSize: "12px",
          fontStyle: "normal",
        }}
        InputProps={{
          ...params.InputProps,
          style: { fontSize: "12.5px" },
        }}
        InputLabelProps={{
          style: { fontSize: "12px", opacity: "0.75" }, // Adjust placeholder text size and opacity
        }}
      />
    )}
    PaperComponent={(props) => (
      <Paper
        {...props}
        style={{
          maxHeight: 300, // Adjust the max height of the dropdown menu
          width: 250, // Match the width of the Select component
          fontSize: "12px", // Adjust font size inside the dropdown
        }}
      />
    )}
    renderOption={(props, option) => (
      <li
        {...props}
        style={{
          fontSize: "12px",
          padding: "4px 4px 4px 6px",
        }}
      >
        {option.name}
      </li>
    )}
  />
</FormControl>
                  <Typography
                    className="subheader"
                    align="center"
                    style={{
                      margin: " 30px",
                      // marginLeft: "10px",
                      // marginRight: "10px",
                    }}
                  >
                    OR
                  </Typography>
                  <FormControl fullWidth className="formControl">
                    <Typography
                      className="subheader"
                      style={{ display: "inline", marginBottom: "0.5rem" }}
                    >
                      Enter comma(,) separated email ids{" "}
                      <span className="required">*</span>
                    </Typography>
                    <TextField
                      variant="outlined"
                      name="emails"
                      placeholder="Enter Email by , separated"
                      // value={formData.emails}
                      // onChange={handleChange}
                      InputProps={{
                        style: { fontSize: "12.5px",  width: "250px", },
                      }}
                    />
                  </FormControl>
                  <Box
                    marginTop="1.7rem"
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <Button
                      className="btn"
                      variant="contained"
                      // onClick={addEmployee}
                      sx={{
                        height: "31px",
                        fontSize: "21px",
                        fontWeight: "500",
                        minWidth: "64px",
                        backgroundColor: "white",
                        color: "#1C71FE",
                        boxShadow: "none",
                        border: "0.5px solid #1C71FE",
                      }}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
              <TableContainer
                component={Paper}
                style={{ padding: "16px", marginTop: "16px", maxWidth: "97%" }} elevation={0}
              >
                <Table size="small">
                  {learners.length > 0 && (
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Employee ID
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Available From
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Daily Bandwidth
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Available on Weekend?
                        </TableCell>
                        <TableCell
                          style={{ padding: "8px", fontWeight: "bold", fontSize: "12px" }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  )}
                 <TableBody>
      {learners.length > 0 ? (
        learners.map((learner) => (
          <TableRow key={learner.id}>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              {learner.emp_id}
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              <Box display="flex" alignItems="center" gap={1}>
              <Avatar alt="User" src={learner.profile_image} /> {/* Use the base64-encoded image */}
              {learner.emp_name}
              </Box>
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              {formatDate(learner.availablefrom)}
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              {learner.dailyband}
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              {learner.availableonweekend ===1?"Yes":"No"}
            </TableCell>
            <TableCell style={{ padding: "8px", fontSize: "12px" }}>
              <IconButton
                color="error"
               
                size="small"> <CloseIcon /></IconButton>
                            
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} style={{ textAlign: "center" }}>
            No learners found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
                </Table>
              </TableContainer>
              <Box
                style={{
                  backgroundColor: "#F8FBFF",
                  padding: "16px",
                  borderRadius: "8px",
                  marginTop: "1rem",
                  marginBottom: "1rem"
                }}
              >
             <Box display="flex" flexDirection="column" gap={2} paddingLeft={5}>
      {sortedComments.length > 0 ? (
        sortedComments.map((comment) => {
          
        
          return (
            <div key={comment.comment_id} className="user-profile" style={{ marginBottom: '16px' }}>
            <div className="avatar-name" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              {/* Display Avatar for created_by */}
              
              <Avatar
                alt="User"
                src={userProfiles[comment.created_by]?.profile_image || '/default-avatar.png'}
                style={{ marginRight: '8px' }}
              />
              {/* Display User Name for created_by */}
              <Typography className="typography-value-upper">
                {userProfiles[comment.created_by]?.emp_name || 'Unknown'}
              </Typography>
            </div>
        
            {/* Display Comment Text */}
            <Typography className="typography-value-upper" style={{ marginBottom: '8px' }}>
              {comment.comment_text}
            </Typography>
        
            {/* Display the Created Date */}
            <Typography className="typography-label-upper" style={{ fontSize: '0.85rem' }}>
              {new Date(comment.created_date).toLocaleString()}
            </Typography>
          </div>

          
          );
        })
      ) : (
        <Typography>No comments available.</Typography>
      )}
    </Box>
              <Box paddingLeft={5}>
                
                <FormControl fullWidth style={{ marginBottom: "1rem" }}>
                  <Typography
                    style={{ fontSize: "12px", marginTop: "0.5rem", color: "#4F4949" }}
                  >
                    Comments
                  </Typography>
                  <TextField
                    multiline
                    rows={4} // Ensure this is set to 4 rows
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    InputProps={{
                      style: { fontSize: '12px', backgroundColor: '#ffffff', padding: '10px', minHeight: '100px' }, // Set minimum height
                    }}
                  />
                </FormControl>
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="flex-end"
                style={{ marginTop: "4rem" }}
                gap={2}
              >
                <Button
                  variant="outlined"
                  style={{ minWidth: "12px", textTransform: 'none', color: '#1C71FE', boxShadow: 'none', border: 'none', }}
                  onClick={() => navigate("/training-container")} // Add this line
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ minWidth: "120px", textTransform: 'none', borderRadius: '10px ', backgroundColor: '#066DD2', boxShadow: 'none', color: 'white' }}
                 onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </div>
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default ClarificationRequested;
