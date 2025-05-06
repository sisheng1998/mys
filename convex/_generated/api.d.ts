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
import type * as categories_mutations from "../categories/mutations.js";
import type * as categories_queries from "../categories/queries.js";
import type * as categories_schemas from "../categories/schemas.js";
import type * as http from "../http.js";
import type * as nameLists_mutations from "../nameLists/mutations.js";
import type * as nameLists_queries from "../nameLists/queries.js";
import type * as nameLists_schemas from "../nameLists/schemas.js";
import type * as templates_mutations from "../templates/mutations.js";
import type * as templates_queries from "../templates/queries.js";
import type * as templates_schemas from "../templates/schemas.js";
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
  "categories/mutations": typeof categories_mutations;
  "categories/queries": typeof categories_queries;
  "categories/schemas": typeof categories_schemas;
  http: typeof http;
  "nameLists/mutations": typeof nameLists_mutations;
  "nameLists/queries": typeof nameLists_queries;
  "nameLists/schemas": typeof nameLists_schemas;
  "templates/mutations": typeof templates_mutations;
  "templates/queries": typeof templates_queries;
  "templates/schemas": typeof templates_schemas;
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
