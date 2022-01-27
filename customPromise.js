class CustomPromise {

    constructor(executor) {
    
    	console.log(executor)//(resolve, reject)=>{}
    
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

    	console.log('resolve() 호출');
    		
        //then을 통해 등록된 함수가 없을 시,
        if(this.resolveFuncList.length == 0){
            this.CustomPromiseState = 'fulfilled';
            this.CustomPromiseResult = value;
        }else{          
            const rtnFunc = this.resolveFuncList.shift();
            this.resolveFunc = rtnFunc;
            this.resolveFunc(value);          
            this.CustomPromiseState = 'fulfilled';
            this.CustomPromiseResult = value;          
        }
        
        if(typeof this.finallyFunc === 'function'){
            this.finallyFunc();
            console.log('finally() 호출');
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
            this.finallyFunc();
            console.log('finally() 호출');
        }        
    }
    
    //앞으로 실행할 함수(the,catch,finally)를 적재
    then(callback){
    
        if(this.CustomPromiseState === 'fulfilled'){
            callback(this.CustomPromiseResult);
        
        }else{
        
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
        return new CustomPromise(resolve => resolve(values));
    }
    static reject(error){
        return new CustomPromise((_,reject) => { reject(error) });
    }
    
    static all(promises){

        for(const a of [1,2,3]){
            console.log(a)
            setTimeout(()=>{
              console.log(promises);
            }, 0);
        }

        //console.log(promises)
        //return new CustomPromise(resolve => resolve(values));
      }
    
    
}


/* 
const ful1 = new Promise(resolve => resolve(1));
const ful2 = new CustomPromise((resolve) => { resolve(1) });
console.log(ful1);
console.log(ful2)
ful1.then(console.log);
ful2.then(console.log); 
*/

/* 
const ful1 = new Promise((_,reject )=> { reject(new Error('Error')) });
const ful2 = new CustomPromise((_,reject) => { reject(new Error('Error')) });
console.log(ful1);
console.log(ful2);
ful1.catch(console.log);
ful2.catch(console.log); 
*/

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

//getData1();
//getDataOrgin1();

//console.log(getDataOrgin1().then(console.log));
//console.log(getData1().then(console.log))

//console.log(Promise.all([getData1(), getData2(), getData3()]));
//console.log(CustomPromise.all([getData1(), getData2(), getData3()]));





