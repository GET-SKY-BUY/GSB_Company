
module.exports = function INR(numStr) {
    try {

      let number = parseInt(numStr, 10);
      if (isNaN(number)) {
        return 0;
      }
      
      let x = numStr.split('.');
      let integerPart = x[0];
      let decimalPart = x.length > 1 ? '.' + x[1] : '';
      
      let lastThreeDigits = integerPart.slice(-3);
      let otherDigits = integerPart.slice(0, -3);
      
      if (otherDigits !== '') {
        lastThreeDigits = ',' + lastThreeDigits;
      }
      
      let result = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;
      
      return result + decimalPart;
    } catch (error) {
      return 0;
    }
}