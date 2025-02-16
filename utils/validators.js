const { check, validationResult } = require('express-validator');

const signupValidationRules = [
  check('username').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Please provide a valid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const employeeValidationRules = [
  check('first_name').notEmpty().withMessage('First name is required'),
  check('last_name').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Please provide a valid email address'),
  check('salary').isFloat({ min: 1000 }).withMessage('Salary must be at least 1000'),
  check('designation').notEmpty().withMessage('Designation is required'),
  check('department').notEmpty().withMessage('Department is required')
];

const validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array().map(err => err.msg).join(', '));
  }
};

module.exports = {
  signupValidationRules,
  employeeValidationRules,
  validateRequest
};
