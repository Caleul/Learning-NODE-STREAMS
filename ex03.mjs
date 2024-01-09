import { pipeline, Readable, Writable, Transform } from 'stream'
import { promisify } from 'util'
import { createWriteStream } from 'fs'

const pipelineAsync = promisify(pipeline)

// No JavaScript posso usar chaves apenas para separar o escopo
{
    console.log('Inicio escopo 01')

    const readableStream = Readable({
        read: function () {
            this.push("Helo 01\n")
            this.push("Helo 02\n")
            this.push("Helo 03\n")
            this.push(null)
            // o null é paramêtro para dizer que acabou a leitura (espaço em branco, quebra de linha ou qualquer outro semelhante são caracteres especiais, não nulos)
        }
    })

    const writableStream = Writable({
        write (chunk, enconding, cb) {
            console.log('msg', chunk.toString())
            cb();
        }
    })

    await pipelineAsync(
        readableStream,
        // process.stdout
        writableStream
    )
    console.log('Fim escopo 01')
}


{
    console.log('Inicio escopo 02')


    const readableStream = Readable({
        read ( ) {
            for (let index = 0; index < 1e5; index++) {
                // 1e5 = 100000 
                // O e indica a quantidade de zeros que existem, então o valor é 1 + 5 zeros (e5) = 100000
                const person = {id: Date.now() + index, name: `Caleul-${index}`}
                const data = JSON.stringify(person)
                this.push(data)
            }
            this.push(null)
        }
    })

    const writableMapToCSV = Transform({
        transform ( chunk, enconding, cb ) {
            const data = JSON.parse(chunk)
            const result = `${data.id}, ${data.name.toUpperCase()}\n`
            cb(null, result)
        }
    })

    const setHeader = Transform({
        transform ( chunk, enconding, cb ) {
            this.counter = this.counter ?? 0
            // O operador ?? verifica a existência do this.counter, caso ele exista receberá ele mesmo, caso contrário receberá 0

            if ( this.counter ) {
                // se this.counte == 0 -> o interpretador diz como null
                // se this.counte < 0 -> o interpretador diz como true
                return cb(null, chunk)
            }

            this.counter += 1

            cb(null, "id,name\n".concat(chunk))
        }
    })

    await pipelineAsync(
        readableStream,
        writableMapToCSV,
        setHeader,
        createWriteStream("my.csv")
    )

    console.log('Fim escopo 02')
}