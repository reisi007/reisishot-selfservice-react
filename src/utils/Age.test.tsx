import dayjs from 'dayjs';
import {calculateAge, TEMPLATE_STRING_AS_DATE} from './Age';

describe('Datetime Utils', () => {


  describe('CalculatedBirthday', () => {
    it('age is never rounded up', () => {
      const birthday = dayjs().startOf('day');
      const today = birthday.add(18, 'years').add(-1, 'second');

      const age = calculateAge({
        relativeTo: today.format(TEMPLATE_STRING_AS_DATE),
        dateString: birthday.format(TEMPLATE_STRING_AS_DATE),
      });

      expect(age).toEqual('17.99 utils.years');
    });
  });
});
