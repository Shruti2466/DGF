import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, Avatar, IconButton, Pagination, PaginationItem,
  CircularProgress, LinearProgress, Menu, MenuItem
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { KeyboardArrowDown, KeyboardArrowUp, ChatBubbleOutline, ArrowForward } from "@mui/icons-material";
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
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Fetch assigned courses when the row is expanded
  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch(
          `http://localhost:8000/api/assigned-courses/${row.emp_id}/${row.requestid}`
        );
        
        if (!response.ok) throw new Error("Failed to fetch assigned courses");
        
        const data = await response.json();
        setAssignedCourses(data.data || []);
      } catch (error) {
        console.error("Error fetching assigned courses:", error);
        setAssignedCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    if (isExpanded) fetchAssignedCourses();
  }, [isExpanded, row.emp_id, row.requestid]);

  // Action menu state and handlers
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
              {loadingCourses ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Mentor</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Course Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Comments</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedCourses.map((course, index) => (
                      <TableRow key={index}>
                        <TableCell>{course.mentor_id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "12px"
                              }}>
                                {course.course_name || "N/A"}
                              </Typography>
                            </Box>
                            <Box sx={{ width: "80%" }}>
                              <LinearProgress variant="determinate" 
                                value={course.progress || 0} />
                            </Box>
                            <Typography variant="caption">
                              {course.progress || 0}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {course.completion_date ? 
                            new Date(course.completion_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>{course.comments || "N/A"}</TableCell>
                        <TableCell>
                          <StatusChip>{course.status || "N/A"}</StatusChip>
                        </TableCell>
                        <TableCell>
                          <ActionIconButton
                            size="small"
                            onClick={handleMenuClick}
                            aria-controls="status-menu"
                          >
                            <ArrowForward />
                          </ActionIconButton>
                          <Menu
                            id="status-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            sx={{ "& .MuiPaper-root": { width: 200, height: 175 } }}
                          >
                            {["Completed", "Incomplete", "Learning Suspended", "Completed with Delay"]
                              .map((status) => (
                                <MenuItem 
                                  key={status}
                                  onClick={handleMenuClose}
                                  sx={{ borderBottom: "1px solid #CCCCCC" }}
                                >
                                  {status}
                                </MenuItem>
                              ))}
                          </Menu>
                          <IconButton
                            size="small"
                            sx={{
                              width: "30px",
                              height: "30px",
                              "&:hover": { backgroundColor: "#d1d1d1" },
                              "& svg": { fontSize: "22px", color: "black" },
                            }}
                          >
                            <ChatBubbleOutline />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// Main Component
export default function CourseTracker() {
  const { requestId } = useParams();
  const [page, setPage] = useState(1);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const itemsPerPage = 5;

  // Fetch learner data
  useEffect(() => {
    const fetchLearnersData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested/${requestId}`
        );
        const data = await response.json();
        
        const formattedLearners = data.map(item => ({
          emp_id: item.emp_id,
          name: item.emp_name || item.emp_id,
          avatar: item.profile_image?.data 
            ? `data:image/jpeg;base64,${arrayBufferToBase64(item.profile_image.data)}`
            : "/placeholder.svg",
          coursesAssigned: 0,
          availableFrom: new Date(item.availablefrom).toLocaleDateString(),
          dailyBandwidth: item.dailyband,
          weekendAvailability: item.availableonweekend === 1 ? "Yes" : "No",
          status: item.status === "0" ? "Not Assigned" : item.status,
          requestid: requestId,
        }));
        
        setLearners(formattedLearners);
      } catch (error) {
        console.error("Error fetching learners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnersData();
  }, [requestId]);

  // Pagination handlers
  const totalPages = Math.ceil(learners.length / itemsPerPage);
  const currentItems = learners.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ 
      backgroundColor: "#FFFFFF", 
      borderRadius: "15px", 
      p: 3, 
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
      position: "relative"
    }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Assign Courses & Track Progress</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <HeaderButton variant="outlined">Send Reminder</HeaderButton>
          <HeaderButton 
            variant="outlined" 
            onClick={() => setShowAssignModal(true)}
            disabled={selectedEmployees.length === 0}
          >
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
            <Table aria-label="course-tracker-table">
              <TableHead sx={{ backgroundColor: "#FAFAFA" }}>
                <TableRow>
                  <TableCell width="48px" />
                  <TableCell padding="checkbox" width="48px" />
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Courses</TableCell>
                  <TableCell align="center">Available From</TableCell>
                  <TableCell align="center">Bandwidth</TableCell>
                  <TableCell align="center">Weekends</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((row) => (
                  <Row
                    key={row.emp_id}
                    row={row}
                    isExpanded={expandedId === row.emp_id}
                    onToggleExpand={(id) => 
                      setExpandedId(prev => prev === id ? null : id)
                    }
                    onAssignCourse={(id) => {
                      setSelectedEmployees([id]);
                      setShowAssignModal(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mt: 2, 
            alignItems: "center"
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing {currentItems.length} of {learners.length} records
            </Typography>
            <Pagination 
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
              color="primary"
            />
          </Box>
        </>
      )}

      <AssignCourseModal
        open={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedEmployees([]);
        }}
        employeeIds={selectedEmployees}
        requestId={requestId}
      />
    </Box>
  );
}
