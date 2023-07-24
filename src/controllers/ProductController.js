import {
    createProductService,
    getProductService,
    getProductPageService,
    detailProductService,
    deleteProductService,
    updateProductService
  } from "../services/ProductService.js";
  import _ from "lodash";

export const createProductController = async (req, res) => {
    try {
      const apiInput = req.body;
      const response = await createProductService(apiInput);
      if (response) {
          return res.json(response);
      }else{
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
  
  export const getProductController = async (req, res) => {
    try {
      const response = await getProductService();
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
  export const getProductPageController = async (req, res) => {
    try {
      const search = req.query.search;

      const { page } = req.params;

      const response = await getProductPageService(page,search);
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
    const { productId } = req.params;
    if (productId) {
      const response = await updateProductService(productId);
      return res.json(response);
    } else {
      return res.json({
        status: "error",
        message: "user id is not valid",
      });
    }
  };