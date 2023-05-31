# ProFund
This project is developed to help people find investors for their projects and also for people to find new projects to fund and support.

# APIs
In this part you can find information about developed APIs and how to use them properly.

# Auth APIs
APIs discussed hear are mainly used in authentication process.

## Check Authentication API
### Introduction
This API is used to check if the user is logged in or not.
### URL
```/api/auth/check```
### Method
`GET`
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
            });ّ
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
            });ّ
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
            });ّ
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
            });ّ
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
        bio: "Im a backend programmer."
    },
    message: "user data retrieved successfully!",
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
    message: "user's wallet data retrieved successfully!",
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
    message: "user's payments data retrieved successfully!",
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
    message: "user's projects data retrieved successfully!",
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
    "message": "user's investment data retrieved successfully!",
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
    message: "user's donates data retrieved successfully!",
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
    message: "user's comments data retrieved successfully!",
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
## User Invest API
### Introduction
This API is used to invest in a specific token from a project.
### URL
```/api/user/invest```
### Method
`POSt`
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
`POSt`
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
`POSt`
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