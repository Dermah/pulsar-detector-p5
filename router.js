// Web server and communication requires
let http = require('http');
let Express = require('express');

class Router {
  constructor (config) {
    let {
      port,
      module
    } = config;

    var app = Express();
    this.server = http.Server(app);

    this.server.listen(port, () => {
      console.log(`PULSAR-p5: listening on *:${port}`);
    });

    var nextId = 0;
    var totalCols = config.totalCols;
    var totalRows = config.totalRows;

    // What to do when a client connects to the server
    app.get(`/`, (req, res) => {

      // Default configuration variables for client
      var config = {
        id: nextId,
        totalCols: totalCols,
        totalRows: totalRows,
        col: (nextId % totalCols) + 1,
        row: Math.floor(nextId/totalCols) + 1
      };

      // If the client has not specified where it is in the grid,
      // redirect to place it as the next in the grid
      // Otherwise, honour the request for the specified column and row
      if (!req.query.col || !req.query.row) {
        res.redirect(302, `/?col=` + config.col + "&row=" + config.row);
        console.log("PULSAR-p5: Sent redirect to col: " + config.col + " row: " + config.row);
        nextId++;
      } else {
        config.col = parseInt(req.query.col);
        config.row = parseInt(req.query.row);

        // Serve the html page, injecting configuration for pulsar.js to use
        res.send(`<!DOCTYPE html>
  <html>
    <head>
      <title>Pulsar</title>
      <link rel="stylesheet" type="text/css" href="/normalize.css">
      <style media="screen" type="text/css">
        html, body {
          margin: 0;
          overflow: hidden;
        }
        *, *:before, *:after {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
      </style>
      <script>
        var pulsarInitConfig = ${JSON.stringify(config)};
      </script>
    </head>
    <body>
      <div id="react-target">
      </div>
      <script src="/index.js"></script>
    </body>
  </html>
  `)

        console.log("PULSAR-p5: Sent PULSAR to : " + config.col + " row: " + config.row);
      }
    });

    app.get(`/index.js`, function(req, res){
      res.sendFile(require.resolve('./lib/index.js'));
    });

    app.get(`/normalize.css`, (req, res) =>
      res.sendFile(require.resolve('normalize-css/normalize.css'))
    );

    app.get('/astronaut.gif', function(req, res){
      res.sendFile('/astronaut.gif', {root: "./"});
    });
  }
}

module.exports = Router;
