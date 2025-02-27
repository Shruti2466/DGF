import React from "react"
 
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  IconButton,
  Box,
  Typography,
  LinearProgress,
  Pagination,
  Menu,
  MenuItem,
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp, ChatBubbleOutline, ArrowForward } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
 
// Styled components remain the same...
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
}))
 
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
}))
 
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
}))
 
const StatusChip = styled(Box)(({ theme }) => ({
  padding: "6px 12px",
  color: "#06819E",
}))
 
// Sample data creation function remains the same...
const createData = (name, avatar, coursesAssigned, availableFrom, dailyBandwidth, weekendAvailability, status) => ({
  name,
  avatar,
  coursesAssigned,
  availableFrom,
  dailyBandwidth,
  weekendAvailability,
  status,
  courses: [
    {
      mentor: "Jonathan Hart",
      courseName: "Angular JS",
      progress: 10,
      endDate: "31st Jan, 2025",
      comments: "Update the learning progress on weekly basis...",
      status: "Learning Initiated",
    },
    {
      mentor: "Maria Jones",
      courseName: "Typescript",
      progress: 0,
      endDate: "1st Mar, 2025",
      comments: "",
      status: "Learning Initiated",
    },
  ],
})
 
// Sample data remains the same...
const rows = [
  createData("Jonathan Hart", "/placeholder.svg", 2, "10th Jan, 2025", "4hrs", "No", "Learning Initiated"),
  createData("Mike Clark", "/placeholder.svg", 2, "10th Jan, 2025", "4hrs", "No", "Learning Initiated"),
  createData("Alan Patel", "/placeholder.svg", 0, "10th Jan, 2025", "12hrs", "No", "Learning Initiated"),
  createData("Joe Estrada", "/placeholder.svg", 2, "10th Jan, 2025", "4hrs", "No", "Learning Initiated"),
  createData("Janet Powell", "/placeholder.svg", 2, "10th Jan, 2025", "4hrs", "No", "Learning Initiated"),
  createData("Jonathan Hart", "/placeholder.svg", 2, "10th Jan, 2025", "4hrs", "No", "Learning Initiated"),
  createData("Jonathan Hart", "/placeholder.svg", 2, "10th Jan, 2025", "4hrs", "No", "Learning Initiated"),
  createData("Jonathan Hart", "/placeholder.svg", 2, "10th Jan, 2025", "4hrs", "No", "Learning Initiated"),
  createData("Jonathan Hart", "/placeholder.svg", 2, "10th Jan, 2025", "4hrs", "No", "Learning Initiated"),
]
 
// Row component remains the same...
function Row({ row }) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
 
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
 
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
 
  return (
    <>
      <TableRow sx={{ backgroundColor: open ? "#f1f2fd" : "white" }}>
        <TableCell padding="checkbox">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <input type="checkbox" />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={row.avatar} />
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
          <HeaderButton variant="outlined">Assign Course</HeaderButton>
        </TableCell>
      </TableRow>
      {open && (
        <TableRow sx={{ backgroundColor: "#f1f2fd" }}>
          <TableCell colSpan={9} sx={{ py: 0 }}>
            <Box sx={{ marginLeft: 10, marginRight: 8, textAlign: "left !important" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Mentor</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Courses Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Comments</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.courses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course.mentor}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "12px !important",
                              }}
                            >
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
                            "& .MuiPaper-root": {
                              width: "200px",
                              height: "175px",
                            },
                          }}
                        >
                          <MenuItem
                            onClick={handleMenuClose}
                            sx={{ borderBottom: "1px solid #CCCCCC", fontFamily: "inherit" }}
                          >
                            Completed
                          </MenuItem>
                          <MenuItem
                            onClick={handleMenuClose}
                            sx={{ borderBottom: "1px solid #CCCCCC", fontFamily: "inherit" }}
                          >
                            Incompleted
                          </MenuItem>
                          <MenuItem
                            onClick={handleMenuClose}
                            sx={{ borderBottom: "1px solid #CCCCCC", fontFamily: "inherit" }}
                          >
                            Learning Suspended
                          </MenuItem>
                          <MenuItem onClick={handleMenuClose} sx={{ fontFamily: "inherit" }}>
                            Completed with Delay
                          </MenuItem>
                        </Menu>
                        <IconButton
                          size="small"
                          sx={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            "&:hover": {
                              backgroundColor: "#d1d1d1",
                            },
                            "& svg": {
                              fontSize: "22px",
                              fontWeight: "bold",
                              color: "black",
                            },
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
  )
}
 
// Enhanced main component with working pagination
export default function CourseTracker() {
  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  const totalItems = rows.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
 
  // Calculate the current page items
  const getCurrentPageItems = () => {
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    return rows.slice(start, end)
  }
 
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value)
  }
 
  
 
return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        opacity: 1,
        padding: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Assign Courses & Track the Learning Progress</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <HeaderButton variant="outlined">Send Reminder</HeaderButton>
          <HeaderButton variant="outlined">Assign Course</HeaderButton>
        </Box>
      </Box>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ fontWeight: "bold", textAlign: "center" }} />
              <TableCell padding="checkbox" sx={{ fontWeight: "bold", textAlign: "center" }} />
              <TableCell sx={{ fontWeight: "bold", textAlign: "center"}}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Courses Assigned</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Available From</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Daily Bandwidth</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Weekend Availability</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageItems().map((row, index) => (
              <Row key={index} row={row} />
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
    </Box>
  )
}
 