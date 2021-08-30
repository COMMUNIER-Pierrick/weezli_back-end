module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define("user", {
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		phone: {
			type: DataTypes.STRING,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		rib: {
			type: DataTypes.STRING,
		},
		profil_picture: {
			type: DataTypes.STRING,
		},
	});

	User.associate = function (models) {
		User.hasMany(models.seller_annonce, {
			as: "selling_annonces",
		});
		User.hasMany(models.buyer_annonce, {
			as: "buying_annonces",
		});
		User.belongsTo(models.formule, {
			foreignKey: { name: "formuleId", allowNull: false },
			as: "formule",
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
		User.hasMany(models.colis, {
			as: "colis",
		});
	};

	return User;
};
