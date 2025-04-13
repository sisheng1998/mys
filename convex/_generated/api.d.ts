/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth_schemas from "../auth/schemas.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as users_schemas from "../users/schemas.js";
import type * as utils_function from "../utils/function.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/schemas": typeof auth_schemas;
  auth: typeof auth;
  http: typeof http;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "users/schemas": typeof users_schemas;
  "utils/function": typeof utils_function;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
