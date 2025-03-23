const fs = require("fs");
const { cloudinaryServices } = require("../services/cloudinary.service");

// add image
const saveImageCloudinary = async (req, res, next) => {

  try {
    const result = await cloudinaryServices.cloudinaryImageUpload(
      req.file.buffer
    );
    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data: { url: result.secure_url, id: result.public_id },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// add image
const addMultipleImageCloudinary = async (req, res) => {
  try {
    const files = req.files;

    const uploadResults = [];

    for (const file of files) {
      const result = await cloudinaryServices.cloudinaryImageUpload(file.path);

      uploadResults.push(result);
    }

    for (const file of files) {
      fs.unlinkSync(file.path);
    }

    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data:
        uploadResults.length > 0
          ? uploadResults.map((res) => ({
            url: res.secure_url,
            id: res.public_id,
          }))
          : [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Failed to upload image",
    });
  }
};

// cloudinary ImageDelete
const cloudinaryDeleteController = async (req, res) => {
  try {
    const { folder_name, id } = req.query;
    const public_id = `${folder_name}/${id}`;
    const result = await cloudinaryServices.cloudinaryImageDelete(public_id);
    res.status(200).json({
      success: true,
      message: "delete image successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Failed to delete image",
    });
  }
};

exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
};
