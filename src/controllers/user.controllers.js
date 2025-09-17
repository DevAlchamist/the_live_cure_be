const HasherHelper = require("../helpers/Hasher.helper");
const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { UserService } = require("../services/user.service");
const { JWT_EMAIL_VERIFY_SECRET } = process.env;
const createQueryHelper = require("../helpers/Query.helper");


class UserController {
  createNewUser = async (req, res) => {
    const checkUser = await UserService.findOne({ email: req.body.email });

    console.log(req.body.name);

    if (checkUser) {
      throw new HttpError(401, "User Already Exists");
    }

    const user = await UserService.create({ ...req.body });

    const { generateToken } = user.schema.methods;

    const accessToken = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    const userData = {
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      name: user.name,
    };

    Response(res)
      .status(201)
      .body({
        accessToken,
        user: userData,
      })
      .send();
  };
  loginViaPassword = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await UserService.findOne({ email });

    if (!user) {
      throw new HttpError(404, "User Not Found");
    }

    const { generateToken } = user.schema.methods;

    const isVerify = await HasherHelper.compare(password, user.password);
    if (!isVerify) throw new HttpError(401, "Incorrect Password");

    const accessToken = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    const userData = {
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      name: user.name,
    };
    Response(res)
      .status(201)
      .body({
        accessToken,
        user: userData,
      })
      .send();
  };
  editCurrentUser = async (req, res) => {
    if (req.body.password) {
      const salt = await HasherHelper.getSalt(10);

      const hash = await HasherHelper.hash(req.body.password, salt);

      req.body.password = hash;
    }

    const user = await UserService.findByIdAndUpdate(req.user._id, {
      ...req.body,
    });

    if (!user) throw new HttpError(409, "User doesn't Exists!");

    Response(res).status(201).message("Successfully Updated!").send();
  };
  createAdminUser = async (req, res) => {
    await UserService.create({ ...req.body, role: "Admin" });
    Response(res).status(201).message("Successfully Created").send();
  };
  getCurrentUser = async (req, res) => {
    const user = await UserService.findById(req.user._id);
    const userData = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
      _id: user._id,
    };
    Response(res).body(userData).send();
  };
  getAllUsers = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["name"],
      unFilter: [],
      customFilters: (filter, query) => {
        // if (req.user.role === "ADMIN")
        filter._id = { $nin: [req.user._id] };
      },
      customPopulate: [{}],
    });
    const user = await UserService.paginate(filter, options);
    Response(res).body(user).send();
  };
  getUserDetails = async (req, res) => {
    const { userId } = req.params;
    const user = await UserService.findById(userId);
    if (!user) throw new HttpError(400, "No User Exists!");

    Response(res).body(user).send();
  };

  // Additional authentication methods
  forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    const user = await UserService.findOne({ email });
    if (!user) {
      throw new HttpError(404, "User Not Found");
    }

    // Generate reset token (you'll need to implement this in your User model)
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send email with reset token (implement email service)
    // await MailHelper.sendPasswordResetEmail(email, resetToken);

    Response(res)
      .status(200)
      .message("Password reset email sent successfully")
      .send();
  };

  resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    // Find user by reset token and check if it's valid
    const user = await UserService.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    // Hash new password
    const salt = await HasherHelper.getSalt(10);
    const hash = await HasherHelper.hash(newPassword, salt);

    // Update user password and clear reset token
    user.password = hash;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    Response(res)
      .status(200)
      .message("Password reset successfully")
      .send();
  };

  logout = async (req, res) => {
    // In a real application, you might want to blacklist the token
    // or store it in a Redis cache for token invalidation
    
    Response(res)
      .status(200)
      .message("Logged out successfully")
      .send();
  };

  changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await UserService.findById(userId);
    if (!user) {
      throw new HttpError(404, "User Not Found");
    }

    // Verify current password
    const isCurrentPasswordValid = await HasherHelper.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new HttpError(401, "Current password is incorrect");
    }

    // Hash new password
    const salt = await HasherHelper.getSalt(10);
    const hash = await HasherHelper.hash(newPassword, salt);

    // Update password
    user.password = hash;
    await user.save();

    Response(res)
      .status(200)
      .message("Password changed successfully")
      .send();
  };

}

module.exports.UserController = new UserController();
