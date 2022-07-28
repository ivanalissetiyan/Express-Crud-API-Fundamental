const express = require("express");
const router = express.Router();

// import express validator
const { body, validationResult } = require("express-validator");

//import database
const connection = require("../config/database");

// INDEX POSTS
router.get("/", function (req, res) {
  //query
  connection.query(
    "SELECT * FROM posts ORDER BY id desc",
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Menampilkan data dari database",
          data: rows,
        });
      }
    }
  );
});

// STORE POSTS
router.post(
  "/store",
  [
    // Validation
    body("title").notEmpty(),
    body("content").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    // define form data
    let formData = {
      title: req.body.title,
      content: req.body.content,
    };

    // Insert Data
    connection.query("INSERT INTO posts SET ?", formData, function (err, rows) {
      // if (err) throw err
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal server error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "input data sukses",
          data: rows[0],
        });
      }
    });
  }
);

// SHOW POSTS
router.get("/(:id)", function (req, res) {
  let id = req.params.id;

  connection.query(
    `SELECT * FROM posts where id = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal server error",
        });
      }

      // if post not found
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Data Post Not Found",
        });
      }

      // If post found
      else {
        return res.status(200).json({
          status: true,
          message: "Detail Data Post",
          data: rows[0],
        });
      }
    }
  );
});

// UPDATE POST
router.patch(
  "/update/:id",
  [
    // Validation
    body("title").notEmpty(),
    body("content").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    // id posts
    let id = req.params.id;

    //data post dalam bentuk jenis array
    let formData = {
      title: req.body.title,
      content: req.body.content,
    };

    // update query
    connection.query(
      `UPDATE posts SET ? WHERE id = ${id}`,
      formData,
      function (err, rows) {
        // if (err) throw err
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal server error",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Update Data Sukses",
          });
        }
      }
    );
  }
);

// DELETE POST
router.delete("/delete/(:id)", function (req, res) {
  let id = req.params.id;

  // query delete
  connection.query(`DELETE FROM posts WHERE id = ${id}`, function (err, rows) {
    // if (err) throw err
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Delete Data Sukses",
      });
    }
  });
});

module.exports = router;
