module.exports = (sequelize, DataTypes) => {
	const Buyer_annonce = sequelize.define("buyer_annonce", {
		adress_departure: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		adress_arrival: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		kg_wanted: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		list_objects: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	});

	Buyer_annonce.associate = function (models) {
		Buyer_annonce.belongsTo(models.user, {
			foreignKey: { name: "userId", allowNull: false },
			as: "user",
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	};

	return Buyer_annonce;
};
