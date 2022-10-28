'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  sex: 'male',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  sex: 'female',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  sex: 'male',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  sex: 'female',
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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// TODO: Utility functions
const slicer = (acc) => {
  return acc.username.slice(4, acc.length);
};
const updateUI = (currentAccount) => {
  // Display movements
  displayMovements(currentAccount.movements);
  // Display balance
  calcDisplayBalance(currentAccount);
  // Display summary
  calcDisplaySummary(currentAccount);
};
// ///////////////////////////
const displayMovements = (movements, sort) => {
  containerMovements.innerHTML = '';
  const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;

  moves.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type} </div>
          <div class="movements__value">${movement} $</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// TODO: Calculating and displaying the balance
const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

// TODO: Calculating Summary Balance
const calcDisplaySummary = (account) => {
  const income = account.movements
    .filter((move) => move > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${income}`;

  const outcome = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, current) => acc + current, 0);
  labelSumOut.textContent = Math.abs(outcome);

  const interest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  labelSumInterest.textContent = interest;
};

// TODO: Computing user names.
const createUserNames = (accounts) => {
  accounts.forEach((account) => {
    const prefix = `${account.sex === 'male' ? 'Mr.' : 'Ms.'}`;
    account.username = account.owner
      .split(' ')
      .map((item) => {
        return item[0];
      })
      .join('');
    account.username = ` ${prefix}${account.username}`;
    account.owner = `${prefix} ${account.owner}`;
  });
};
createUserNames(accounts);
// TODO: Login Handler
let currentAccount;
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find((account) => {
    return slicer(account).toLowerCase() === inputLoginUsername.value;
  });
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner}`;
    containerApp.style.opacity = 100;
    // Update UI
    updateUI(currentAccount);
  }
});
// TODO: transfer money

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find((acc) => {
    return slicer(acc).toLowerCase() === inputTransferTo.value;
  });
  console.log(
    amount,
    receiverAccount,
    currentAccount.username.slice(4, currentAccount.username.length)
  );

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount !== slicer(currentAccount).toLowerCase()
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentAccount);
    console.log('transferred');
  }
});

// TODO: Closing the account
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === slicer(currentAccount).toLowerCase() &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) =>
        slicer(acc).toLowerCase() === slicer(currentAccount).toLowerCase()
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
// Request for loan

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => {
      return mov >= amount * 0.1;
    })
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

// TODO: sorting
let sort = true;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sort);
  sort = !sort;
});
