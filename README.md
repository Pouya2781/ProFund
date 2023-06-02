# ProFund
This project is developed to help people find investors for their projects and also for people to find new projects to fund and support.

# APIs
In this part you can find information about developed APIs and how to use them properly.

## Auth APIs
* **[Check Authentication API](#check-authentication-api)**</br>
* **[Phone Number API](#check-authentication-api)**</br>
* **[Verify Phone Number API](#verify-phone-number-api)**</br>
* **[User Sign Up API](#user-sign-up-api)**

## User APIs
* **[User Info API](#user-info-api)**</br>
* **[User Wallet Info API](#user-wallet-info-api)**</br>
* **[User Payment Info API](#user-payment-info-api)**</br>
* **[User Project Info API](#user-project-info-api)**</br>
* **[User Investment Info API](#user-investment-info-api)**</br>
* **[User Donate Info API](#user-donate-info-api)**</br>
* **[User Comment Info API](#user-comment-info-api)**</br>
* **[User Reply Info API](#user-reply-info-api)**</br>
* **[User Liked Projects API](#user-liked-projects-api)**</br>
* **[User Disliked Projects API](#user-disliked-projects-api)**</br>
* **[User ID Card Picture API](#user-id-card-picture-api)**</br>
* **[User Profile Picture API](#user-profile-picture-api)**</br>
* **[User Invest API](#user-invest-api)**</br>
* **[User Donate API](#user-donate-api)**</br>
* **[User Comment API](#user-comment-api)**</br>
* **[User Reply API](#user-reply-api)**</br>
* **[User Like API](#user-like-api)**</br>
* **[User Dislike API](#user-dislike-api)**</br>
* **[User Edit API](#user-edit-api)**</br>
* **[User Verify API](#user-verify-api)**</br>
* **[User Upload ID Card Picture API](#user-upload-id-card-picture-api)**</br>
* **[User Upload Profile Picture API](#user-upload-profile-picture-api)**

## Admin APIs
* **[Admin Users API](#admin-users-api)**</br>
* **[Admin Projects API](#admin-projects-api)**</br>
* **[Admin User Search API](#admin-user-search-api)**</br>
* **[Admin Project Search API](#admin-project-search-api)**</br>
* **[Admin Project Approve API](#admin-project-approve-api)**</br>
* **[Admin Project Delete API](#admin-project-delete-api)**</br>
* **[Admin Project Fund API](#admin-project-fund-api)**</br>
* **[Admin Project Close API](#admin-project-close-api)**</br>
* **[Admin User Delete API](#admin-user-delete-api)**</br>
* **[Admin User Ban API](#admin-user-ban-api)**</br>
* **[Admin User Unban API](#admin-user-unban-api)**

## Super Admin APIs
* **[Super Admin Users API](#super-admin-users-api)**</br>
* **[Super Admin User Promote API](#super-admin-user-promote-api)**</br>
* **[Super Admin User Demote API](#super-admin-user-demote-api)**</br>
# Auth APIs
APIs discussed hear are mainly used in authentication process.

## Check Authentication API
### Introduction
This API is used to check if the user is logged in or not.
### URL
```/api/auth/check```
### Method
`GET`
### API Access
`ANY`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |

### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/auth/check", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "User is already logged in!" }```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:** ```{ status: "banned_user", message: "Access denied. You are banned!" }```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Phone Number API
### Introduction
This API is used to send phone number to server in order to receive verification code.
### URL
```/api/auth/number```
### Method
`POST`
### API Access
`ANY`
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| PhoneNumber | `string` | `true` | 09131234567

### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/auth/number", {
                method: 'POST',
                body: JSON.stringfy(
                    {
                        phoneNumber: "09131234567"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    status: "ok",
    message: "Verification code successfully sent!"
    data: { phoneNumber: "09131234567" }
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "validation_fail", message: "\"phoneNumber\" is required" }```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Verify Phone Number API
### Introduction
This API is used to verify the entered phone number with sent code.
### URL
```/api/auth/code```
### Method
`POST`
### API Access
`ANY`
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| phoneNumber | `string` | `true` | 09131234567
| code | `string` | `true` | 123456

### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/auth/number", {
                method: 'POST',
                body: JSON.stringfy(
                    {
                        phoneNumber: "09131234567",
                        code: "123456"
                    }
                )
            });
```
### Response Header
This API gives x-ver-token header if user is new and x-auth-token if user has already sign up.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
| x-ver-token | `string` | tyJhbGKglOiJIUzI1NiIsLmg |
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  { status: "need_sign_up", message: "Verification code is correct and user needs to sign up!" }
  ```
  OR
  ```
  { status: "ok", message: "Verification code is correct!" }
  ```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"phoneNumber\" is required" }
  ```
  OR
  ```
  { status: "invalid_code", message: "Invalid verification code!" }
  ```
  OR
  ```
  { status: "expired_code", message: "Verification code has been expired!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Sign Up API
### Introduction
This API is used to Sign up new users.
### URL
```/api/auth/add```
### Method
`POST`
### API Access
`ANY`
### Request Header
This API needs x-ver-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-ver-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| phoneNumber | `string` | `true` | 09131234567
| nationalCode | `string` | `true` | 1234567890
| email | `string` | `true` | pouya@gmail.com
| birthDate | `string` | `true` | 2002-07-18
| fullName | `string` | `true` | Pouya Sadat
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/auth/add", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-ver-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        phoneNumber: "09131234567",
                        nationalCode: "1234567890",
                        email: "pouya@gmail.com",
                        birthDate: "2002-07-18",
                        fullName: "Pouya Sadat"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: {
        phoneNumber": "09131234567",
        fullName": "Pouya Sadat",
        nationalCode": "1234567890",
        birthDate": "2002-07-18",
        email: "pouya@gmail.com",
    },
    message: "New user added!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"phoneNumber\" is required" }
  ```
  OR
  ```
  {
    status: "PhoneNumber_mismatch",
    message: "The phone number supplied to API doesn't match the phone number entered during verification!"
  }
  ```
  OR
  ```
  { status: "database_error", message: "phoneNumber must be unique!" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```


# User APIs
APIs discussed hear are mainly used for operation related to user.

## User Info API
### Introduction
This API is used to get info about current user.
### URL
```/api/user/```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: {
        phoneNumber: "09131234567",
        fullName: "Pouya Sadat",
        nationalCode: "1234567809",
        birthDate: "2002-04-18",
        email: "pouya@gmail.com",
        state: "Isfahan",
        city: "Isfahan,
        address: "Moshtagh street, Jeyshir street",
        bio: "Im a backend programmer with no experience",
        role: "user",
        verified: true
    },
    message: "User data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Wallet Info API
### Introduction
This API is used to get info about current user's wallet.
### URL
```/api/user/wallet```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/wallet", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: {
        balance: 1000000
    },
    message: "User's wallet data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Payment Info API
### Introduction
This API is used to get info about current user's payments.
### URL
```/api/user/payment```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/payment", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            amount: 5000000,
            status: "success",
            createdAt: "2023-05-31T12:15:29.000Z"
        },
        {
            amount: 1000000,
            status: "success",
            createdAt: "2023-05-31T12:15:29.000Z"
        }
    ],
    message: "User's payments data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Project Info API
### Introduction
This API is used to get info about current user's projects.
### URL
```/api/user/projects```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/projects", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            id: 6,
            goal: 10000000,
            category: "Game",
            investedAmount: 2000000,
            investorCount: 5,
            hasDonate: 1,
            hasToken: 1,
            status: "active",
            expirationDate: "2024-01-01T00:00:00.000Z",
            createdAt: "2023-05-31T12:24:10.000Z",
            title: "Best Game Ever"
        },
        {
            id: 7,
            goal: 1000000,
            category: "Art",
            investedAmount: 50000000,
            investorCount: 22,
            hasDonate: 1,
            hasToken: 1,
            status: "pending_payment",
            expirationDate: "2023-05-18T00:00:00.000Z",
            createdAt: "2023-05-31T12:24:10.000Z",
            title: "Monaliza"
        }
    ],
    message: "User's projects data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Investment Info API
### Introduction
This API is used to get info about current user's investments.
### URL
```/api/user/invests```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/invests", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            projectTitle: "this is a title",
            projectId: 5,
            tokenId: 1,
            price: 1000,
            count: 3
        },
        {
            projectTitle: "this is a title",
            projectId: 5,
            tokenId: 2,
            price: 2000,
            count: 10
        }
    ],
    "message": "User's investment data retrieved successfully!",
    "status": "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Donate Info API
### Introduction
This API is used to get info about current user's donates.
### URL
```/api/user/donates```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/donates", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            projectTitle: "this is a title",
            projectId: 5,
            amount: 4000102
        }
    ],
    message: "User's donates data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Comment Info API
### Introduction
This API is used to get info about current user's comments.
### URL
```/api/user/comments```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/comments", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            projectTitle: "this is a title",
            projectId: 5,
            message: "This project is great!",
            id: 1
        },
        {
            projectTitle: "Best Game Ever",
            projectId: 6,
            message: "I love to play this Game!",
            id: 2
        },
        {
            projectTitle: "Monaliza",
            projectId: 7,
            message: "This is so beautiful!",
            id: 3
        }
    ],
    message: "User's comments data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Reply Info API
### Introduction
This API is used to get info about current user's replies.
### URL
```/api/user/replies```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/replies", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            projectTitle: "this is a title",
            projectId: 5,
            replyMessage: "You are right.",
            commentMessage: "This project is great!",
            commentId: 1,
            commentUserId: 1,
            id: 1
        }
    ],
    message: "User's replies data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Liked Projects API
### Introduction
This API is used to get list of liked projects for current user.
### URL
```/api/user/liked-projects```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/liked-projects", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            projectTitle: "this is a title",
            projectId: 5,
            createdAt: "2023-06-01T05:47:38.000Z",
            id: 1
        },
        {
            projectTitle: "Best Game Ever",
            projectId: 6,
            createdAt: "2023-06-01T05:47:42.000Z",
            id: 2
        }
    ],
    message: "User's liked projects data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Disliked Projects API
### Introduction
This API is used to get list of disliked projects for current user.
### URL
```/api/user/disliked-projects```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/disliked-projects", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            projectTitle: "this is a title",
            projectId: 5,
            createdAt: "2023-06-01T05:47:38.000Z",
            id: 1
        },
        {
            projectTitle: "Best Game Ever",
            projectId: 6,
            createdAt: "2023-06-01T05:47:42.000Z",
            id: 2
        }
    ],
    message: "User's disliked projects data retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User ID Card Picture API
### Introduction
This API is used to get ID card picture of current user.
### URL
```/api/user/id-card-pic```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/id-card-pic", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** `blob`
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "missing_id_card_pic", message: "There is no ID card picture for this user!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Profile Picture API
### Introduction
This API is used to get profile picture of current user.
### URL
```/api/user/profile-pic```
### Method
`GET`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/profile-pic", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** `blob`
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "missing_profile_pic", message: "There is no profile picture for this user!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Invest API
### Introduction
This API is used to invest in a specific token from a project.
### URL
```/api/user/invest```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 1
| count | `integer` | `true` | 2
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/invest", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 1,
                        count: 2
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Token has been bought successfully!" }```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"id\" is required" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "user_not_found", message: "User not found!" }
  ```
  OR
  ```
  { status: "token_not_found", message: "Token not found!" }
  ```
  OR
  ```
  { status: "project_not_found", message: "Project not found!" }
  ```
  OR
  ```
  { status: "insufficient_balance", message: "Insufficient balance!" }
  ```
  OR
  ```
  { status: "out_of_stuck", message: "There is not enough tokens to buy!" }
  ```
  OR
  ```
  { status: "project_not_active", message: "Project is not in active status!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Donate API
### Introduction
This API is used to donate to a specific project.
### URL
```/api/user/donate```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 1
| amount | `integer` | `true` | 10000
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/donate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 1,
                        amount: 10000
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Donate completed successfully!" }```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"id\" is required" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "donate_disable", message: "Project does't have donate!" }
  ```
  OR
  ```
  { status: "user_not_found", message: "User not found!" }
  ```
  OR
  ```
  { status: "project_not_found", message: "Project not found!" }
  ```
  OR
  ```
  { status: "insufficient_balance", message: "Insufficient balance!" }
  ```
  OR
  ```
  { status: "project_not_active", message: "Project is not in active status!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Comment API
### Introduction
This API is used to comment on a specific project.
### URL
```/api/user/comment```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 1
| message | `string` | `true` | I love this game
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/comment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 1,
                        amount: "I love this game"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Comment created successfully!" }```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"id\" is required" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "database_error", message: "Example error!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Reply API
### Introduction
This API is used to reply to a specific comment.
### URL
```/api/user/reply```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 1
| message | `string` | `true` | You are right
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/reply", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 1,
                        amount: "You are right"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Reply created successfully!" }```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"id\" is required" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "database_error", message: "Example error!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Like API
### Introduction
This API is used to like a specific project or become neutral if already liked.
### URL
```/api/user/like```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 1
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/like", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 1
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  { status: "ok_liked", message: "Project liked successfully!" }
  ```
  OR
  ```
  { status: "ok_neutral", message: "Like deleted from project successfully!" }
  ```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"id\" is required" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "database_error", message: "Example error!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Dislike API
### Introduction
This API is used to dislike a specific project or become neutral if already disliked.
### URL
```/api/user/dislike```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 1
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/dislike", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 1
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  { status: "ok_disliked", message: "Project disliked successfully!" }
  ```
  OR
  ```
  { status: "ok_neutral", message: "Dislike deleted from project successfully!" }
  ```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"id\" is required" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "database_error", message: "Example error!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Edit API
### Introduction
This API is used to edit current user's info.
### URL
```/api/user/edit```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| fullName | `string` | `true` | Pouya Sadat
| email | `string` | `true` | pouya@gmail.com
| birthDate | `string` | `true` | 2002-07-18
| nationalCode | `string` | `true` | 1234567890
| state | `string` | `true` | Isfahan
| city | `string` | `true` | Isfahan
| address | `string` | `true` | Moshtagh street, Jeyshir street
| bio | `string` | `true` | Im a backend programmer with no experience
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/edit", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        fullName: "Pouya Sadat",
                        email: "pouya@gmail.com",
                        birthDate: "2002-07-18",
                        nationalCode: "1234567890",
                        state: "Isfahan",
                        city: "Isfahan",
                        address: "Moshtagh street, Jeyshir street",
                        bio: "Im a backend programmer with no experience"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "User data updated successfully!" }```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"fullName\" is required" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "database_error", message: "nationalCode must be unique!" }
  ```
  OR
  ```
  { status: "missing_id_card_pic", message: "ID card picture must be uploaded before calling this API!" }
  ```
  OR
  ```
  { status: "missing_profile_pic", message: "Profile picture must be uploaded before calling this API!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Verify API
### Introduction
This API is used to verify current user.
Note: This API should be called after that id card picture and profile picture has been uploaded using their APIs.
### URL
```/api/user/verify```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| fullName | `string` | `true` | Pouya Sadat
| email | `string` | `true` | pouya@gmail.com
| birthDate | `string` | `true` | 2002-07-18
| nationalCode | `string` | `true` | 1234567890
| state | `string` | `true` | Isfahan
| city | `string` | `true` | Isfahan
| address | `string` | `true` | Moshtagh street, Jeyshir street
| bio | `string` | `true` | Im a backend programmer with no experience
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/user/verify", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        fullName: "Pouya Sadat",
                        email: "pouya@gmail.com",
                        birthDate: "2002-07-18",
                        nationalCode: "1234567890",
                        state: "Isfahan",
                        city: "Isfahan",
                        address: "Moshtagh street, Jeyshir street",
                        bio: "Im a backend programmer with no experience"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "User data updated and completed successfully!" }```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "validation_fail", message: "\"fullName\" is required" }
  ```
  OR
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "database_error", message: "nationalCode must be unique!" }
  ```
  OR
  ```
  { status: "missing_id_card_pic", message: "ID card picture must be uploaded before calling this API!" }
  ```
  OR
  ```
  { status: "missing_profile_pic", message: "Profile picture must be uploaded before calling this API!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Upload ID Card Picture API
### Introduction
This API is used to upload ID card picture of current user.
### URL
```/api/user/upload-id-card-pic```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
var formData = new FormData();
var imageInput = document.getElementById('imageInput');
formData.append('image', imageInput.files[0]);

const res = await fetch("http://localhost:3000/api/user/upload-id-card-pic", {
                method: 'POST',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: formData
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "ID card picture uploaded successfully!" }```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "database_error", message: "Example error!" }
  ```
  OR
  ```
  { status: "upload_fail", message: "No file uploaded!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## User Upload Profile Picture API
### Introduction
This API is used to upload profile picture of current user.
### URL
```/api/user/upload-profile-pic```
### Method
`POST`
### API Access
`USER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
var formData = new FormData();
var imageInput = document.getElementById('imageInput');
formData.append('image', imageInput.files[0]);

const res = await fetch("http://localhost:3000/api/user/upload-profile-pic", {
                method: 'POST',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: formData
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Profile picture uploaded successfully!" }```
* **Code:** 400 <br/>
  **Content:**
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "database_error", message: "Example error!" }
  ```
  OR
  ```
  { status: "upload_fail", message: "No file uploaded!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```

# Admin APIs
APIs discussed hear are mainly used for operation related to admin.

## Admin Users API
### Introduction
This API is used to get list of all users.
### URL
```/api/admin/user```
### Method
`GET`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/user", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            id: 5,
            uuid: "48c80567-4cfb-40b8-b5cc-1cab54df959d",
            phoneNumber: "09961494953",
            fullName: "Pouya Akbari",
            email: "ali@gmail.com",
            verified: true,
            birthDate: "2002-04-18",
            nationalCode: "1234567899",
            state: "Isfahan",
            city: "Isfahan",
            address: "bozorgmehr, moshtagh street",
            bio: "This is information about me",
            idCardPic: "f28a675666c6b72debac326b82f22170.jpg",
            profilePic: "4c5a7f1e55253ee9f245c1e63710479c.png",
            role: "user",
            createdAt: "2023-05-28T13:26:04.000Z",
            updatedAt: "2023-05-30T12:00:34.000Z"
        },
        {
            id: 15,
            uuid: "b299ac73-9047-4651-ba07-816edde7f208",
            phoneNumber: "09133415689",
            fullName: "mahdi jelvani",
            email: "mahdi@gmail.com",
            verified: false,
            birthDate: "2002-01-18",
            nationalCode: "1234567895",
            state: null,
            city: null,
            address: null,
            bio: null,
            idCardPic: null,
            profilePic: null,
            role: "user",
            createdAt: "2023-05-30T12:31:14.000Z",
            updatedAt: "2023-05-30T12:31:14.000Z"
        }
    ],
    message: "User list retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin Projects API
### Introduction
This API is used to get list of all projects.
### URL
```/api/admin/project```
### Method
`GET`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/project", {
                method: 'GET',
                headers: {
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                }
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            id: 5,
            userId: 5,
            goal: 1000000,
            category: "Game",
            investedAmount: 4144000,
            investorCount: 12,
            hasDonate: 1,
            hasToken: 1,
            status: "active",
            expirationDate: "2023-12-01T00:00:00.000Z",
            title: "this is a title",
            subtitle: "this is a subtitle"
        },
        {
            id: 7,
            userId: 1,
            goal: 1000000,
            category: "Art",
            investedAmount: 50000000,
            investorCount: 22,
            hasDonate: 1,
            hasToken: 1,
            status: "pending_payment",
            expirationDate: "2023-05-18T00:00:00.000Z",
            title: "Monaliza",
            subtitle: "This is a painting inspired from Monaliza!"
        }
    ],
    message: "Project list retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** ```{ status: "invalid_token", message: "Invalid token!" }```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin User Search API
### Introduction
This API is used to search users.
### URL
```/api/admin/user```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| phoneNumber | `string` | `false` | 0913123
| fullName | `string` | `false` | Pouy
| email | `string` | `false` | pouya@gmai
| nationalCode | `string` | `false` | 123456
| state | `string` | `false` | Isfa
| city | `string` | `false` | Is
| address | `string` | `false` | Moshtag
| verified | `boolean` | `false` | true
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        fullName: "po",
                        nationalCode: "123"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            id: 5,
            uuid: "48c80567-4cfb-40b8-b5cc-1cab54df959d",
            phoneNumber: "09961494953",
            fullName: "Pouya Akbari",
            email: "ali@gmail.com",
            verified: true,
            birthDate: "2002-04-18",
            nationalCode: "1234567899",
            state: "Isfahan",
            city: "Isfahan",
            address: "bozorgmehr, moshtagh street",
            bio: "This is information about me",
            idCardPic: "f28a675666c6b72debac326b82f22170.jpg",
            profilePic: "4c5a7f1e55253ee9f245c1e63710479c.png",
            role: "user",
            createdAt: "2023-05-28T13:26:04.000Z",
            updatedAt: "2023-05-30T12:00:34.000Z"
        },
        {
            id: 17,
            uuid: "a35202a4-2882-402e-ba47-613ea054b5d3",
            phoneNumber: "09131234567",
            fullName: "Pouya Sadat",
            email: "pouya1@gmail.com",
            verified: false,
            birthDate: "2002-07-18",
            nationalCode: "1234567890",
            state: null,
            city: null,
            address: null,
            bio: null,
            idCardPic: null,
            profilePic: null,
            role: "user",
            createdAt: "2023-05-31T11:15:32.000Z",
            updatedAt: "2023-05-31T11:15:32.000Z"
        }
    ],
    message: "User list retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"nationalCodfe\" is not allowed" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin Project Search API
### Introduction
This API is used to search projects.
### URL
```/api/admin/project```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| title | `string` | `false` | mon
| subtitle | `string` | `false` | Pou
| userId | `string` | `false` | pouya@g
| goal | `string` | `false` | 12
| category | `string` | `false` | Is
| investedAmount | `string` | `false` | Isfa
| investorCount | `string` | `false` | Mosh
| hasDonate | `boolean` | `false` | true
| hasToken | `boolean` | `false` | false
| status | `boolean` | `false` | active
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/project", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        title: "mon"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            id: 7,
            userId: 1,
            goal: 1000000,
            category: "Art",
            investedAmount: 50000000,
            investorCount: 22,
            hasDonate: 1,
            hasToken: 1,
            status: "pending_payment",
            expirationDate: "2023-05-18T00:00:00.000Z",
            title: "Monaliza",
            subtitle: "This is a painting inspired from Monaliza!"
        }
    ],
    message: "Project list retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin Project Approve API
### Introduction
This API is used to approve a specific project.
### URL
```/api/admin/project/approve```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 5
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/project/approve", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 5
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Project approved successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
  OR
  ```
  { status: "not_found", message: "Project not found!" }
  ```
  OR
  ```
  { status: "approve_fail", message: "Project can not be approved!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin Project Delete API
### Introduction
This API is used to delete a specific project.
### URL
```/api/admin/project/delete```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 5
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/project/delete", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 5
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Project deleted successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
  OR
  ```
  { status: "not_found", message: "Project not found!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin Project Fund API
### Introduction
This API is used to fund a specific project.
### URL
```/api/admin/project/fund```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 5
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/project/fund", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 5
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Project funded successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
  OR
  ```
  { status: "not_found", message: "Project not found!" }
  ```
  OR
  ```
  { status: "fund_fail", message: "Project can not be funded!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin Project Close API
### Introduction
This API is used to close a specific project (sets the project status to done).
### URL
```/api/admin/project/close```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 5
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/project/close", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 5
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "Project delivered successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
  OR
  ```
  { status: "not_found", message: "Project not found!" }
  ```
  OR
  ```
  { status: "delivery_fail", message: "Project can not be delivered!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin User Delete API
### Introduction
This API is used to delete a specific user.
### URL
```/api/admin/user/delete```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 5
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/user/delete", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 5
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "User has been deleted successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
  OR
  ```
  { status: "not_found", message: "User not found!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin User Ban API
### Introduction
This API is used to ban a specific user.
### URL
```/api/admin/user/ban```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 5
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/user/ban", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 5
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "User has been banned successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
  OR
  ```
  { status: "not_found", message: "User not found!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Admin User Unban API
### Introduction
This API is used to unban a specific user.
### URL
```/api/admin/user/unban```
### Method
`POST`
### API Access
`ADMIN`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 5
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/admin/user/unban", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 5
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "User has been unbanned successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
  OR
  ```
  { status: "not_found", message: "User not found!" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```

# Super Admin APIs
APIs discussed hear are mainly used for operation related to super admin.

## Super Admin Users API
### Introduction
This API is used to get list of users according to their role.
### URL
```/api/super/user```
### Method
`POST`
### API Access
`SUPER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| option | `string` | `true` | 1
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/super/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        option: "2"
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:**
  ```
  {
    data: [
        {
            id: 1,
            uuid: "4987bb5c-42ac-4730-ae31-d664166cd797",
            phoneNumber: "09961494951",
            fullName: "Pouya Sadat",
            email: "pouya@gmail.com",
            verified: true,
            birthDate: "2002-07-18",
            nationalCode: "1234567879",
            state: "Isfahan",
            city: "Isfahan",
            address: "Moshtagh street, Jeyshir street",
            bio: "Im a backend programmer with no experience",
            idCardPic: null,
            profilePic: null,
            role: "admin",
            createdAt: "2023-05-28T13:21:55.000Z",
            updatedAt: "2023-05-31T14:55:10.000Z"
        },
        {
            id: 5,
            uuid: "48c80567-4cfb-40b8-b5cc-1cab54df959d",
            phoneNumber: "09961494953",
            fullName: "Pouya Akbari",
            email: "ali@gmail.com",
            verified: true,
            birthDate: "2002-04-18",
            nationalCode: "1234567899",
            state: "Isfahan",
            city: "Isfahan",
            address: "bozorgmehr, moshtagh street",
            bio: "This is information about me",
            idCardPic: "f28a675666c6b72debac326b82f22170.jpg",
            profilePic: "4c5a7f1e55253ee9f245c1e63710479c.png",
            role: "user",
            createdAt: "2023-05-28T13:26:04.000Z",
            updatedAt: "2023-05-30T12:00:34.000Z"
        }
    ],
    message: "User list retrieved successfully!",
    status: "ok"
  }
  ```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Super Admin User Promote API
### Introduction
This API is used to promote a specific user.
### URL
```/api/super/user/promote```
### Method
`POST`
### API Access
`SUPER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 1
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/super/user/promote", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 1
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "User promoted successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```
## Super Admin User Demote API
### Introduction
This API is used to demote a specific user.
### URL
```/api/super/user/demote```
### Method
`POST`
### API Access
`SUPER`
### Request Header
This API needs x-auth-token header in order to work.
| Header Name | Type | Example Value |
| ----- | ----- | ----- |
| x-auth-token | `string` | eyJhbGciOiJIUzI1NiIsInR |
### Request Parameters
| Parameter Name | Type | Required | Example Value
| ----- | ----- | ----- | ----- |
| id | `integer` | `true` | 1
### Sample Request Call
```
const res = await fetch("http://localhost:3000/api/super/user/demote", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5c"
                },
                body: JSON.stringfy(
                    {
                        id: 1
                    }
                )
            });
```
### Response
* **Code:** 200 <br/>
  **Content:** ```{ status: "ok", message: "User demoted successfully!" }```
* **Code:** 400 <br/>
  **Content:** 
  ```
  { status: "invalid_token", message: "Invalid token!" }
  ```
  OR
  ```
  { status: "validation_fail", message: "\"tile\" is not allowed" }
  ```
* **Code:** 401 <br/>
  **Content:** ```{ status: "missing_token", message: "Access denied. auth token required!" }```
* **Code:** 403 <br/>
  **Content:**
  ```
  { status: "banned_user", message: "Access denied. You are banned!" }
  ```
  OR
  ```
  { status: "access_denied", message: "Access denied. You don't have access to use this API!" }
  ```
* **Code:** 500 <br/>
  **Content:** ```{ status: "internal_error", message: "Internal error!" }```