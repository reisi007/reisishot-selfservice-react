import {Person} from '../types/Person';

export type WaitlistPerson = Person & Referrable &
  {
    availability: string,
    phone_number: string,
    website?: string,
    points: number,
  }

export type WaitlistRecord =
  {
    item_id: number,
    text: string | null
  }

export type Referrable = {
  referrer?: string
}
