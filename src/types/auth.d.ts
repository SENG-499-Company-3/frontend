/**
 * Enum for different user types
 */
export enum AuthenticatedUserType {
    ADMIN = 'ADMIN',
    PROFESSOR = 'PROFESSOR'
}

/**
 * Details pertaining to the currently signed in user
 */
export interface IAuthenticatedUserDetails {
    displayName: string
    emailAddress: string
}

export interface IAuthenticatedAdmin extends IAuthenticatedUserDetails {
    type: AuthenticatedUserType.ADMIN
}

export interface IAuthenticatedProfessor extends IAuthenticatedUserDetails {
    type: AuthenticatedUserType.PROFESSOR
}

export type IAuthenticatedUser = 
    | IAuthenticatedAdmin
    | IAuthenticatedProfessor
