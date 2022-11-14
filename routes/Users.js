const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcryptjs')
const { validateToken } = require('../middlewares/AuthMiddleware')
const { sign } = require('jsonwebtoken')

// Create User account => /api/v1/
router.post('/', async (req, res) => {
    const { name, email, password } = req.body

    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            name: name,
            email: email,
            password: hash
        })
        res.json({ success: true, message: "Registration sucessful!" })
    })
})

// Login User account => /api/v1/
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await Users.findOne({where: {email: email}})

    if (!user) {
        res.json({success: false, message: "Email unregistered!"})
    } else {
        bcrypt.compare(password, user.password).then(async (match) => {
            if (!match) {
                res.json({success: false, message: "Invalid password!"})
            } else {
                const accessToken = sign(
                    {
                        email: email, id: user.id
                    },
                    "importantsecret"
                )
                res.json({
                    success: true, 
                    message: "Login successful!",
                    token: accessToken,
                    email: email,
                    id: user.id
                })
            }
        })
    }
})

// Authenticate
router.get('/auth', validateToken, (req, res) => {
    res.json(req.user)
})

// Change Password
router.put('/changepassword', validateToken, async (req, res) => {
    const {oldPass, newPass, confirmNewPass} = req.body
    const user = await Users.findOne({ where: {email: req.user.email}})
    bcrypt.compare(oldPass, user.password).then(async(match) => {
        if (!match) {
            res.json({success: false, message: "Old password is incorrect!"})
        } else {
            if (newPass === confirmNewPass) {
                bcrypt.hash(newPass, 10).then((hash) => {
                    Users.update({password: hash}, {where: {email: req.user.email}})
                    res.json({success: true, message: "Old password has been changed."})
                })
            } else {
                res.json({success: false, message: "New password did not match!"})
            }
        }
    })
})

module.exports = router