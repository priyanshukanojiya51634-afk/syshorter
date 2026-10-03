const express = require("express");
const mongoose = require("mongoose");
const port = 5000;
const cors = require("cors");
const app = express();
const { nanoid } = require("nanoid");
const { body, validationResult } = require("express-validator");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/Urlinformaintion")
  .then((value) => {
    console.log("Your databacse connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

const urlSchema = mongoose.Schema({
  Prevurl: String,
  newurl: String,
  shortCode: String,
});
const urlstore = mongoose.model("urlstore", urlSchema);
/*Save url in databacse*/
app.post(
  "/urlshort",
  [body("Prevurl", "Enter the valid url").notEmpty()],
  async (req, res) => {
    try {
      const { Prevurl } = req.body;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(401).json({ message: "Enter the url and after save" });
      }

      const shortCode = nanoid(6);
      const newurl = `http://localhost:${port}/${shortCode}`;
      const urldata = new urlstore({
        Prevurl: Prevurl,
        newurl: newurl,
        shortCode: shortCode,
      });
      await urldata.save();
      res.status(200).json({
        message: "Data saved successfully",
        Prevurl,
        newurl,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internel server error", success: false });
    }
  },
);
/*Get url in the databacse*/
app.get("/geturl", async (req, res) => {
  try {
    const geturl = await urlstore.find();

    if (!geturl) {
      return res.status(500).json({ message: "Url not get for any resone" });
    }
    res.status(200).json({
      message: "url get successfully",
      success: true,
      Prevurl: geturl.Prevurl,
      newurl: geturl.newurl,
      urls: geturl.map((url) => ({
        id: url._id,
        orignalurl: url.Prevurl,
        shortUrl: url.newurl,
        clicks: 0,
      })),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internel server error", success: false });
  }
});
/*Handle request frome the browser*/
app.get("/:shortCode", async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    const urlData = await urlstore.findOne({
      $or: [{ shortCode }, { newurl: `http://localhost:${port}/${shortCode}` }],
    });
    if (!urlData) {
      return res.status(404).json("Short url not found");
    }
    res.redirect(urlData.Prevurl);
  } catch (error) {
    res.status(500).json("Server error");
  }
});
app.delete("/deleteurl/:id", async (req, res) => {
  try {
    const deleteurl = await urlstore.findById(req.params.id);
    if (!deleteurl) {
      return res.status(400).json("Data not founde");
    }
    await urlstore.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "url delete successfully", success: true });
  } catch (error) {
    res.status(500).json("Url not delete");
  }
});
app.listen(port, () => {
  console.log(`server listen on http:${port}`);
});
