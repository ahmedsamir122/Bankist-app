'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


/////////////////////////////////////////////////

accounts.forEach(account => {
   account.userName = account.owner.split(' ').map(name => name[0]).join('');
});
// ------- login button ---------
let currentAccount , timer;

btnLogin.addEventListener('click', (e)=>{
  e.preventDefault();
  
  currentAccount = accounts.filter(account => {
    if(inputLoginUsername.value.toLowerCase() ===account.userName.toLowerCase() && Number(inputLoginPin.value) === account.pin){
      containerApp.style.opacity=1;
      containerMovements.innerHTML='';
      return account;
      
    }
  })[0];
  console.log(currentAccount);
  displayFunction(currentAccount);
 
  if(timer){
    clearInterval(timer);
  }
  timer = startLogOut() ;
  inputLoginUsername.value='';
  inputLoginPin.value="";
})
// -------- display function --------
const displayFunction = function(acc){
  containerMovements.innerHTML='';
  let now = new Date();
  let min = `${now.getMinutes()}`.padStart(2,'0');
  let hour = `${now.getHours()}`.padStart(2,'0');
  let day = `${now.getDate()}`.padStart(2,'0');
  let month = `${now.getMonth()}`.padStart(2,'0');
  let year = now.getFullYear();
  labelDate.textContent= `${day}/${month}/${year}, ${hour}:${min}`;

acc.movements.forEach( (move,i) => {
  let row;
   row =`<div class="movements__row">
<div class="movements__type movements__type--${move>0?'deposit':'withdrawal'}">${i+1} ${move>0?'deposit':'withdrawal'}</div>
<div class="movements__date">3 days ago</div>
<div class="movements__value">${move.toFixed(2)}€</div>
</div>`;
containerMovements.insertAdjacentHTML('afterbegin',row);
}) 
labelWelcome.textContent=`Good Afternoon, ${currentAccount.owner.split(' ')[0]}!`;
labelBalance.textContent=`${currentAccount.movements.reduce((acc,cur) => acc+cur,0).toFixed(2)} €`;
labelSumIn.textContent = `${currentAccount.movements.filter(move => move>0).reduce((acc,cur) => acc+cur,0)}€`;
labelSumOut.textContent = `${Math.abs(currentAccount.movements.filter(move => move<0).reduce((acc,cur) => acc+cur,0))}€`;
labelSumInterest.textContent=`${currentAccount.movements.map(move => move*currentAccount.interestRate/100).reduce((acc,cur) => acc+cur,0)}€`;
}
// --------- tranfer button ----------
btnTransfer.addEventListener('click',(e)=>{
  e.preventDefault();
  accounts.forEach(account => {
    let balance = currentAccount.movements.reduce((acc,cur) => acc+cur,0);
    if(account.userName.toLowerCase()===inputTransferTo.value.toLowerCase() && Number(inputTransferAmount.value) <= balance){
      account.movements.push(Number(inputTransferAmount.value)); 
      console.log(account.movements);
      currentAccount.movements.push(-Number(inputTransferAmount.value));
      displayFunction(currentAccount);
      console.log(balance);
      console.log(Number(inputTransferAmount.value) >= balance);
      if(timer){
        clearInterval(timer);
      }
      timer = startLogOut() ;
      inputTransferAmount.value='';
      inputTransferTo.value='';
    }
  })
})
// ------- loan button ---------
btnLoan.addEventListener('click',(e)=> {
  e.preventDefault();
  setTimeout(() => {
  if(currentAccount.movements.some(move => move>=0.1*Number(inputLoanAmount.value)) && inputLoanAmount.value>0)
  currentAccount.movements.push(Number(inputLoanAmount.value));
 displayFunction(currentAccount);
 if(timer){
  clearInterval(timer);
}
timer = startLogOut() ;
 inputLoanAmount.value="";},3000)
})
// -------- sort event --------
let sort = false;
btnSort.addEventListener('click', (e)=> {
  e.preventDefault();
  const moveCopy=[...currentAccount.movements] ;
  const moveCopySort=[...currentAccount.movements].sort((a,b)=> b-a) ;
  
  if(!sort){
    
    containerMovements.innerHTML='';
    moveCopySort.forEach( (move,i) => {
      let row;
       row =`<div class="movements__row">
    <div class="movements__type movements__type--${move>0?'deposit':'withdrawal'}">${i+1} ${move>0?'deposit':'withdrawal'}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${move.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin',row);
    }) 
  }
  else {
    currentAccount.movements=moveCopy.slice();
    displayFunction(currentAccount);
  }
  
  sort=!sort;
  console.log(currentAccount.movements);
})
// ------ close account ------
btnClose.addEventListener('click',(e) => {
  e.preventDefault();
  if(inputCloseUsername.value.toLowerCase()=== currentAccount.userName.toLowerCase() && currentAccount.pin===Number(inputClosePin.value)){

    const index = accounts.findIndex(acc => 
      acc.userName.toLowerCase() === inputCloseUsername.value.toLowerCase() 
       
     );
      console.log(index);
      accounts.splice(index,1);
      inputCloseUsername.value='';
      inputClosePin.value='';
      console.log(accounts);
      containerApp.style.opacity=0;
      labelWelcome.textContent='Log in to get started';
  }
})
const startLogOut = function(){
  let time=300 ;
  const tick =function(){
    const min = String(Math.trunc(time/60)).padStart(2,'0')  ;
    const sec = String(Math.trunc(time%60)).padStart(2,'0') ;
    labelTimer.textContent = `${min}:${sec}`;
    if(time === 0){
      clearInterval(timer);
      containerApp.style.opacity=0;
      labelWelcome.textContent='Log in to get started';
    }
    time--;
  }
  tick();
  return timer = setInterval(tick,1000);
};

const arr = ['ahmed', 'zaki', 'noha'];
let test = [];
arr.forEach(word => {
 const big = word[0].toUpperCase()+word.slice(1);
  console.log(word);
  console.log(big);
  test.push(big);
})
console.log(test);
arr.join('');
console.log(test.join('\n'))
