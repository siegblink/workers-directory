/**
 * User Role Constants
 * Defines the different user roles in the application
 */
export const USER_ROLES = {
  ADMIN: 1,
  WORKER: 2,
  USER: 3,
} as const;

/**
 * Type for user roles
 */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
