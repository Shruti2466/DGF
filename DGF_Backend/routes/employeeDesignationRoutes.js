const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Define the route for retrieving employees by designation IDs
router.get('/employeesByDesignation', employeeController.getEmployeesByDesignationController);

module.exports = router;