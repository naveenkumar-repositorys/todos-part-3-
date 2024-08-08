const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const dbPath = path.join(__dirname, 'todoApplication.db')
let db = null
const app = express()
app.use(express.json())

const initializeDbAndServer = async () => {
  try {
    db = await open({filename: dbPath, driver: sqlite3.Database})
    app.listen(3000, () => {
      console.log(`Server Running at http://localhost:3000`)
    })
  } catch (e) {
    console.log(`Db Error:${e.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()
const isStatus = requestQuery => {
  return (
    requestQuery.category === undefined &&
    requestQuery.priority === undefined &&
    requestQuery.status !== undefined
  )
}
const isCategory = requestQuery => {
  return (
    requestQuery.category !== undefined &&
    requestQuery.priority === undefined &&
    requestQuery.status === undefined
  )
}

const isPriority = requestQuery => {
  return (
    requestQuery.category === undefined &&
    requestQuery.priority !== undefined &&
    requestQuery.status === undefined
  )
}
const isCategoryPriority = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  )
}

const isCategoryStatus = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  )
}

const isPriorityStatus = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}

// API-5 functions

const isStatusUpdate = requestBody => {
  //console.log(requestBody)
  //console.log(requestBody.status === undefined)
  return requestBody.status !== undefined
}
const isPriorityUpdate = requestBody => {
  return requestBody.priority !== undefined
}
const isTodoUpdate = requestBody => {
  return requestBody.todo !== undefined
}
const isCategoryUpdate = requestBody => {
  return requestBody.category !== undefined
}
const isDueDateUpdate = requestBody => {
  return requestBody.dueDate !== undefined
}

// API-1

app.get('/todos/', async (request, response) => {
  const {status, search_q = '', priority, category} = request.query
  let findtodoQuery = null
  switch (true) {
    case isStatus(request.query):
      console.log(isStatus(request.query))
      findtodoQuery = `SELECT * FROM todo 
        WHERE
          status = "${status}";`
      break
    case isCategory(request.query):
      console.log('category is clicked')
      findtodoQuery = `SELECT * FROM todo 
        WHERE
          category = "${category}";`
      break
    case isPriority(request.query):
      console.log('priority is clicked')
      findtodoQuery = `SELECT * FROM todo 
        WHERE
          priority = "${priority}";`
      break
    case isCategoryStatus(request.query):
      console.log('categoryAndStatus is clicked')
      findtodoQuery = `SELECT * FROM todo 
        WHERE 
          category = "${category}" AND status = "${status}";`
      break
    case isCategoryPriority(request.query):
      console.log('categoryPriority is clicked')
      findtodoQuery = `SELECT * FROM todo 
        WHERE 
           priority = "${priority}" AND category = "${category}";`
      break
    case isPriorityStatus(request.query):
      console.log('priorityandstatus is clicked')
      findtodoQuery = `SELECT * FROM todo 
        WHERE 
          priority = "${priority}" AND status = "${status}";`
      break
    default:
      findtodoQuery = `SELECT * FROM todo 
        WHERE todo LIKE "%${search_q}%";`
  }
  let dbResponse = await db.all(findtodoQuery)
  console.log(dbResponse)
  response.send(dbResponse)
})

//API-5

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const {status} = request.body
  console.log(status)
  console.log(request.body.status)
  console.log(request.body)
  let findUpdateQuery = null
  switch (true) {
    case isStatusUpdate(request.body):
      //console.log('fun hit')
      findUpdateQuery = `UPDATE todo
      SET status = "${status}"
      WHERE id = ${todoId};`
      break
    case isPriorityUpdate(request.body):
      findUpdateQuery = `UPDATE todo
      SET priority = "${priority}"
      WHERE id = "${todoId}";`
      break
    case isTodoUpdate(request.body):
      findUpdateQuery = `UPDATE todo
      SET todo = "${todo}"
      WHERE id = "${todoId}";`
      break
    case isCategoryUpdate(request.body):
      findUpdateQuery = `UPDATE todo
      SET category = "${category}"
      WHERE id = "${todoId}";`
      break
    case isDueDateUpdate(request.body):
      findUpdateQuery = `UPDATE todo
      SET dueDate = "${dueDate}"
      WHERE id = "${todoId}";`
      break
  }
  let dbResponse = await db.run(findUpdateQuery)
  console.log(dbResponse)
  response.send(dbResponse)
})
