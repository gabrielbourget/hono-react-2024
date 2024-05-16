import {
  createKindeServerClient, GrantType, type SessionManager, type UserType
} from "@kinde-oss/kinde-typescript-sdk";
import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createFactory, createMiddleware } from "hono/factory";

const {
  KINDE_DOMAIN, KINDE_CLIENT_ID, KINDE_CLIENT_SECRET, KINDE_REDIRECT_URI, KINDE_LOGOUT_REDIRECT_URI
} = process.env;

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: KINDE_DOMAIN!,
  clientId: KINDE_CLIENT_ID!,
  clientSecret: KINDE_CLIENT_SECRET!,
  redirectURL: KINDE_REDIRECT_URI!,
  logoutRedirectURL: KINDE_LOGOUT_REDIRECT_URI!
});

type Env = {
  Variables: {
    user: UserType;
  }
}

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const isAuthenticated = await kindeClient.isAuthenticated(sessionManager(c));
    if (isAuthenticated) {
      const user = await kindeClient.getUserProfile(sessionManager(c));
      c.set("user", user);
      await next()
    } else {
      return c.json({ error: "unauthorized" }, 401);
    }
  } catch (e) {
    console.error(`There was an error getting the user: ${e}`);
    return c.json({ error: "unauthorized" }, 401);
  }
});