module.exports = (sequelize, DataTypes) => {
    
    const Products = sequelize.define("Products", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        codename: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "codename"
        },
    })

    return Products
}