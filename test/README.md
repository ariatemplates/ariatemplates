#Testing Aria Templates

Aria Templates comes with its own testing environment. This allows you to unit test any Aria Templates class, including Templates.

## Set up the environment

Testing is too often considered as a waste of time, for this reason we include a stand-alone web server already configured to serve both minified and packaged files.

The only thing you have to do is

    npm start

This will start an [express](http://expressjs.com/) server on port `8080`.

With any browser go to `http://localhost:8080` and start testing.

If port `8080` is already in use you can change it running

    npm config set ariatemplates:port 9090
    npm start

The server will now be listening on port `9090`.