import { filterDefined } from "../adapters/filterDefined.js";
import { HttpResponseFactory } from "../adapters/HttpResponseFactory.js";
import type { HttpError, HttpSucess } from "../adapters/IHttp.js";
import { UserStatus, type UserRole } from "../generated/prisma/index.js";
import { UserModel } from "../model/User.js";

async function findUserOrNotFound(id: number) {
  const user = await UserModel.findById(id);
  if (!user) throw new Error("UserNotFound");
  return user;
}

export const UserService = {
  async findById(id: number): Promise<HttpSucess | HttpError> {
    try {
      const user = await findUserOrNotFound(id);
      return HttpResponseFactory.ok(user);
    } catch (error) {
      if ((error as Error).message === "UserNotFound") {
        return HttpResponseFactory.notFound("User not found");
      }
      console.error("Error while fetching user by ID:", error);
      return HttpResponseFactory.internalError(
        "Internal server error while fetching user",
        (error as Error).message
      );
    }
  },

  async findByEmail(email: string): Promise<HttpSucess | HttpError> {
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return HttpResponseFactory.notFound("User not found");
      }
      return HttpResponseFactory.ok(user);
    } catch (error) {
      console.error("Error while fetching user by email:", error);
      return HttpResponseFactory.internalError(
        "Internal server error while fetching user",
        (error as Error).message
      );
    }
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    status?: UserStatus;
  }): Promise<HttpSucess | HttpError> {
    try {
      const existingUser = await UserModel.findByEmail(data.email);
      if (existingUser) {
        return HttpResponseFactory.badRequest(
          "User already exists with this email."
        );
      }
      const newUser = await UserModel.create(data);
      return HttpResponseFactory.created(newUser);
    } catch (error) {
      console.error("Error while creating user:", error);
      return HttpResponseFactory.internalError(
        "Internal server error while creating user",
        (error as Error).message
      );
    }
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      passwordHash: string;
    }>
  ): Promise<HttpSucess | HttpError> {
    try {
      await findUserOrNotFound(id);

      if (data.email) {
        const existingUser = await UserModel.findByEmail(data.email);
        if (existingUser && existingUser.id !== id) {
          return HttpResponseFactory.badRequest(
            "Email already in use by another account."
          );
        }
      }

      const safeData = filterDefined(data);
      const updatedUser = await UserModel.update(id, safeData);
      return HttpResponseFactory.ok(updatedUser);
    } catch (error) {
      if ((error as Error).message === "UserNotFound") {
        return HttpResponseFactory.notFound("User not found.");
      }
      console.error("Error while updating user:", error);
      return HttpResponseFactory.internalError(
        "Internal server error while updating user",
        (error as Error).message
      );
    }
  },

  async delete(id: number): Promise<HttpSucess | HttpError> {
    try {
      const user = await UserModel.findById(id);
      if (!user) return HttpResponseFactory.notFound("User not Found.");

      await UserModel.delete(id);
      return HttpResponseFactory.ok({ message: "User Deleted." });
    } catch (error) {
      console.error("Error while deleting user:", error);
      return HttpResponseFactory.internalError(
        "Internal server error while deleting user",
        (error as Error).message
      );
    }
  },

  async banUser(id: number): Promise<HttpSucess | HttpError> {
    try {
      const user = await UserModel.findById(id);

      if (!user) {
        return HttpResponseFactory.notFound("User not Found.");
      }

      const updatedUser = await UserModel.update(id, {
        status: UserStatus.BANNED,
      });
      return HttpResponseFactory.ok(updatedUser);
    } catch (error) {
      console.error("Error while banning user:", error);
      return HttpResponseFactory.internalError(
        "Internal server error while banning user",
        (error as Error).message
      );
    }
  },

  async deactivateInactiveUsers(): Promise<void> {
    try {
      const now = new Date();
      const fivedayAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

      const usersToDeactivate = await UserModel.findAll({
        where: {
          status: UserStatus.ACTIVE,
          lastLogin: { lt: fivedayAgo },
        },
      });

      for (const user of usersToDeactivate) {
        await UserModel.update(user.id, { status: UserStatus.INACTIVE });
        console.log(`User ${user.id} set to INACTIVE`);
      }
    } catch (error) {
      console.error("Error while deactivating inactive users:", error);
    }
  },
};
