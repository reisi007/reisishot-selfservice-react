export type Person = {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
};

export type PersonWithId = Person & { id: number };
