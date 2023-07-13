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
    name: string
    email: string
    isMissingPreferenceSubmission: boolean
}

export interface IExistingUserDetails {
    emailAddress: string,
    password: string,
}

export interface INewUserDetails {
    emailAddress: string,
    password: string,
    displayName: string,
    type: RoleType
}

export interface IAuthenticatedAdmin extends IAuthenticatedUserDetails {
    role: AuthenticatedUserType.ADMIN
}

export interface IAuthenticatedProfessor extends IAuthenticatedUserDetails {
    role: AuthenticatedUserType.PROFESSOR
}

export type IAuthenticatedUser = 
    | IAuthenticatedAdmin
    | IAuthenticatedProfessor
