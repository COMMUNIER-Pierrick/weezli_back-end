"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("seller_annonces", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			adress_departure: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			adress_arrival: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			datetime_departure: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			datetime_arrival: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			kg_available: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			kg_price: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			dimensions: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			travel_mode: {
				type: Sequelize.STRING,
			},
			description_conditions: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
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
		await queryInterface.dropTable("seller_annonces");
	},
};
