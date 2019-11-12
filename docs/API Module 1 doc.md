# Common Guidelines 

### Request Headers

> Every request (except Signup & Login) must carry these headers. 

```
  X-Access-Token
```

### Response Headers 
> Every response must carry these headers. 

```Javascript
X-API-Version   // Current API Version
X-API-Delay     // Total time taken to complete the request
```

### Success Response
> Valid _only_ for responses with no data
> In all API which are creating new record after sending requrest
 please send record id with success report. It will reduce a server call to get profile
 related data, we will set this record id with inserted data in our object
 
```
200
{
  "success": true, 
}
```

### Error Response for valid data 

> Valid _only_ for responses for error - non_field_errors

```
401
  {
    "items":{
             "non_field_errors":["Unable to log in with provided credentials."]
	    },
    "message":"Unable to login"
 }
```


### Error Response for valid data 

> Valid _only_ for responses for error - non_field_errors

```
401
  {
    "items":{
             "non_field_errors":["Unable to log in with provided credentials."]
	    },
    "message":"Unable to login"
 }
```

### Error Response for invalid data 

> Valid _only_ for responses for error - field_errors
 
```
401
{
 "items":{
         "company":["Company already exist"],
         "email":["This field must be unique."]
	},
  "message":"Unable to create user"
}
```
# Modules

## 1. Signup 

### Signup 

> Mandatory Field :- fullName, email, password
> If email id already exist return error response     

```
POST /signup 
{
    "fullName":"John Smith", 
    "country": "<countryId>",      
	  "state": "<stateId>", 
	  "contactNumber":"+91-9630885955",
    "email":"john.smith@gmail.com",
    "password":"john@123@"
}

200
{
  "success": true,
  "message":"Sign up successfull"

}
```

### Signup mail resend 

```
POST /signup/resendMail
{
    "emailId":"virendra.patidar@47billion.com"
}

200
{
  "success": true
}
```

### Signup mail confirmation 

```
POST /signup/emailIdConfirm
{
    "token":"AmPPWnbhaYj1fP2K58ve2hepDWUtmeJqOglkDflNxf2UFS7HFJjnbz23ktkdhQ78",
}

200
{
  "success": true
}
```

## 2. Login

### Login 
> 

```
POST /login 
{
    "emailId":"demo@demo.com",
    "password": "Demo!234"
	
}

200
{
  "jwt": {
    "access": "<sccess-token>",
    "refresh": "<refresh-token>"   
  },
  "firstLogin":true,
  "user": {
	"userId": 123
    "fullName": "john.smith@gmail.com",
    "contactNumber": "+91-9630885955",
	"country":{"name": "Japan", "code": "AX","id":3,"dialingCode":81},
	"state":{ "id":1,"code":"AP","name":"Andhra Pradesh","countryCode":"IN"}...
  }
}
```

## 3. Forgot Password

### Forgot Password 

```
POST /password/forgot
{
    "emailId":"john.smith@gmail.com"
}

200
{
  "success": true
}
```

### Reset Password 

```
POST /password/reset
{
    "token":"AmPPWnbhaYj1fP2K58ve2hepDWUtmeJqOglkDflNxf2UFS7HFJjnbz23ktkdhQ78",
    "password":"Test!23"
}

200
{
  "success": true
}
```


## 4. Common API

### Fetch Country List
> Fetch country list. 

```
GET /countryList

200
{
  [ 
	{"name": "Afghanistan", "code": "AF","id":1,"dialingCode":93}, 
	{"name": "India", "code": "IN","id":2,"dialingCode":91},
	{"name": "Japan", "code": "AX","id":3,"dialingCode":81}
 ]
}

```

### Fetch Province/State List
> countryCode  :- State list according to countryCode

```
GET /stateList/<countryCode>

200
{
  [
      { 
		  "id":1,
          "code":"AP",
          "name":"Andhra Pradesh",
		  "countryCode":"IN"
      },
	  { 
		  "id":2,
          "code":"AR",
          "name":"Arunachal Pradesh",
		  "countryCode":"IN"
      }
  ]
}

```
