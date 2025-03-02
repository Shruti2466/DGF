import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Checkbox, Avatar, IconButton, Pagination, PaginationItem,
  CircularProgress, LinearProgress, Menu, MenuItem
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { KeyboardArrowDown, KeyboardArrowUp, ChatBubbleOutline, ArrowForward, NavigateBefore, NavigateNext } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { arrayBufferToBase64 } from "../../utils/ImgConveter";
import AssignCourseModal from "./AssignCourseModal";

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "& .MuiTableCell-root": {
    padding: "16px",
    textAlign: "center",
    fontFamily: "inherit",
  },
  "& .MuiTableCell-root:first-of-type": {
    paddingRight: "0px !important",
    fontFamily: "inherit",
  },
  "& .MuiTableCell-root:nth-of-type(2)": {
    paddingLeft: "0px !important",
    fontFamily: "inherit",
  },
}));

const HeaderButton = styled(Button)(({ theme }) => ({
  height: "30px",
  fontSize: "10px",
  textTransform: "none",
  fontFamily: "inherit",
  padding: "8px 10px",
  backgroundColor: "#fff",
  color: "#666",
  border: "1px solid #ddd",
  borderRadius: "6px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  width: "22px",
  height: "22px",
  border: "2px solid #000000",
  borderRadius: "50%",
  marginRight: "10px",
  marginLeft: "8px",
  backgroundColor: "rgba(255, 255, 255, 0)",
  "&:hover": {
    backgroundColor: "#d1d1d1",
  },
  "& svg": {
    fontSize: "16px",
    fontWeight: "bold",
  },
}));

const StatusChip = styled(Box)(({ theme }) => ({
  padding: "6px 12px",
  color: "#06819E",
}));

// Row Component
function Row({ row, isExpanded, onToggleExpand, onAssignCourse }) {
  // For the action menu in the expanded row
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <TableRow sx={{ backgroundColor: isExpanded ? "#f1f2fd" : "white" }}>
        <TableCell padding="checkbox">
          <IconButton size="small" onClick={() => onToggleExpand(row.emp_id)}>
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <input type="checkbox" readOnly />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={row.avatar} alt={row.name} />
            {row.name}
          </Box>
        </TableCell>
        <TableCell>{row.coursesAssigned}</TableCell>
        <TableCell>{row.availableFrom}</TableCell>
        <TableCell>{row.dailyBandwidth}</TableCell>
        <TableCell>{row.weekendAvailability}</TableCell>
        <TableCell>
          <StatusChip>{row.status}</StatusChip>
        </TableCell>
        <TableCell>
          <HeaderButton onClick={() => onAssignCourse(row.emp_id)}>
            Assign Course
          </HeaderButton>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow sx={{ backgroundColor: "#f1f2fd" }}>
          <TableCell colSpan={9} sx={{ py: 0 }}>
            <Box sx={{ ml: 10, mr: 8, textAlign: "left" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Mentor</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Course Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Comments</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.courses && row.courses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course.mentor}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: "12px"
                            }}>
                              {course.courseName}
                            </Typography>
                          </Box>
                          <Box sx={{ width: "80%", flexGrow: 0 }}>
                            <LinearProgress variant="determinate" value={course.progress} />
                          </Box>
                          <Typography variant="caption">{course.progress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{course.endDate}</TableCell>
                      <TableCell>{course.comments}</TableCell>
                      <TableCell>
                        <StatusChip>{course.status}</StatusChip>
                      </TableCell>
                      <TableCell>
                        <ActionIconButton
                          size="small"
                          onClick={handleMenuClick}
                          aria-controls="status-menu"
                          aria-haspopup="true"
                        >
                          <ArrowForward />
                        </ActionIconButton>
                        <Menu
                          id="status-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          sx={{
                            "& .MuiPaper-root": { width: "200px", height: "175px" },
                          }}
                        >
                          <MenuItem onClick={handleMenuClose} sx={{ borderBottom: "1px solid #CCCCCC" }}>Completed</MenuItem>
                          <MenuItem onClick={handleMenuClose} sx={{ borderBottom: "1px solid #CCCCCC" }}>Incompleted</MenuItem>
                          <MenuItem onClick={handleMenuClose} sx={{ borderBottom: "1px solid #CCCCCC" }}>Learning Suspended</MenuItem>
                          <MenuItem onClick={handleMenuClose}>Completed with Delay</MenuItem>
                        </Menu>
                        <IconButton
                          size="small"
                          sx={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: "#d1d1d1" },
                            "& svg": { fontSize: "22px", fontWeight: "bold", color: "black" },
                          }}
                        >
                          <ChatBubbleOutline />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// Main Component: CourseTracker
export default function CourseTracker() {
  const { requestId } = useParams();
  const [page, setPage] = useState(1);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const itemsPerPage = 5;

  // Fetch learner data from API
  useEffect(() => {
    async function fetchLearnersData() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested/${requestId}`);
        const data = await response.json();
        // In your useEffect's fetchLearnersData function
const fetchedLearners = data.map(item => ({
  emp_id: item.emp_id,
  name: item.emp_name || item.emp_id, // Use actual name if available
  avatar: item.profile_image?.data 
    ? `data:image/jpeg;base64,${arrayBufferToBase64(item.profile_image.data)}`
    : "/placeholder.svg",
  coursesAssigned: 0,
  availableFrom: new Date(item.availablefrom).toLocaleDateString(),
  dailyBandwidth: item.dailyband,
  weekendAvailability: item.availableonweekend === 1 ? "Yes" : "No",
  status: item.status === "0" ? "Not Assigned" : item.status,
  courses: []
}));
        setLearners(fetchedLearners);
      } catch (error) {
        console.error("Error fetching learners:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLearnersData();
  }, [requestId]);

  // Pagination logic
  const totalItems = learners.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const getCurrentPageItems = () => {
    const start = (page - 1) * itemsPerPage;
    return learners.slice(start, start + itemsPerPage);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleToggleExpand = (empId) => {
    setExpandedId(expandedId === empId ? null : empId);
  };

  // When assign course is clicked, store the employee id and open the modal
  const handleAssignCourse = (empId) => {
    setSelectedEmployees([empId]);
    setShowAssignModal(true);
  };

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: "15px", p: 3, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", position: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Assign Courses & Track the Learning Progress</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <HeaderButton variant="outlined">Send Reminder</HeaderButton>
          <HeaderButton variant="outlined" onClick={() => setShowAssignModal(true)} disabled={selectedEmployees.length === 0}>
            Assign Course
          </HeaderButton>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StyledTableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#FAFAFA" }}>
                  <TableCell width="48px" />
                  <TableCell padding="checkbox" width="48px" />
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Courses Assigned</TableCell>
                  <TableCell align="center">Available From</TableCell>
                  <TableCell align="center">Daily Bandwidth</TableCell>
                  <TableCell align="center">Weekend Availability</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCurrentPageItems().map((row) => (
                  <Row
                    key={row.emp_id}
                    row={row}
                    isExpanded={expandedId === row.emp_id}
                    onToggleExpand={handleToggleExpand}
                    onAssignCourse={handleAssignCourse}
                  />
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Showing {Math.min(itemsPerPage, totalItems - (page - 1) * itemsPerPage)} of {totalItems} records
            </Typography>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} shape="rounded" color="primary" />
          </Box>
        </>
      )}
      <AssignCourseModal
        open={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedEmployees([]);
          // Optionally, refresh the learners list after course assignment
          // fetchLearnersData(); // Uncomment if needed (ensure to expose fetchLearnersData)
        }}
        employeeIds={selectedEmployees}
        requestId={requestId}
      />
    </Box>
  );
}
