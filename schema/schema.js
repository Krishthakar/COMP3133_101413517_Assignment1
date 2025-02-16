const { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLID, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: GraphQLID },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: { type: GraphQLString },
    designation: { type: GraphQLString },
    salary: { type: GraphQLFloat },
    department: { type: GraphQLString }
  })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      login: {
        type: UserType,
        args: {
          username: { type: GraphQLString },
          password: { type: GraphQLString }
        },
        async resolve(parent, args) {
          const user = await User.findOne({ username: args.username });
          if (!user) {
            throw new Error('User not found');
          }
          if (args.password !== user.password) {
            throw new Error('Incorrect password');
          }
          return user;
        }
      },
      getAllEmployees: {
        type: new GraphQLList(EmployeeType),
        async resolve() {
          return Employee.find();
        }
      },
      searchEmployeeById: {
        type: EmployeeType,
        args: { id: { type: GraphQLID } },
        async resolve(parent, args) {
          return Employee.findById(args.id);
        }
      },
      searchEmployeeByDesignationOrDepartment: {
        type: new GraphQLList(EmployeeType),
        args: {
          designation: { type: GraphQLString },
          department: { type: GraphQLString }
        },
        async resolve(parent, args) {
          const filter = {};
          if (args.designation) filter.designation = args.designation;
          if (args.department) filter.department = args.department;
          return Employee.find(filter);
        }
      }
    }
  });
  

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const user = new User(args);
        return user.save();
      }
    },
    addEmployee: {
      type: EmployeeType,
      args: {
        first_name: { type: new GraphQLNonNull(GraphQLString) },
        last_name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type: GraphQLString },
        designation: { type: new GraphQLNonNull(GraphQLString) },
        salary: { type: new GraphQLNonNull(GraphQLFloat) },
        date_of_joining: { type: new GraphQLNonNull(GraphQLString) },
        department: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const employee = new Employee(args);
        return employee.save();
      }
    },
    updateEmployeeById: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        salary: { type: GraphQLFloat },
        designation: { type: GraphQLString }
      },
      async resolve(parent, args) {
        return Employee.findByIdAndUpdate(args.id, args, { new: true });
      }
    },
    deleteEmployeeById: {
        type: EmployeeType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        async resolve(parent, args) {
          return Employee.findByIdAndDelete(args.id);
        }
      }
      
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
