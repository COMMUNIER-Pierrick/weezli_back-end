module.exports = (sequelize, DataTypes) => {
	const Seller_annonce = sequelize.define("seller_annonce", {
		adress_departure: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		adress_arrival: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		datetime_departure: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		datetime_arrival: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		kg_available: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		kg_price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		dimensions: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		travel_mode: {
			type: DataTypes.STRING,
		},
		description_conditions: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	});

	Seller_annonce.associate = function (models) {
		Seller_annonce.belongsTo(models.user, {
			foreignKey: { name: "userId", allowNull: false },
			as: "user",
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	};

	return Seller_annonce;
};
