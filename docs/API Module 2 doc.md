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

## 1. On Boarding 

### Fetch Cloud Provider 

> Returns a list of all current cloud providers 

```
GET /cloudProviders 

200
{
  "cloudProvider" :[
      {
        "id":1,
        "name":"Amazor Web Server",
        "logo":"<httpLogoUrl>"
      },
      {
        "id":2,
        "name":"Microsoft Azure",
        "logo":"<httpLogoUrl>"
      },
      {
        "id":3,
        "name":"Google cloud",
        "logo":"<httpLogoUrl>"
        
      }
  ]
}
```

## 2. Dashboard

### Fetch Dashboard count 

> Post request that accepts optional filter parameters as(account_id & cloud('aws’, 'azure’, ‘google’))
And returns the count for dashboard different section 

 > **TODO**: API change - date 13-AUg-2017
  1.Need response security issue breakdown data in response.
  2.Missing count attribute in "total_accounts" section as per UI
  3.In "total_assets" name attribute should not be blanck.
  4.Also need "Security Audit History" data in response or provide a new API for that.
  5.Also need "Network Diagram" data in response or provide a new API for that.
  6.Also need "Security Alert" data in response or provide a new API for that.


```
POST /dashboard/count/
{
  "account": "string",
  "page": 0,
  "cloud": "string"
} 

200
{
  "message": "Dashboard count listing",
  "data": [
    {
      "section": "security_issue",
      "count": 0,
      "data": [
        {
          "FAIL": 0,
          "ERROR": 0,
          "PASS": 0
        }
      ]
    },
    {
      "section": "total_accounts",
      "count": 2,
      "data": [
        {
          "id": "AccountCredentials/3693251",
          "cloud": "aws",
          "name": "hi"
        }...
      ]
    },
    {
      "section": "total_assets",
      "count": 10,
      "data": [
        {
          "instance_id": "i-0b71928a12efd5d61",
          "state": "stopped",
          "name": []
        }...
      ]
    },
    {
      "section": "security_groups",
      "count": 10,
      "data": [
        {
          "name": "default",
          "vpc": "vpc-262ffc4e"
        }...
      ]
    },
    {
      "section": "external_ips",
      "count": 5,
      "data": [
        {
          "public_ip": "35.172.85.154"
        }...
      ]
    }
  ],
  "success": true
}
```


## 3. Constant 

### Fetch Constant 

> API View that receives a Get request. and returns all constants variable used in application.
>  **TODO**: Need a flag to identify login user run default policy or not
```
GET /constants/
 

200
{
  "message": "Constant variables listing",
  "data": {
    "account_id": "106512308171"
  },
  "success": true
}
```