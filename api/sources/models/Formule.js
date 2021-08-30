module.exports = (sequelize, DataTypes) => {
	const Formule = sequelize.define("formule", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		price: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	});
	
	Formule.associate = function (models) {
		Formule.hasMany(models.user, {
			as: "users",
		});
	};

	return Formule;
};
