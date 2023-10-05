# :microphone: Talker Manager Project :microphone:

### Goals:
- Develop an API CRUD for a set of speakers.
- Develop endpoints that will read and write to a file using the fs module.

The API code was developed in the files:
-src/index.js
-src/randomToken.js
-src/validações.js

The remaining files were developed by Trybe.

### To start the project:
Clone the repository and run the commands below:
```
docker compose -d
docker exec -it talker_manager bash
npm run dev
```
### Project requirements:
| Requirement | Description |
|-----------|-----------|
| 01 | Create the GET /talker |
| 02 | Create the GET /talker/:id |
| 03 | Create the POST /login |
| 04 | Add validations for the /login |
| 05 | Create the POST /talker |
| 06 | Create the PUT endpoint /talker/:id |
| 07 | Create the DELETE /talker/:id |
| 08 | Create GET endpoint `/talker/search` and query parameter `q=searchTerm` |
| 09 | Create the query parameter `rate=rateNumber` in the GET endpoint `/talker/search` |
| 10 | Create the query parameter `date=watchedDate` in the GET endpoint `/talker/search` |
| 11 | Create the PATCH endpoint `/talker/rate/:id` |
| 12 | Create the GET endpoint `/talker/db` |
