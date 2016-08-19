
// import
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const connection = mongoose.connection
const Schema = mongoose.Schema
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// db configuration
mongoose.connect('mongodb://localhost/new-project');
mongoose.Promise = global.Promise

connection.on('error', function(){
    console.log("Can't connect to DB!");
})

connection.once('open', function(){
    console.log('Connected to DB!');
})

// set up middle ware
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

// compile my model
const userSchema = new Schema({
  name: String,
})

const taskSchema = new Schema({
  status: String,
  uid: [{type:  Schema.Types.ObjectId, ref: 'User'}],
  description: String
})

const User = mongoose.model('User', userSchema)
const Task = mongoose.model('Task', taskSchema)

// create routes
// get
app.get('/tasks', (req, res) => {
  Task.find()
  .populate('uid')
  .then(task => res.json(task))
  .catch(e => console.log(e.message))
})

app.get('/users', (req, res) => {
  User.find(req.params)
  .then(user => res.json(user))
  .catch(e => console.log(e.message))
})


// get one
app.get('/tasks/:_id', (req, res) => {
  Task.findById(req.params._id)
  .populate('uid')
  .then(task => res.json(task))
  .catch(e => console.log(e.message))
})

app.get('/users/:_id', (req, res) => {
  Book.findById(req.params._id)
  .then(book => res.json(book))
  .catch(e => console.log(e.message))
})


// post
app.post('/tasks', (req, res) => {
  const newTask = new Task(req.body)
  newTask.save()
    .then(savedTask => {
      res.json(savedTask)
      console.log(`Saved ${savedTask.description}`)
    })
    .catch(e => console.log(e.toString()))
})

app.post('/users', (req, res) => {
  const newUser = new User(req.body)
  newUser.save()
    .then(savedUser => {
      res.json(savedUser)
      console.log(`Saved ${savedUser.name}`)
    })
    .catch(e => console.log(e.message))
})

// delete
app.delete('/tasks/:_id', (req, res) => {
  Task.findByIdAndRemove(req.params._id)
  .then(removedtask => res.json(removedtask))
  .catch(e => console.log(e.message))
})

app.delete('/users/:_id', (req, res) => {
  User.findByIdAndRemove(req.params._id)
  .then(removeduser => res.json(removeduser))
  .catch(e => console.log(e.message))
})

// update
app.put('/tasks/:_id', (req, res) => {
  Task.findById(req.params._id)
  .then(taskFromDb => {
    console.log(taskFromDb)
    Object.assign(taskFromDb, req.body)
    console.log(taskFromDb)
  taskFromDb.save()
    .then(updatedTask => res.json(updatedTask))
    .catch(e => console.log(e.message))
  })
})

app.put('/users/:_id', (req, res) => {
  User.findById(req.params._id)
  .then(userFromDb => {
    console.log(userFromDb)
    Object.assign(userFromDb, req.body)
    console.log(userFromDb)
  userFromDb.save()
    .then(updatedUser => res.json(updatedUser))
    .catch(e => console.log(e.message))
  })
})













app.listen(3000, ()=> console.log('Connecting.....'))
