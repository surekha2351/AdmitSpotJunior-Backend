import { object, string } from "yup";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import "dotenv/config";

const contactSchema = object({
  contactName: string().required(),
  contactEmailAddress: string().required(),
  contactPhoneNumber: string().required(),
  contactAddress: string().required(),
  createdDate: string().required(),
});

const validation = async (body) => {
  console.log(body);
  try {
    await contactSchema.validate(body);
    return { valid: true, verfiedBody: body };
  } catch (error) {
    return { valid: false, error };
  }
};

const userValidation = async () => {
  const headersList = await headers();
  const authString = headersList.get("authorization");
  const userToken = authString.split(" ")[1];
  if (userToken) {
    try {
      const result = jwt.verify(userToken, process.env.MY_SECRET_TOKEN);
      return { isUserValid: true, email: result.email };
    } catch (error) {
      return { isUserValid: false, authError: error };
    }
  } else {
    return { isUserValid: false, authError: "unauthorized" };
  }
};
export { userValidation, validation };
