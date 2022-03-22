/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import * as randomstring from 'randomstring';

const url = 'mongodb://mongoadmin:s0ulnr00l@127.0.0.1:27018';
const client = new MongoClient(url);
const dbName = 'soulnroll';

let collection;

const connectToDatabase = async () => {
  await client.connect();
  console.log('Connected to Database Server');
  const db = client.db(dbName);
  collection = db.collection('urls');
};

connectToDatabase()
  .then(console.log)
  .catch((e) => console.error(e));
// .finally(() => client.close());

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to soulnroll!' });
});

app.post('/api/shortUrl', async (req: Request, res: Response) => {
  const randomString = randomstring.generate(6);
  const newLink = {
    id: randomString,
    url: `http://localhost:3333/api/${randomString}`,
  };

  const insertResult = await collection.insert(newLink);
  return res.json({ ...insertResult, result: newLink });
});

// here :id is called as path parameter
app.get('/api/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const findResult = await collection.findOne({ id });

  if (findResult) {
    return res.redirect(
      'https://www.youtube.com/watch?v=1y_RbcJ0eKk&list=PLpc_YvcwbxaRJYIH6SpbrueufdXT5xu0V&index=17'
    );
  } else {
    return res.send('Nothing Here');
  }
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
