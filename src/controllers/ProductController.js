import {
  createManyProductService,
  detailProductService,
  deleteProductService,
  updateProductService,
  createProductService,
  buyService,
  getAccountService,
} from "../services/ProductService.js";
import _ from "lodash";

export const createManyProductController = async (req, res) => {
  try {
    const apiInput = req.body;
    const response = await createManyProductService(apiInput);
    if (response) {
      return res.json(response);
    } else {
      return res.json({
        status: "error",
        message: "lack info",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};
export const createProductController = async (req, res) => {
  try {
    const data = req.body;
    const { api_key } = req.query;

    const response = await createProductService(data, api_key);
    if (response) {
      return res.json(response);
    } else {
      return res.json({
        status: "error",
        message: "lack info",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};
export const detailsProductController = async (req, res) => {
  const { productId } = req.params;
  const data = req.body;

  if (productId) {
    const response = await detailProductService(productId);
    return res.json(response);
  } else {
    return res.json({
      status: "error",
      message: "user id is not valid",
    });
  }
};
export const deleteProductController = async (req, res) => {
  const { productId } = req.params;
  if (productId) {
    const response = await deleteProductService(productId);
    return res.json(response);
  } else {
    return res.json({
      status: "error",
      message: "user id is not valid",
    });
  }
};
export const updateProductController = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (id) {
    const response = await updateProductService(id, data);
    return res.json(response);
  } else {
    return res.json({
      status: "error",
      message: "user id is not valid",
    });
  }
};

export const buyController = async (req, res) => {
  const data = req.query;
  if (data) {
    const api_key = data.api_key;
    const quantity = data.quantity;
    const provider = data.provider;

    const response = await buyService(api_key, quantity, provider);
    return res.json(response);
  } else {
    return res.json({
      status: "error",
      message: "user id is not valid",
    });
  }
};
export const getAccountController = async (req, res) => {
  try {
    const query = req.query;
    const { page, limit } = req.params;
    const response = await getAccountService(page, limit, query);
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
