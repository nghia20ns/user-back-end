import {
  createUserService,
  detailUserService,
  changePasswordService,
  getAllUserService,
  deleteUserService,
  addEmailRecoverService,
  userUpdateService,
  getUserService,
  loginService,
  refreshTokenService,
  changeApiKeyService,
} from "../services/UserService.js";

export const getUserController = async (req, res) => {
  try {
    const { page } = req.params;
    const response = await getUserService(page);
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
export const getAllUserController = async (req, res) => {
  try {
    const response = await getAllUserService();
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
export const detailsUserController = async (req, res) => {
  const { userId } = req.params;
  if (userId) {
    const response = await detailUserService(userId);
    return res.json(response);
  } else {
    return res.json({
      status: "error",
      message: "user id is not valid",
    });
  }
};
export const createUserController = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const response = await createUserService({
      email,
      password,
    });
    return res.json(response);
  } else {
    return res.json({
      status: "lack info",
      message: "the email, password is required",
    });
  }
};
export const changePasswordController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
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
export const deleteUserController = async (req, res) => {
  try {
    const _id = req.params.id;
    if (_id) {
      const response = await deleteUserService(_id);
      if (response) {
        return res.status(200).json(response);
      } else {
        return res.json({
          status: "err",
          message: "server is problem",
        });
      }
    } else {
      return res.status(404).json({
        status: "err",
        message: "id is not valid",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "err",
      message: error,
    });
  }
};
export const addEmailRecoverController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (id) {
      const response = await addEmailRecoverService(id, data);
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
export const userUpdateController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (id) {
      const response = await userUpdateService(id, data);
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
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const response = await loginService({ email, password });
      return res.json(response);
    } else {
      return res.json({
        status: "lack info",
        message: "Please enter your email and password",
      });
    }
  } catch (error) {
    return res.json({
      status: "err",
      message: error,
    });
  }
};
export const userRefreshTokenController = async(req, res)=>{
  try {
      const refreshToken = req.headers.authorization.split(' ')[1]
      if (refreshToken) {
          const response = await refreshTokenService(refreshToken)
          return res.status(200).json(response)
      }else{
          return res.json({
              message: 'the refresh token is not valid'
          })
      }
  } catch (error) {
      return res.status(404).json({
          status: 'err',
          message: error
      })
      
  }

}
export const changeApiKeyController = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const response = await changeApiKeyService(id);
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
