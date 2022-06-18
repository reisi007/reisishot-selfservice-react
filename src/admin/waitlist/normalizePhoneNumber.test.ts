import { normalizePhoneNumber } from './normalizePhoneNumber';

describe('normalize phone number', () => {
  it('should remove all non numeric chars from string', () => {
    expect(normalizePhoneNumber('hjdhflk@+#108t rbhdf67fjhsdfjh'))
      .toBe('10867');
  });

  it('should remove 00 prefix', () => {
    expect(normalizePhoneNumber('0012'))
      .toBe('12');
  });

  it('should insert Austria prefix for a single leading zero', () => {
    expect(normalizePhoneNumber('0670123456'))
      .toBe('43670123456');
  });
});
