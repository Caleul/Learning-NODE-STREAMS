const stdin = process.stdin;
const stdout = process.stdout;

stdin.on('data', msg => {
  console.log('Entrada via terminal:', msg.toString());
});

stdin.pipe(stdout);

process.on('exist', msg => {
    console.log('Saída via terminal:', msg.toString());
});