
/**
 * Returns an array containing all prime number smaller than or
 * equal to num.
 * 
 * @param {Number} num Upper bound of the prime numbers.
 * @returns {Number[]} Array with prime numbers.
 */
const sieve = (num) => {
    const numArr = new Array(num + 1);
    numArr.fill(true);
    numArr[0] = numArr[1] = false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
       for (let j = 2; i * j <= num; j++){
           numArr[i * j] = false;
       }
    }
    return numArr.reduce((acc, val, ind) => {
       if(val){
          return acc.concat(ind);
       }else{
          return acc;
       };
    },[]);
};

/** a list with the first 10 primes */
listOfPrimes = sieve(30);

/** length of ListOfPrimes */
maxindex = listOfPrimes.length;

/** the last prime in the ListOfPrimes */
maxprimeinlist = listOfPrimes[listOfPrimes.length-1];

/**
 * Return the condensed factorization of a integer n in a HTML string.
 * 
 * @param {Number | BigInt} n a given integer.
 * @returns {String} factorization of n.
 */
function factorization (n) {
    return condense(factorize(BigInt(n))).join(' &times; ');
}

/**
 * Checks if a given integer is prime.
 * 
 * @param {Number | BigInt} n given integer.
 * @returns {Boolean} true if n is a prime, and false otherwise.
 */
function isPrime(n) {
    const isBigInt = typeof(n) == "bigint";
    const high = (isBigInt)?
    n/BigInt(2) : Math.trunc(Math.sqrt(n));
    for (x of listOfPrimes) {
        let bigX = (isBigInt)? BigInt(x) : x;
        if ((x <= high) && (n % bigX == 0)) {
            return false;
        }
        if (x >= high) {
            return true;
        }
    }
    bigX = (isBigInt)? BigInt(maxprimeinlist + 2) : maxprimeinlist + 2;
    while (bigX <= high) {
        if (n % bigX == 0)
            return false;
        bigX += (isBigInt)? 2n: 2;
    }
    return true;
}

/**
 * Factorizes an integer or long number.
 * 
 * @param {Number | BigInt} n given integer.
 * @returns {any[]} a list with the prime factors of n.
 */
function factorize(n) {
    let primes = [];
    let index = 0;
    let candidate = listOfPrimes[index];
    let high;

    // BigInt operations take too much time
    if (n <= Number.MAX_SAFE_INTEGER) {
        n = Number(n);
        high = Math.trunc(Math.sqrt(n) + 1);
    } else {
        high = n / BigInt(2);
    }

    if (isPrime(n)) {
        primes = [n];
        return primes;
    }

    while (candidate < high) {
        let bigCandidate = (typeof(n) == "bigint")?
            BigInt(candidate) : candidate;
        if (n % bigCandidate == 0) {
            // All factors of "n", lesser than "candidate", have been found before.
            // Therefore, "candidate" cannot be composite.
            n = (typeof(n) == "bigint")?
                n/bigCandidate : Math.trunc(n / candidate);
            primes.push(candidate);
            primes = primes.concat(factorize(n));
            break;
        }
        index++;
        if (index < maxindex) {
            candidate = listOfPrimes[index];
        } else {
            candidate += 2;
        }
    }
    return primes;
}

/**
 * Return a superscript HTML string for the given value.
 * 
 * @param {String} val a numeric string.
 * @returns {String} a new superscript HTML string.
 */
function expoent(val) {
    return "<sup>" + val + "</sup>";
}

/**
 * Condenses the list of prime factors of a number,
 * so that each factor appears just once,
 * in the format prime<sup>power</sup>.
 * 
 * @param {any[]} L a list with the prime factors of a number.
 * @returns {String[]} a condensed list.
 */
function condense(L) {
    let prime = null;
    let count = null;
    let list = [];
    for (x of L) {
        if (x == prime) {
            count += 1
        } else {
            if (prime) {
                list.push(prime.toString());
                 if (count > 1) {
                     list[list.length-1]+= expoent(count.toString());
                 }
            }
            prime = x;
            count = 1;
        }
    }
    list.push(prime.toString());
    if (count > 1) {
        list[list.length-1] += expoent(count.toString());
    }
    return list
}