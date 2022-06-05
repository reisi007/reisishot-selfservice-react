import * as dayjs from 'dayjs';
import { CalendarWeek } from './CalendarWeek';
import { ShootingDateEntry, ShootingSlotState } from '../../admin/login/login.api';

export class CalendarWeekAvailability {
  readonly calendarWeek: CalendarWeek;

  private internalState: ShootingSlotState = ShootingSlotState.FREE;

  private internalText?: string;

  constructor(calendarWeek: CalendarWeek, state: ShootingSlotState, text?: string);
  constructor(date: dayjs.Dayjs);
  constructor(first: CalendarWeek | dayjs.Dayjs, state?: ShootingSlotState, text?: string) {
    if (!first) {
      throw Error('First param must be a dayjs.Date or a CalendarWeek');
    }

    if (first instanceof CalendarWeek) {
      this.calendarWeek = first;

      if (state) {
        this.internalState = state;
      }
      this.internalText = text;
    } else {
      this.calendarWeek = new CalendarWeek(first);
    }
  }

  get text(): string | undefined {
    return this.internalText;
  }

  get state() {
    return this.internalState;
  }

  private static isFinalRun(computedAvailabilities: Array<CalendarWeekAvailability>, idx: number) {
    return idx >= computedAvailabilities.length;
  }

  process(event: Array<CalendarWeekAvailability>, index: number): void;

  process(event: ShootingDateEntry): void;

  process(event: Array<CalendarWeekAvailability> | ShootingDateEntry, index: number | undefined = undefined): void {
    if (Array.isArray(event)) {
      if (index === undefined) {
        throw Error('Index must be defined');
      }
      this.finalize(event, index);
    } else {
      this.processInternal(event);
    }
  }

  isFree(): boolean {
    return this.internalState === ShootingSlotState.FREE;
  }

  isBusy(): boolean {
    return this.internalState === ShootingSlotState.BUSY;
  }

  isTaken(): boolean {
    return this.internalState === ShootingSlotState.TAKEN;
  }

  isBlocked(): boolean {
    return this.internalState === ShootingSlotState.BLOCKED;
  }

  hasNotYetOpened(): boolean {
    return this.internalState === ShootingSlotState.NOT_YET_OPENED;
  }

  withText(text: string | undefined = this.internalText): CalendarWeekAvailability {
    return new CalendarWeekAvailability(this.calendarWeek, this.internalState, text);
  }

  private processInternal(event: ShootingDateEntry) {
    if (event.kw !== this.calendarWeek.kw()) {
      return;
    }

    this.internalText = event.text;
    this.internalState = event.state;
  }

  private finalize(event: Array<CalendarWeekAvailability>, idx: number) {
    this.markFreeWeeksAsNotAvailable(event, idx, 6);
    this.markFreeWeeksBetweenShootingsAsBusy(event, idx);
  }

  private markFreeWeeksBetweenShootingsAsBusy(computedAvailabilities: Array<CalendarWeekAvailability>, idx: number) {
    if (CalendarWeekAvailability.isFinalRun(computedAvailabilities, idx) || !(this.isFree() || this.isBusy())) {
      return;
    }

    const next = this.calendarWeek.next();
    const prev = this.calendarWeek.prev();

    const prevAndNextWeek = computedAvailabilities.filter((e) => e.calendarWeek.equals(next) || e.calendarWeek.equals(prev));
    const markAsBlocked = prevAndNextWeek.every((e) => e.internalState === ShootingSlotState.TAKEN);

    if (markAsBlocked) {
      this.internalState = ShootingSlotState.BLOCKED;
      return;
    }

    const markAsBusy = prevAndNextWeek.some((e) => e.internalState === ShootingSlotState.TAKEN);
    if (markAsBusy) {
      this.internalState = ShootingSlotState.BUSY;
    }
  }

  private markFreeWeeksAsNotAvailable(event: Array<CalendarWeekAvailability>, idx: number, firstIndex: number) {
    if (event[0] !== this || !CalendarWeekAvailability.isFinalRun(event, idx)) {
      return;
    }
    for (let i = firstIndex; i < event.length; i += 1) {
      const availability = event[i];
      if (availability.isFree()) {
        availability.internalState = ShootingSlotState.NOT_YET_OPENED;
      }
    }
  }
}
