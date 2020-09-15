import {ChildProcess, fork} from "child_process";
import {EventEmitter} from "events";

export type EventTypeNames = 'tick';

export type TickType = {
    tick: number;
    ms: number;
    dateTime: number;
}

export type LoopWorkerOptions = {
    ticksPerSecond: number
}

const initialLoopWorkerOptions = {
    ticksPerSecond: 20
}

export class LoopWorker extends EventEmitter {

    private readonly _forkChild: ChildProcess;

    constructor(
        options: LoopWorkerOptions = initialLoopWorkerOptions
    ) {
        super();

        this._forkChild = fork(
            '', {
                execArgv: [
                    './dist/worker.js',
                    ...Object
                    .keys(options)
                    .reduce((obj, key) => ([
                        ...obj,
                        `${key}=${options[key]}`
                    ]), [])]
        });
        this._forkChild.on('message', (data: TickType) => this.emit('tick', data));
    }

    on(event: EventTypeNames, listener: (data: TickType) => void): this {
        return super.on(event, listener);
    }

    terminate() {
        this._forkChild.kill();
    }

}