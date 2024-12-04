import { z } from "zod";

export const authSchema = z.object({
  body: z.object({
    email: z
      .string({
        invalid_type_error: "The email is not valid",
        required_error: "The email is required",
      })
      .email({ message: "The email is not valid" }),
    password: z
      .string({
        invalid_type_error: "The password is not valid",
        required_error: "The password is required",
      })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "The password is not valid",
      }),
  }),
});

export const authSchemaRegister = z.object({
  body: z.object({
    email: z
      .string({
        invalid_type_error: "The email is not valid",
        required_error: "The email is required",
      })
      .email({ message: "The email is not valid" }),
    password: z
      .string({
        invalid_type_error: "The password is not valid",
        required_error: "The password is required",
      })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "The password is not valid",
      }),
    name: z
      .string({
        invalid_type_error: "The name is not valid",
        required_error: "The name is required",
      })
      .min(3, { message: "The name must be at least 3 characters" }),
    lastname: z
      .string({
        invalid_type_error: "The last name is not valid",
        required_error: "The last name is required",
      })
      .min(3, { message: "The last name must be at least 3 characters" }),
    username: z
      .string({
        invalid_type_error: "The username is not valid",
        required_error: "The username is required",
      })
      .min(3, { message: "The username must be at least 3 characters" }),
  }),
});

export const authSchemaUpdate = z.object({
  body: z.object({
    id: z.string({}),
    email: z
      .string({
        invalid_type_error: "The email is not valid",
        required_error: "The email is required",
      })
      .email({ message: "The email is not valid" })
      .optional(),
    password: z
      .string({
        invalid_type_error: "The password is not valid",
        required_error: "The password is required",
      })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "The password is not valid",
      })
      .optional(),
    name: z
      .string({
        invalid_type_error: "The name is not valid",
        required_error: "The name is required",
      })
      .min(3, { message: "The name must be at least 3 characters" })
      .optional(),
    lastname: z
      .string({
        invalid_type_error: "The last name is not valid",
        required_error: "The last name is required",
      })
      .min(3, { message: "The last name must be at least 3 characters" })
      .optional(),
    username: z
      .string({
        invalid_type_error: "The username is not valid",
        required_error: "The username is required",
      })
      .min(3, { message: "The username must be at least 3 characters" })
      .optional(),
    avatar: z.string().optional(),
  }),
});
