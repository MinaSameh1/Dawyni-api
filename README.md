# finalproject-api

This api is hosted on `https://finalproject-pis.herokuapp.com`

## First steps

```bash
npm i
npm run build
npm start
```

_if intending to work on it run `npm run prepare`_

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
| 201         | Created                                           |
| 400         | Bad Request                                       |
| 401         | Unauthorized Access                               |
| 403         | Must Log in or refresh token expired! (Re login)  |
| 500         | Something went wrong server side (Rarely Happens) |

#### Method Put

| Status code | description |
| ----------- | ----------- |
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
