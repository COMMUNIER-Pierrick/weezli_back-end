module.exports = (sequelize, DataTypes) => {
	const Colis = sequelize.define("colis", {
		adress_departure:   {type: DataTypes.STRING, allowNull: false,},
		adress_arrival:     {type: DataTypes.STRING, allowNull: false,},
		datetime_departure: {type: DataTypes.DATE, allowNull: false,},
        dimensions:         {type: DataTypes.STRING, allowNull: false,},
		kg_weight:          {type: DataTypes.DOUBLE, allowNull: false,},
		price:              {type: DataTypes.DOUBLE, allowNull: false,},
		validation_code:    {type: DataTypes.INTEGER, allowNull: false,},
        description:        {type: DataTypes.STRING, allowNull: false,},
        status:             {type: DataTypes.STRING, allowNull: false,},
	});

	Colis.associate = function (models) {
		Colis.belongsTo(models.user, {
			foreignKey: { name: "userId", allowNull: false },
			as: "user",
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	};

	return Colis;
};
