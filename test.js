import CustomPromise from "./customPromise";

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
//reject() 비교
const rejectedPromise1 = Promise.reject(new Error('Promise Error'));
rejectedPromise1.catch(console.log)
const rejectedPromise2 = CustomPromise.reject(new Error('CustomPromise Error'));
rejectedPromise2.catch(console.log) 

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