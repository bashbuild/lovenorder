const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Products } = require('../models')
const sequelize = require('sequelize')

// Create Product data => /api/v1/products
router.post('/', validateToken, async (req, res) => {
    let { name, codename } = req.body
    const productString = name
    const productWords = productString.split(" ")
    for (let i = 0; i < productWords.length; i++) {
        productWords[i] = productWords[i][0].toUpperCase() + productWords[i].substring(1);
    }
    name = productWords.join(" ")

    Products.create({
        name: name,
        codename: codename
    })

    res.json({success: true, message: name + " has been added. "})
})

// Get All Products => /api/v1/products
router.get('/', validateToken, async (req, res) => {
    const productList = await Products.findAll({
        order: [[sequelize.literal('name'), 'ASC']]
    })
    res.json({productList: productList})
})

// Get a single Product by name => /api/v1/products/name
router.get('/:name', validateToken, async (req, res) => {
    const name = req.params.name
    const {Op} = require('sequelize')

    const productList = await Products.findAll({
        where: {
            name: {
                [Op.substring]: name
            }   
        }
    })
    res.json({productList: productList})
})

// Delete a Product => /api/v1/products/:id
router.delete('/:productId', validateToken, async (req, res) => {
    const productId = req.params.productId

    await Products.destroy({
        where: { id: productId}
    })

    res.json({success: true, message: "Product has been deleted."})
})


module.exports = router