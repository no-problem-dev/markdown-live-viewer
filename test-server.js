import { createServer } from './src/server.js';

const app = createServer({ dir: 'tests/fixtures' });

app.listen(3000, 'localhost', () => {
  console.log('Server started on http://localhost:3000');
  console.log('Document root: tests/fixtures');
});
