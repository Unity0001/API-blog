import { UserModel } from "../model/User.js";

export const UserService = {
  async getUserById(id: number) {
    return await UserModel.findById(id);
  },
};
