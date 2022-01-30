/***********************************************************************************************
설명:
비동기가 들어있는 Promise가 실행된 때,
then이나 catch이 없으면 바로 fulfilled나, rejected된 상태를 유지한다.
then이나 catch가 있으면 resolve()가 reject()나 다시 호출될 때까지,
다시 말해, pending 상태가 해제될 때 까지, then과 catch시 실행될 callback 함수를 적재한다.
근데 callback은 함수가 아닌 Promise형태가 될 수 있으므로, (then안에서 Promise를 return)
만약, 적재 시에 callback들이 Promise형태면 
Promise 형태면 then을 통해 Promise안에 있는 resolve와 reject가 실행될 때까지 함수의 실행을 지연시킨다.
(Promise안에 있는 resolve가 실행될 때까지 then적재 함수의 실행을 지연시킨다.)
************************************************************************************************/

export default class CustomPromise {
    constructor(executor) {

        this.CustomPromiseState = 'pending';
        this.CustomPromiseResult = undefined;
        this.resolveFuncList = [];
        this.rejectFuncList = [];
        this.finallyFunc = null;
        executor(this.resolver, this.rejector);

    }

    //arrow function을 통해, this에 바인딩
    resolver = (value) => {
        if (this.CustomPromiseState !== "pending")
            return;

        this.CustomPromiseState = "fulfilled";
        this.CustomPromiseResult = value;
        while (this.resolveFuncList.length > 0) {
            const rtnFunc = this.resolveFuncList.shift();
            rtnFunc(this.CustomPromiseResult);
            this.CustomPromiseResult = undefined;
        }

        //state와 상관없이 finally() 수행
        if (typeof this.finallyFunc === 'function') {
            const rtnFunc = this.finallyFunc
            rtnFunc();
        }
    }

    rejector = (err) => {
        if (this.CustomPromiseState !== "pending")
            return;

        this.CustomPromiseState = "rejected";
        this.CustomPromiseResult = err;
        while (this.rejectFuncList.length > 0) {
            const rtnFunc = this.rejectFuncList.shift();
            rtnFunc(this.CustomPromiseResult);
            this.CustomPromiseResult = undefined;
        }
        
        //state와 상관없이 finally() 수행
        if (typeof this.finallyFunc === 'function') {
            const rtnFunc = this.finallyFunc
            rtnFunc();
        }
    }

    then(fulfilCallback, rejectCallback) {

        if (this.CustomPromiseState === 'fulfilled') {
            //비동기 처리가 없을 때,
            return new CustomPromise((resolve, reject) => {
                try {
                    const fulfilledFromLastPromise = fulfilCallback(this.CustomPromiseResult);
                    if (fulfilledFromLastPromise instanceof CustomPromise) {
                        fulfilledFromLastPromise.then(resolve, reject);
                    } else {
                        resolve(fulfilledFromLastPromise);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        }
        else if (this.CustomPromiseState === 'rejected') {
            //비동기 처리가 없을 때,
            return new CustomPromise((resolve, reject) => {
                try {
                    const rejectedFromLastPromise = rejectCallback(this.CustomPromiseResult);
                    if (rejectedFromLastPromise instanceof CustomPromise) {
                        rejectedFromLastPromise.then(resolve, reject);
                    } else {
                        reject(rejectedFromLastPromise);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        } else {
            //비동기 처리일 때,(pending)
            return new CustomPromise((resolve, reject) => {
                this.resolveFuncList.push(() => {
                    try {
                        const fulfilledFromLastPromise = fulfilCallback(this.CustomPromiseResult);
                        if (fulfilledFromLastPromise instanceof CustomPromise) {
                            fulfilledFromLastPromise.then(resolve, reject);
                        } else {
                            resolve(fulfilledFromLastPromise);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
                this.rejectFuncList.push(() => {
                    try {
                        const rejectedFromLastPromise = rejectCallback(this.CustomPromiseResult);
                        if (rejectedFromLastPromise instanceof CustomPromise) {
                            rejectedFromLastPromise.then(resolve, reject);
                        } else {
                            reject(rejectedFromLastPromise);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }

    }
    catch(callback) {
        console.log("add reject callbackfunc")
        return this.then(undefined, callback)
    }
    finally(callback) {
        console.log("add finally callbackfunc")
        //return this.then(() => { return callback(); });
        //return this.catch(() => { return callback(); });
        this.finallyFunc = callback;
        return this;
    }
    //정적메서드
    static resolve(values) {
        //resolve된 CustomPromise를 반환
        return new CustomPromise(resolve => resolve(values));
    }
    static reject(error) {
        //reject된 CustomPromise를 반환
        return new CustomPromise((_, reject) => { reject(error) });
    }
    static all(promises) {
        //iterable한 CustomPromise의 병렬처리
        var values = [];
        return new CustomPromise((resolve, reject) => {
            for (const p of promises) {
                p.then((result) => {
                    values.push(result);
                    //return 값이 전달받은 프로미스 수와 같을 때,
                    //(병렬로 처리된 Promise의 모든 값이 들어 왔을 때)
                    if (values.length === promises.length) {
                        resolve(values)
                    }
                },(error)=>{
                    reject(error)
                })
            }
        });
    }
}