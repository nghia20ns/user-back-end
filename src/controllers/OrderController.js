import {
  createOrderService,
  updateOrderService,
  getOrderService,
  getDetailOrderService,
  getOrderPageService,
} from "../services/OrderService.js";

export const createOrderController = async (req, res) => {
  const { api_key, quantity, provider } = req.body;
  const id = req.user._id;
  if (quantity && provider) {
    const response = await createOrderService({
      api_key,
      id,
      quantity,
      provider,
    });
    return res.json(response);
  } else {
    return res.json({
      status: "lack info",
      message: "lack information",
    });
  }
};
export const updateOrderController = async (req, res) => {
  const { tranId } = req.params;
  if (tranId) {
    const response = await updateOrderService(tranId);
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
export const getOrderController = async (req, res) => {
  try {
    const response = await getOrderService();
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
export const getDetailOrderController = async (req, res) => {
  const { tranId } = req.params;
  if (tranId) {
    const response = await getDetailOrderService(tranId);
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
export const getOrderPageController = async (req, res) => {
  try {
    const { page } = req.params;

    const response = await getOrderPageService(page);
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
