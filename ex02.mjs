import http from 'http'
import { readFileSync, createReadStream } from 'fs'


// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file
// Esse código irá criar um arquivo de praticamente 1gb
http.createServer((req, res) => {
    createReadStream("big.file")
        .pipe(res)

}).listen(3000, () => console.log('running at 3000'))