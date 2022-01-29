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
  
  //형태비교
  const ful1 = new Promise(resolve => resolve(1))
  const ful2 = new CustomPromise(resolve => resolve(1))
  console.log(ful1);
  console.log(ful2);
  ful1.then(console.log);
  ful2.then(console.log);
  
  //then체이닝
  const ful3 = () => {
    return new Promise(resolve =>  
      setTimeout(() => {
        resolve(1);
      }, 3000)    
    );
  }
  const ful4 = () => {
    return new CustomPromise(resolve =>  
      setTimeout(() =>{
        resolve(1);
      }, 3000)    
    );
  }
  const ful5 = () => {
    return new CustomPromise((resolve) =>  
      setTimeout(() =>{
        resolve(1);
      }, 3000)    
    );
  }
  
  ful3().then((result)=>{
    console.log("첫번째,", result)
  }).then((result)=>{
    console.log("두번째,", result)
  }).finally(()=>{
    console.log("Done");
  });
  
  ful4().then((result)=>{
    console.log("첫번째,", result)
    return ful5();
  }).then((result)=>{
    console.log("두번째,", result)
    return ful5();
  }).finally(()=>{
    console.log("Done");
  });
  
  //resolve() 비교
  const resolvedPromise1 = Promise.resolve([1,2,3]);
  resolvedPromise1.then(console.log)
  const resolvedPromise2 = CustomPromise.resolve([1,2,3]);
  resolvedPromise2.then(console.log) 
  
  
  const getDataOrgin1 = () => {
  return new Promise(resolve =>  
    setTimeout(() => {
      resolve(1);
    }, 3000)    
  );
  }
  const getDataOrgin2 = () => {
  return new Promise(resolve =>  
    setTimeout(() => {
      resolve(2);
    }, 2000)    
  );
  }
  const getDataOrgin3 = () => {
  return new Promise(resolve =>    
    setTimeout(() => {
      resolve(3);
    }, 1000)    
  );
  }
  
  const getData1 = () => {
  return new CustomPromise(resolve =>  
    setTimeout(() => {
      resolve(1);
    }, 3000)    
  );
  }
  const getData2 = () => {
  return new CustomPromise(resolve =>  
    setTimeout(() =>{
      resolve(2);
    }, 2000)    
  );
  }
  const getData3 = () => {
  return new CustomPromise(resolve =>  
    setTimeout(() =>{
      resolve(3);
    }, 1000)    
  );
  }
  
  //all() 비교
  Promise.all([getDataOrgin1(), getDataOrgin2(), getDataOrgin3()])
  .then(console.log)
  .finally(()=>{
    console.log('Promise done');
  })
  CustomPromise.all([getData1(), getData2(), getData3()])
  .then(console.log)
  .finally(()=>{
    console.log('CustomPromise done');
  })