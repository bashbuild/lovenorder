const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

// Database tables
const db = require('./models')

// Routers
const usersRouter = require('./routes/Users')
const productsRouter = require('./routes/Products')

app.use('/api/v1/users', usersRouter)
app.use('/api/v1/products', productsRouter)

// Connect/Create tables on mysql database
db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log("Server running on port 8080")
    })
})

