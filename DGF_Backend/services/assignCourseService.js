// services/assignCourseService.js
const db = require('../config/db');
 
const assignCourse = (assignmentData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO assigned_courses
            (requestid, employee_id, mentor_id, course_id, coursetype_id, completion_date, comments, learning_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
       
        const values = [
            assignmentData.requestid,
            assignmentData.employee_id,
            assignmentData.mentor_id,
            assignmentData.course_id,
            assignmentData.coursetype_id,
            assignmentData.completion_date || null,
            assignmentData.comments || null,
            assignmentData.learning_type || null
        ];
 
        db.execute(query, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
 
module.exports = {
    assignCourse
};
 