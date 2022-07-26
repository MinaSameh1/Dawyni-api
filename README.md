# Dawyni-api

This api *was* hosted on `https://finalproject-pis.herokuapp.com`

The Client: `https://github.com/mahmoud947/smart_pharmacy`

![Diagram for api](https://github.com/MinaSameh1/Dawyni-api/blob/main/api_dig.jpg)

## First steps

```bash
npm i
npm run build
npm start
```

Postman file is included under `test` directory containing endpoints and their body, a bearer token from firebase client side sign in is required for protected routes, you can put the token in the authroization tap under the folder in postman for easy usage.

_if intending to work on it run `npm run prepare`_

_Some routes are included as testing and easy access._

The database used is from https://www.fda.gov/drugs/drug-approvals-and-databases/drugsfda-data-files      
Download it and put it in db_backup and run the python script 

I used python to model and add data.
## API Endpoints

| Endpoint     | method | brief description                    |
| ------------ | ------ | ------------------------------------ |
| /healthcheck | get    | Checks if api is working returns 200 |

### Responses:

#### Method Get

| Status code | description                              |
| ----------- | ---------------------------------------- |
| 200         | Success                                  |
| 204         | Success but no data to return.           |
| 401         | Unauthorized Access                      |
| 403         | Must Log in or token expired! (Re login) |

#### Method Post

| Status code | description                                       |
| ----------- | ------------------------------------------------- |
| 200         | Created                                           |
| 400         | Bad Request                                       |
| 401         | Unauthorized Access or bad token                  |
| 404         | Not found                                         |
| 500         | Something went wrong server side (Rarely Happens) |

#### Method Put

| Status code | description |
| ----------- | ----------- |
| 200         | Finished    |
| 405         | Not allowed |

#### Method Delete

| Status code | description                                      |
| ----------- | ------------------------------------------------ |
| 200         | Success                                          |
| 204         | Success but no data to return.                   |
| 403         | Must Log in or refresh token expired! (Re login) |

#### 4xx and 5xx Responses Attributes

| Attribute | Datatype | description              |
| --------- | -------- | ------------------------ |
| message   | String   | Error on what went wrong |

**ANY 5XX Code WILL NOT return the error, only `internal server error`, the error is logged server side.**
