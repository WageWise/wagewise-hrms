import { router } from "./trpc";
import { userLogin, userLogout, userRegister } from "@/lib/trpc/actions/auth";

export const authRouter = router({
  userLogin,
  userLogout,
  userRegister,
});
