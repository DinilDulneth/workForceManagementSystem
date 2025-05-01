const express = require('express');
const router = express.Router();
const AccessTable = require('../model/accessTable');

router.post('/addAccess', async (req, res) => {
  try {
    const accessTable = new AccessTable(req.body);
    await accessTable.save();
    res.status(201).send(accessTable);
  } catch (error) {
    res.status(400).send(error);
  }
  });

  router.get('/getAccess', async (req, res) => {
    try {
      const accessTable = await AccessTable.find();
      res.status(200).send(accessTable);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.get('/getAccessByID/:id', async (req, res) => {
    try {
      const accessTable = await AccessTable.findById(req.params.id);
      if (!accessTable) {
        return res.status(404).send();
      }
      res.status(200).send(accessTable);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.delete('/deleteAccess/:id', async (req, res) => {
    try {
      const accessTable = await AccessTable.findByIdAndDelete(req.params.id);
      if (!accessTable) {
        return res.status(404).send();
      }
      res.status(200).send(accessTable);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.patch('/updateAccess/:id', async (req, res) => {
    try {
      const accessTable = await AccessTable.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!accessTable) {
        return res.status(404).send();
      }
      res.status(200).send(accessTable);
    } catch (error) {
      res.status(400).send(error);
    }
  });


  router.patch('/revokeAccess/:id', async (req, res) => {
    try {
      const accessTable = await AccessTable.findByIdAndUpdate(
        req.params.id,
        { status: "99", access: "99" },
        { new: true }
      );
      if (!accessTable) {
        return res.status(404).send();
      }
      res.status(200).send(accessTable);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  
  module.exports = router;