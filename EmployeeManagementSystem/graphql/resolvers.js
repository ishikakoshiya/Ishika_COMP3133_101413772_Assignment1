const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
require('dotenv').config();

const resolvers = {
  Query: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');

      return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    },
    getEmployees: async () => await Employee.find(),
    getEmployeeById: async (_, { eid }) => await Employee.findById(eid),
    searchEmployees: async (_, { designation, department }) => {
      const query = {};
      if (designation) query.designation = designation;
      if (department) query.department = department;
      return await Employee.find(query);
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      return "User registered successfully";
    },
    addEmployee: async (_, args) => {
      const employee = new Employee(args);
      await employee.save();
      return employee;
    },
    updateEmployee: async (_, { eid, ...updates }) => {
      return await Employee.findByIdAndUpdate(eid, updates, { new: true });
    },
    deleteEmployee: async (_, { eid }) => {
      await Employee.findByIdAndDelete(eid);
      return "Employee deleted successfully";
    },
  },
};

module.exports = resolvers;
