import { DataSource } from 'typeorm'

const DatabaseService = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: [
    // ....
  ]
});

export default DatabaseService;
