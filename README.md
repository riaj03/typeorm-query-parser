# Typeorm query-parser
---

### Installation:
- Clone this repo
- Replace `query-parser.ts` file into your project
### Useages:

- Import `query-parser` where you want to use
   ```
   import {QueryParser} from 'PATH/query-parser/query-parser';

   
   const query = await new QueryParser().parse(req);

   const users = await this.users.findAndCount(query);

   ```
- Add query in url 
   - examples: 

    Paging: http://localhost/api/users?query={"limit": 10, "offset": 1}

    Conditions: http://localhost/api/users?query={"where":  {"id": 1}}
- Use all of `typeorm query-builder operators` - https://typeorm.io/#/find-options  