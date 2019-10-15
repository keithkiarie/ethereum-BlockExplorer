var http = require('http'), //for transferring data over http
    fs = require('fs'); //file system


http.createServer(function (request, response) {

    //read the index.html file
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            console.log(err);
        }

        //respond with the contents of 'index.html' file
        response.writeHeader(200, {
            "Content-Type": "text/html"
        });
        response.write(html);


        response.end();
    });

}).listen(8080);
console.log("Server started on port: 8080");