import { Client } from 'minio';  // Use named import for the 'Client' class
import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json({ limit: '4mb' }));

// Create MinIO client using named import
const minioClient = new Client({
  endPoint: '10.100.201.32',
  port: 9000,
  useSSL: false,              // Adjust this based on your MinIO server's SSL configuration (currently, no SSL is used)
  accessKey: 'minioadmin',    // Update to default access key
  secretKey: 'minioadmin',    // Update to default secret key
});


// Upload file using memory storage
app.post(
  '/upload',
  multer({ storage: multer.memoryStorage() }).single('upload'),
  function (request, response) {
    minioClient.putObject('test', request.file.originalname, request.file.buffer, function (error, etag) {
      if (error) {
        return console.log(error);
      }
      response.send(request.file);
    });
  }
);

// Upload file from disk storage
app.post(
  '/uploadfile',
  multer({ dest: './uploads/' }).single('upload'),
  function (request, response) {
    minioClient.fPutObject('test', request.file.originalname, request.file.path, 'application/octet-stream', function (error, etag) {
      if (error) {
        return console.log(error);
      }
      response.send(request.file);
    });
  }
);

// Download file
// Download file
app.get('/download', function (request, response) {
  const filename = request.query.filename;
  minioClient.getObject('test', filename, function (error, stream) {
    if (error) {
      return response.status(500).send(error);
    }
    // Set the content type based on the file type
    // response.set('Content-Type', 'image/jpeg'); // Change to appropriate type if different
    stream.pipe(response);
  });
});


// Check if bucket exists, then start server
minioClient.bucketExists('test', function (error) {
  if (error) {
    return console.log(error);
  }
  const server = app.listen(3000, function () {
    console.log('Listening on port %s...', server.address().port);
  });
});
