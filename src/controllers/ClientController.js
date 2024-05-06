import {
  getInformationService,
  checkTokenService,
  getAccountService,
  changePasswordService,
  uploadProfileService,
} from "../services/ClientService.js";

export const uploadProfileController = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Không có file được tải lên.");
    }

    // Kiểm tra phần mở rộng của file
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error("Only image files are allowed to be uploaded.");
    }

    const result = await uploadProfileService(req.file);
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const data = req.body;
    const id = req.user._id;
    if (id) {
      const response = await changePasswordService(id, data);
      if (response) {
        return res.json(response);
      } else {
        return res.json({
          status: "err",
          message: "server is problem",
        });
      }
    } else {
      return res.json({
        status: "err",
        message: "id is not valid",
      });
    }
  } catch (error) {
    return res.json({
      status: "err",
      message: error,
    });
  }
};

export const getInformationController = async (req, res) => {
  try {
    const id = req.user._id;
    const response = await getInformationService(id);
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.json({
        status: "err",
        message: "server is problem",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};

export const checkTokenController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({
        status: "please login",
        message: "Authorization header missing",
      });
    }
    const token = authHeader.split(" ")[1];
    const response = await checkTokenService(token);
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.json({
        status: "err",
        message: "server is problem",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};

export const getAccountController = async (req, res) => {
  try {
    const response = await getAccountService();
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.json({
        status: "err",
        message: "server is problem",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};
