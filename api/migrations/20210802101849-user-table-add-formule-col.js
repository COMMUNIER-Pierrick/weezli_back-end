'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(
			"users", 
			"formuleId", 
			{
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "formules",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("users", "formuleId");
	},
};
