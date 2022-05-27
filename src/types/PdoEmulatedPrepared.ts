export type PdoEmulatedPrepared<T extends object> = {
  [Key in keyof T]: T[Key] extends Object ? PdoEmulatedPrepared<T[Key]>
                                          : (
                      T[Key] extends boolean ? MapKeepOptional<T[Key], '0' | '1'>
                                             : MapKeepOptional<T[Key], string>
                      )
}
type MapKeepOptional<Source, Target> = Source extends undefined ? Target | undefined : Target;
