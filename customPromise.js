class CustomPromise {

  constructor(executor) {
  
    this.CustomPromiseState = 'pending';
    this.CustomPromiseResult = undefined;
    
    this.resolveFuncList = [];
    this.resolveFunc = null;
    this.rejectFunc = null;
    this.finallyFunc = null;
    executor(this.resolver, this.rejector);
      
  }
  
  //arrow function을 통해, this에 바인딩
  resolver = (value) => {
      console.log('resolve()호출');
      
      //then을 통해 등록된 함수가 없을 시,
      if(this.resolveFuncList.length == 0){
          this.CustomPromiseState = 'fulfilled';
          this.CustomPromiseResult = value;
      }else{
      
          this.CustomPromiseState = 'fulfilled';
          this.CustomPromiseResult = value;
          while(this.resolveFuncList.length > 0){
            const rtnFunc = this.resolveFuncList.shift();
            this.resolveFunc = rtnFunc;
            this.resolveFunc(this.CustomPromiseResult);
            this.CustomPromiseResult = undefined;
          }          

      }
      
      if(typeof this.finallyFunc === 'function'){
          console.log('finally() 호출');
          this.finallyFunc();            
      }
      
  }
  rejector = (error) => {

    console.log('reject() 호출');
      
      //catch를 통해 등록된 함수가 없을 시,
      if(this.rejectFunc === null){          
          this.CustomPromiseState = 'rejected';
          this.CustomPromiseResult = error;
      }else{
          this.rejectFunc(error);
          this.CustomPromiseState = 'rejected';
          this.CustomPromiseResult = error;
      }
      
      if(typeof this.finallyFunc === 'function'){
          console.log('finally() 호출');
          this.finallyFunc();
      }        
  }
  
  //비동기 시 앞으로 실행할 함수(the,catch,finally)를 적재
  then(callback){
      console.log('then')
      
      if(this.CustomPromiseState === 'fulfilled'){
          callback(this.CustomPromiseResult)
          
      }else{
          //비동기 시, resolve call시 실행될 함수
          console.log("add resolve callbackfunc")
          console.log(callback)
          this.resolveFuncList.push(callback);
          return this; //함수 체이닝을 위해 this(CustomPromise) 반환
      
      }
    
  }
  catch(callback){
  
      if(this.CustomPromiseState === 'rejected'){
          callback(this.CustomPromiseResult);
      
      }else{
          //비동기 시, reject call시 실행될 함수
          console.log("add reject callbackfunc")
          this.rejectFunc = callback;
          return this; //함수 체이닝을 위해 this(CustomPromise) 반환
      
      }
    
  }
  finally(callback){

      console.log("add finally callbackfunc")
      this.finallyFunc = callback;
      return this; //항상 CustomPromise를 반환

  }
  
  //정적메서드
  static resolve(values){
      //resolve된 CustomPromise를 반환
      return new CustomPromise(resolve => resolve(values));
  }
  static reject(error){
      //reject된 CustomPromise를 반환
      return new CustomPromise((_,reject) => { reject(error) });
  }    
  static all(promises){
      //iterable한 CustomPromise의 병렬처리
      var values = [];
      return new CustomPromise((resolve, reject) => {
        for(const p of promises){
          p.then((result)=>{
            values.push(result);
            //return 값이 전달받은 프로미스수와 같을 때,
            if(values.length === promises.length){
              resolve(values)
            }
          }).catch((error)=>{
            reject(error)
          })
        }
      });
      
   }    
  
}


//형태비교
//const ful1 = new Promise(resolve => resolve(1))
//const ful2 = new CustomPromise(resolve => resolve(1))
//console.log(ful1);
//console.log(ful2);
//ful1.then(console.log);
//ful2.then(console.log);

/* const getDataOrgin1 = () => {
  return new Promise(resolve =>  
    setTimeout(() => {
      resolve(1);
    }, 3000)    
  );
}
getDataOrgin1().then((result)=>{
  console.log("첫번째,", result)
}).then((result)=>{
  console.log("두번째,", result)
}); */

//then체이닝
const ful3 = () => {
return new CustomPromise(resolve =>  
  setTimeout(() => {
    resolve(1);
  }, 3000)    
);
}
const ful4 = () => {
return new CustomPromise(resolve =>  
  setTimeout(() =>{
    resolve(2);
  }, 2000)    
);
}

console.log(ful3().then((result)=>{
  console.log("첫번째,", result)
  return ful4();
}).then((result)=>{
  console.log("두번째,", result)
}));

//then 체이닝 비교
//const ful1 = new Promise(resolve => resolve(1)).then(console.log).then(console.log).then(console.log).then(console.log);
//const ful2 = new CustomPromise((resolve) => { resolve(1) }).then(console.log).then(console.log).then(console.log);

//console.log(ful2)
//ful2.then(console.log);



//ful2.then((result)=>{
//  console.log(result)
//  return new CustomPromise((resolve) => { resolve(1) });
//}).then(console.log);




/* const ful1 = new Promise((_,reject )=> { reject(new Error('Error')) });
const ful2 = new CustomPromise((_,reject) => { reject(new Error('Error')) });
console.log(ful1);
console.log(ful2);
ful1.catch(console.log);
ful2.catch(console.log); */ 


/* 
const resolvedPromise1 = Promise.resolve([1,2,3]);
resolvedPromise1.then(console.log)
const resolvedPromise2 = CustomPromise.resolve([1,2,3]);
resolvedPromise2.then(console.log) 
*/

/* 
const rejectedPromise1 = Promise.reject(new Error('Error'));
rejectedPromise1.catch(console.log)
const rejectedPromise2 = CustomPromise.reject(new Error('Error'));
rejectedPromise2.catch(console.log) 
*/





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

const getError1 = () => {
return new CustomPromise((_,reject) =>  
  setTimeout(() => {
    reject(new Error('Error'));
  }, 3000)    
);
}
const getError2 = () => {
return new CustomPromise((_,reject) =>  
  setTimeout(() =>{
    reject(new Error('Error'));
  }, 2000)    
);
}
const getError3 = () => {
return new CustomPromise((_,reject) =>  
  setTimeout(() =>{
    reject(new Error('Error'));
  }, 1000)    
);
}


//getData1();
//getDataOrgin1();

//console.log(getDataOrgin1().then(console.log));
//console.log(getData1().then(console.log))

//console.log(Promise.all([getData1(), getData2(), getData3()]));
/*  Promise.all([getError1(), getError2(), getError3()])
.then(console.log)
.catch(console.log)
.finally(()=>{
console.log('done');
})
*/

/* CustomPromise.all([getData1(), getData2(), getData3()])
.then(console.log)
.catch(console.log)
.finally(()=>{
console.log('done');
}) */

/* CustomPromise.all([getError1(), getError2(), getError3()])
.then(console.log)
.catch(console.log)
.finally(()=>{
console.log('done');
}) */





