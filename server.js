var http = require('http'),
    fs = require('fs');


http.createServer(function (request, response) {

    fs.readFile('./index.html', function (err, html) {
        if (err) {
            console.log(err);
        }

        response.writeHeader(200, {
            "Content-Type": "text/html"
        });
        response.write(html);


        response.end();
    });

}).listen(8080);
console.log("Server started on port: 8080");