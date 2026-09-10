import { PaymentService } from '../src/memberships/domain/services/payment.service.js';

const numbers = ['4532148803436467','4111111111111111','1234567890123456','453214880343646'];

for (const n of numbers) {
    const digits = String(n).replace(/\D/g,'');
    const valid = PaymentService.validateCardNumber(n);
    console.log(`card: ${n} | digits:${digits.length} | valid: ${valid}`);
}

function luhnCheck(num){
    const digits = String(num).replace(/\D/g,'');
    let sum=0; let double=false;
    for (let i=digits.length-1;i>=0;i--){
        let d = parseInt(digits.charAt(i),10);
        if (double){ d*=2; if (d>9) d-=9; }
        sum+=d; double=!double;
    }
    return {sum,mod10: sum%10};
}
const sample='4532148803436467';
console.log('internal luhn for', sample, luhnCheck(sample));
