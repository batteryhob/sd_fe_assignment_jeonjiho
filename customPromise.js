class CustomPromise {

  constructor(executor) {

    this.CustomPromiseState = 'pending';
    this.CustomPromiseResult = undefined;

    this.resolveFuncList = [];
    this.resolveFunc = null;
    this.rejectFuncList = [];
    this.rejectFunc = null;
    this.finallyFunc = null;
    executor(this.resolver, this.rejector);

  }

  //arrow function을 통해, this에 바인딩
  resolver = (value) => {

    //console.log('resolve() 호출');
    //console.log(this);

    //then을 통해 등록된 함수가 없을 시,
    if (this.resolveFuncList.length == 0) {
      this.CustomPromiseState = 'fulfilled';
      this.CustomPromiseResult = value;
    } else {

      if (value instanceof CustomPromise) {

        value.then((result) => {
          this.CustomPromiseState = 'fulfilled';
          this.CustomPromiseResult = result;
          while (this.resolveFuncList.length > 0) {
            const rtnFunc = this.resolveFuncList.shift();
            this.resolveFunc = rtnFunc;
            this.resolveFunc(this.CustomPromiseResult);
            this.CustomPromiseResult = undefined;
          }
        });

      } else {

        this.CustomPromiseState = 'fulfilled';
        this.CustomPromiseResult = value;
        while (this.resolveFuncList.length > 0) {
          const rtnFunc = this.resolveFuncList.shift();
          this.resolveFunc = rtnFunc;
          this.resolveFunc(this.CustomPromiseResult);
          this.CustomPromiseResult = undefined;
        }

      }
    }

  }
  rejector = (error) => {

    //console.log('reject() 호출');
    //console.log(this);
    //catch() 구현에 실패했습니다.
    
  }

  //비동기 시 앞으로 실행할 함수(the,catch,finally)를 적재
  then(fulfilCallback, rejectCallback) {

    if (this.CustomPromiseState === 'fulfilled') {
      //callback(this.CustomPromiseResult)          
      return new CustomPromise(resolve => resolve(fulfilCallback(this.CustomPromiseResult)));
    }
    else if (this.CustomPromiseState === 'rejected') {
      //callback(this.CustomPromiseResult)          
      return new CustomPromise((_, reject) => reject(rejectCallback(this.CustomPromiseResult)));
    }
    else {
      //비동기 시, resolve call시 실행될 함수
      console.log("add resolve callbackfunc")
      //this.resolveFuncList.push(callback) 
      //return this; //함수 체이닝을 위해 this(CustomPromise) 반환
      return new CustomPromise((resolve, reject) => {
        this.resolveFuncList.push(() => resolve(fulfilCallback(this.CustomPromiseResult)));
      });
    }

  }
  catch(callback) {
    console.log("add reject callbackfunc")
    return this.then(null, callback)
    //catch() 구현에 실패했습니다.
  }
  finally(callback) {
    console.log("add finally callbackfunc")
    return this.then(() => { return callback(); });
  }

  //정적메서드
  static resolve(values) {
    //resolve된 CustomPromise를 반환
    return new CustomPromise(resolve => resolve(values));
  }
  static reject(error) {
    //reject된 CustomPromise를 반환
    return new CustomPromise((_, reject) => { reject(error) });
    //catch() 구현에 실패했습니다.
  }
  static all(promises) {
    //iterable한 CustomPromise의 병렬처리
    var values = [];
    return new CustomPromise((resolve) => {
      for (const p of promises) {
        p.then((result) => {
          values.push(result);
          //return 값이 전달받은 프로미스수와 같을 때,
          if (values.length === promises.length) {
            resolve(values)
          }
        })
      }
    });
  }

}