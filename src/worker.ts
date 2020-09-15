
const getArg = (index: number): string => process.argv[index].split('=')[1];

const minMsTick = 1000 / parseInt(getArg(2));

let loop = true;
let tick = 0;
let lastDateTimeTick = Date.now();
let lastExcessMs = 0;

while (loop) {
    const currentDateTime = Date.now();
    const currentMs = currentDateTime - lastDateTimeTick;
    if(minMsTick - 1 - lastExcessMs >= currentMs) continue;

    process.send({
        tick,
        ms: currentMs,
        dateTime: currentDateTime
    });

    tick++;
    lastExcessMs = currentMs - minMsTick + lastExcessMs;
    lastDateTimeTick = Date.now();
}
