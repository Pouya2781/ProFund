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
        birthDate": "2002-07-18"
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
