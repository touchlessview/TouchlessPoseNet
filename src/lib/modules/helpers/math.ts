

  export const getPercent = (value1: number, value2: number ) : number => {
    if (value1 !== 0 && value2 !== 0  ) {
      return +(value1 / value2 * 100).toFixed(1);
    } else return 0;
  }

  export const getValueOfPercent  = (value: number, percent: number ): number => {
    return +(value * percent / 100).toFixed(1);
  }

  export const getSumArr = (array: number[]): number => {
    if (Array.isArray(array) && array.length) {
      return array.reduce((accumulator, value) => accumulator + value)
    } else return 0
  }
