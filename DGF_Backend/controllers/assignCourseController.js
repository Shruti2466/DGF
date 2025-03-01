// controllers/assignCourseController.js
const { assignCourse } = require('../services/assignCourseService');
 
const createAssignment = async (req, res) => {
    const { requestid, employee_id, mentor_id, course_id, coursetype_id, completion_date, comments, learning_type } = req.body;
 
    // Validate required fields
    if (!requestid || !employee_id || !mentor_id || !course_id || !coursetype_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
 
    try {
        const result = await assignCourse({ requestid, employee_id, mentor_id, course_id, coursetype_id, completion_date, comments, learning_type });
        res.status(201).json({
            message: 'Course assigned successfully',
            assignmentId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while assigning the course',
            details: error.message
        });
    }
};
 
module.exports = {
    createAssignment
};