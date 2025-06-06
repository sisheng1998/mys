/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth_schemas from "../auth/schemas.js";
import type * as auth from "../auth.js";
import type * as categories_mutations from "../categories/mutations.js";
import type * as categories_queries from "../categories/queries.js";
import type * as categories_schemas from "../categories/schemas.js";
import type * as events_mutations from "../events/mutations.js";
import type * as events_queries from "../events/queries.js";
import type * as events_schemas from "../events/schemas.js";
import type * as http from "../http.js";
import type * as nameLists_migrations from "../nameLists/migrations.js";
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
import type * as utils_migration from "../utils/migration.js";
import type * as utils_name from "../utils/name.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

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
  "events/mutations": typeof events_mutations;
  "events/queries": typeof events_queries;
  "events/schemas": typeof events_schemas;
  http: typeof http;
  "nameLists/migrations": typeof nameLists_migrations;
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
  "utils/migration": typeof utils_migration;
  "utils/name": typeof utils_name;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  migrations: {
    lib: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
      cancelAll: FunctionReference<
        "mutation",
        "internal",
        { sinceTs?: number },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { limit?: number; names?: Array<string> },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      migrate: FunctionReference<
        "mutation",
        "internal",
        {
          batchSize?: number;
          cursor?: string | null;
          dryRun: boolean;
          fnHandle: string;
          name: string;
          next?: Array<{ fnHandle: string; name: string }>;
        },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
    };
  };
};
