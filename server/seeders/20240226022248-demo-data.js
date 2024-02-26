"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "user1",
          name: "Doe",
          username: "username1",
          email: "user1@gmail.com",
          password: bcrypt.hashSync("password", 10),
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "user2",
          name: "Doe",
          username: "username2",
          email: "user2@gmail.com",
          password: bcrypt.hashSync("password", 10),
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "admin",
          name: "admin",
          username: "admin",
          email: "admin@gmail.com",
          password: bcrypt.hashSync("password", 10),
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "Quizzes",
      [
        {
          id: 1,
          title: "Quiz1",
          description: "Description1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: "Quiz2",
          description: "Description2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "Questions",
      [
        {
          question: "Question1",
          options: ["Option1", "Option2", "Option3", "Option4"],
          answers: ["Option1", "Option2"],
          quiz_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "Question2",
          options: ["Option1", "Option2", "Option3", "Option4"],
          answers: ["Option1", "Option3"],
          quiz_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "Question3",
          options: ["Option1", "Option2", "Option3", "Option4"],
          answers: ["Option2", "Option3"],
          quiz_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "Question4",
          options: ["Option1", "Option2", "Option3", "Option4"],
          answers: ["Option1", "Option4"],
          quiz_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "Question5",
          options: ["Option1", "Option2", "Option3", "Option4"],
          answers: ["Option2", "Option3"],
          quiz_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "Question6",
          options: ["Option1", "Option2", "Option3", "Option4"],
          answers: ["Option1", "Option4"],
          quiz_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Quizzes", null, {});
    await queryInterface.bulkDelete("Questions", null, {});
  },
};
