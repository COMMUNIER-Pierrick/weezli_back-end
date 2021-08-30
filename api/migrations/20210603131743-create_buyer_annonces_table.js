"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("buyer_annonces", {
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
			kg_wanted: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			list_objects: {
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
		await queryInterface.dropTable("buyer_annonces");
	},
};
