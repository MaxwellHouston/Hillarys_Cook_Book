
export const authCheck = (id) => {
    let validUIDs = ['2qk9Y3zXcATmU7uIGvOfIUaWlC02', 'kEM6UFDasPYdqz2Yb2CGA5j2Y863', '8crRRSmyZKdBBqdeZPsluYqRx0C2'];
    if(validUIDs.includes(id)) return true;
    return false;
}

// '8crRRSmyZKdBBqdeZPsluYqRx0C2'