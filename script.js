'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Ishraque S',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // /////////////////////
  const moves = sort
    ? movements.slice().sort(function (a, b) {
        return a - b;
      })
    : movements;
  // ///////////////////
  moves.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    // const date = new Date(accounts.movementsDates[0]);
    // const day = `${date.getDate()}`.padStart(2, '0');
    // const month = `${date.getMonth() + 1}`.padStart(2, '0');
    // const year = date.getFullYear();

    // const displayDate = `${day}/${month}/${year}, ${hour}:${min}`;
    // console.log(movement);
    // console.log(i);
    // console.log(type);
    const html = `
           <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       
          <div class="movements__value">${movement} €</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// Dates
const now = new Date();
const option = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  months: 'long',
  year: 'numeric',
  weekday: 'long',
};
// labelDate.textContent =;
const times = function () {
  return new Intl.DateTimeFormat('en-US', option).format(now);
};
const currentTime = times();
console.log(currentTime);
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

////////////////////////////////////////////
const createUserName = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUserName(accounts);
const updateUI = function (currentAccount) {
  // TODO:Displaying movements
  displayMovements(currentAccount.movements);
  // TODO:Displaying balance
  calcDisplayBalance(currentAccount);
  // TODO:Displaying Summery
  calcDisplaySummery(currentAccount);
};
// TODO:User login event start (On click)
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputLoginUsername.value == '' || inputLoginPin.value == '') {
    // TODO: Display the empty field message
    console.log('Fill the field');
    return false;
  }
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  if (
    currentAccount?.username === inputLoginUsername.value &&
    currentAccount?.pin === +inputLoginPin.value
  ) {
    // TODO:Display the Login success message
    console.log('LogIn Successful');
    // TODO:Displaying the UI and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //TODO: UPDATE UI
    updateUI(currentAccount); //functionCAll
    // TODO:Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    // TODO:Display the Login failure message
    console.log('LogIn Failed');
  }
  console.log(currentAccount);
});
console.log(accounts);
// TODO:Transfer event handler
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  console.log(receiverAccount, amount);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    console.log('Transfer Successful!');
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    //TODO: UPDATE UI
    updateUI(currentAccount); //functionCAll
  } else {
    console.log('Transfer Failed!');
  }
  // time function
  // currentAccount.movement.labelDate.textContent = times();
  console.log(times);
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  console.log(`Loan ${amount}`);
  // Conditions
  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    // add a positive movement
    currentAccount.movements.push(amount);
    // update the UI
    updateUI(currentAccount);
  }
});
// TODO:Displaying Summery
const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  // console.log(check);
  labelSumIn.textContent = `${incomes} €`;

  // TODO:Displaying OUT

  const outCome = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  console.log(Math.abs(outCome));
  labelSumOut.textContent = `${Math.abs(outCome)} €`;
  // TODO:Displaying interestRate
  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * acc.interestRate) / 100;
    })
    .filter(function (int, i, arr) {
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);
  console.log(interest);
  labelSumInterest.textContent = `${interest} €`;
};
// TODO: Close btn event handel
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Delete');
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    console.log('Same');
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    }); //the result is index = 0;
    console.log(index);
    accounts.splice(index, 1);
    console.log(accounts);
    containerApp.style.opacity = 0;
  } else {
    // Error handel
    return false;
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Fill array
const z = [1, 2, 3, 4, 5, 6, 7, 8];
const x = new Array(7);
console.log(x);
x.fill(1, 3, 5);
console.log(x);
z.fill(23, 2, 6);
console.log(z);
const y = Array.from({ length: 7 }, function (_, i) {
  return i + 1;
});
console.log(y);
const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
console.log(movementsUI);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// TODO LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// console.log(arr[3]);
// console.log(arr.slice(2));
// console.log(arr.slice(-1));
// console.log(arr.slice());
// const spreedingArray = [...arr];
// console.log(spreedingArray);
// // Splice
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// // Reverse
// arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// const arr2 = ['f', 'e', 'd', 'c', 'b', 'a'];
// console.log(arr2);
// console.log(arr2.reverse());
// // Concat
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log(...arr, ...arr2);
// // join
// console.log(letters.join(' - '));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('----------ForEach------------');
// // ForEach
// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// console.log('-------------');
// // ForEach on maps

// currencies.forEach(function (value, key, map) {
//   console.log(`${value} `);
// });
// // Sets
// const currenciesUnique = new Set([
//   'USS',
//   'USD',
//   'Gpb',
//   'EUR',
//   'TK',
//   'Gpb',
//   'TK',
// ]);
// console.log([currenciesUnique]);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   // console.log(acc);
//   // console.log(curr);
//   return acc + curr;
// }, 0);
// console.log(balance);
// // sameThing with for of
// let balance2 = 0;
// for (const mov of movements) {
//   balance2 += mov;
// }
// console.log(balance2);
// const euroToUsd = 1.1;
// const movementsUsd = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// console.log(movements);
// console.log(movementsUsd);
// const movementsUsdfor = [];
// for (const mov of movements) {
//   movementsUsdfor.push(mov * euroToUsd);
// }
// console.log(movementsUsdfor);
// const movementDis = movements.map(
//   (movement, index) =>
//     `Movement ${index + 1}: You ${
//       movement > 0 ? 'deposited' : 'withdrew'
//     } ${Math.abs(movement)}`
// );
// console.log(movementDis);
// // ///////////////////////
// const filteringMovements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const valid+s = filteringMovements.filter(function (mov, i, a) {
//   return mov > 0;
// });
// console.log(valid+s);
// const validNegative+s = [];
// for (const mov of filteringMovements) {
//   if (mov < 0) {
//     validNegative+s.push(mov);
//   }
// }

// maximum value
// const max = movements.reduce(function (acc, mov) {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);
// // //////////////
// const euroToUsd = 1.1;
// const filterMovements = movements
//   .filter(function (mov) {
//     return mov > 0;
//   })
//   .map(function (mov) {
//     return mov * euroToUsd;
//   })
//   .reduce(function (acc, mov) {
//     return acc + mov;
//   }, 0);
// // labelSumIn.textContent = filterMovements;
// console.log(filterMovements);
// const firstWithdraw = movements.find(function (movement) {
//   return movement < 0;
// });
// console.log(movements);
// console.log(firstWithdraw);
// console.log(accounts);
// const findAccount = accounts.find(function (account) {
//   return account.owner === 'Jonas Schmedtmann';
// });
// console.log(findAccount);
// const anyDeposit = movements.some(function (mov) {
//   return mov > 50000;
// });
// console.log(anyDeposit);
// // flat ()
// const arrFlat = [[1, 2, 4, 5], [6, 7, 8, 9], 10, 11, 12];
// console.log(arrFlat.flat());
// const accountsMovements = accounts.map(function (acc) {
//   return acc.movements;
// });

// console.log(accountsMovements);
// const allMovements = accountsMovements.flat();
// console.log(allMovements);
// const allBalance = allMovements.reduce(function (acc, mov) {
//   return acc + mov;
// }, 0);
// console.log(allBalance);
// // Sorting String
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// // +s
// console.log(movements);
// console.log(movements.sort());
// movements.sort(function (a, b) {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// console.log(movements);

const randomINT = function (min, max) {
  return Math.trunc(Math.random() * (max - min) + 1 + min);
};
const resutls = randomINT(10, 20);
console.log(resutls);
labelBalance.addEventListener('click', function () {
  const destructure = [...document.querySelectorAll('.movements__row')];
  // console.log(destructure);
  destructure.forEach(function (row, i) {
    // console.log(row, i);
    if (i % 3 === 0) row.style.backgroundColor = 'red';
  });
});
// Creating date
const naw = new Date();
console.log(naw);
const date = new Date(naw);
// FAKE LOGIN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = '100';
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);
const calcDatePassed = function (day1, day2) {
  return (day2 - day1) / (1000 * 60 * 60 * 24);
};
const days = calcDatePassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(`${days} days`);
