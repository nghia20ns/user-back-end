import {
  getInformationService,
  checkTokenService,
  getAccountService,
} from "../services/ClientService.js";

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
