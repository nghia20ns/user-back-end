import {
    createTranstractionService,
    updateTranstractionService,
    getTranstractionService,
    getDetailTranstractionService,
    getTranstractionPageService
  } from "../services/TranstractionService.js";
  
export const createTranstractionController = async (req, res) => {
    const {api_key ,quantity,provider} = req.body;
    const id = req.user._id;
    if (quantity &&provider) {
      const response = await createTranstractionService({
        api_key,
        id,
        quantity,
        provider 
        });
      return res.json(response);
    } else {
      return res.json({
        status: "lack info",
        message: "lack information",
      });
    }
  };
  export const updateTranstractionController = async (req, res) => {
    const { tranId } = req.params;
    if (tranId) {
        const response = await updateTranstractionService(tranId);
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
        status: "lack info",
        message: "lack information",
      });
    }
  };
  export const getTranstractionController = async (req, res) => {
    try {
      const response = await getTranstractionService();
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
  export const getDetailTranstractionController = async (req, res) => {
    const { tranId } = req.params;
    if (tranId) {
        const response = await getDetailTranstractionService(tranId);
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
        status: "lack info",
        message: "lack information",
      });
    }
  };
  export const getTranstractionPageController = async (req, res) => {
    try {
      const { page } = req.params;
      
      const response = await getTranstractionPageService(page);
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