'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("colis", {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		adress_departure:   {type: Sequelize.STRING, allowNull: false,},
		adress_arrival:     {type: Sequelize.STRING, allowNull: false,},
		datetime_departure: {type: Sequelize.DATE, allowNull: false,},
		dimensions:         {type: Sequelize.STRING, allowNull: false,},
		kg_weight:          {type: Sequelize.DOUBLE, allowNull: false,},
		price:              {type: Sequelize.DOUBLE, allowNull: false,},
		validation_code:    {type: Sequelize.INTEGER, allowNull: false,},
		description:        {type: Sequelize.STRING, allowNull: false,},
		status:             {type: Sequelize.STRING, allowNull: false,},
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		createdAt: { type: Sequelize.DATE, allowNull: false },
		updatedAt: { type: Sequelize.DATE },
	});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("colis");
  }
};
