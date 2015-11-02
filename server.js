var http = require('http');
var finalhandler = require('finalhandler');

var spawn = require('child_process').spawn;

var static = require('serve-static');

var router = require('router')();

var split = require('split');
var through2 = require('through2');

router.get('/tcpdump/*', function (req, res) {
    res.setHeader('Content-Type', 'text/event-stream');

    var cp = spawn('sudo', ['tcpdump', '-n', '-U', '-l', '-i', 'any'].concat(req.params[0].split('/')));

    var lb = split('\n');
    cp.stdout.pipe(lb);

    lb.pipe(through2.obj(function (e, _, next) {
        this.push('data: ' + e + '\n\n');
        next();
    })).pipe(res);

    res.on('close', end);
    res.on('error', end);

    function end() {
        cp.stdout.destroy();
        cp.stderr.destroy();
    }
});

router.get('/i/*', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><style>p { margin: 0; font-family: "Courier"  } </style><script>new EventSource("http://' + req.headers['host'] + '/' + req.params[0] + '").onmessage = function(e) { var x = document.createElement("p"); x.innerText = e.data; document.body.appendChild(x); window.scrollTo(0,document.body.scrollHeight); };</script>');
});

router.use(static(__dirname));

var server = http.createServer(function (req, res) {
    router(req, res, finalhandler(req, res));
}).listen(process.env.PORT || 3333);
