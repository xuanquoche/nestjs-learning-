export const REQUEST_USER_KEY = 'user';
export const AUTH_TYPE = {
    Bearer: 'Bearer',
    None: 'None',
    ApiKey: 'ApiKey',
} as const

export type AuthTypeType = (typeof AUTH_TYPE)[keyof typeof AUTH_TYPE]

export const ConditionGuard = {
    And: 'And',
    Or: 'Or',
} as const

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard]
