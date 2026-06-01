import { makeAutoObservable, runInAction } from "mobx";
import {
  ActionError,
  ActionResultStatus,
  ActionSuccess
} from "../../../types/global";
import { resultOrError, ResultOrErrorResponse } from "../../../utils/global";

export interface User {
  firstName?: string;
  lastName?: string;
  eMail?: string;
}

export default class UserStore {
  user: User | null = null;

  // init function
  constructor() {
    makeAutoObservable(this);
  }

  // actions
  async getOwnUser() {
    const [result, error] = (await resultOrError(
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              firstName: "Aria",
              lastName: "Test",
              eMail: "linda.bolt@osapiens.com"
            }),
          500
        )
      )
    )) as ResultOrErrorResponse<User>;

    if (!!error) {
      return {
        status: ActionResultStatus.ERROR,
        error
      } as ActionError;
    }

    if (result) {
      runInAction(() => {
        /**
         * @symptom   Avatar never appears although getOwnUser() resolves successfully.
         * @rootCause `this.urser` typo writes a non-observable field; `user` stays null, the observer stays idle.
         * @fix       Assign the declared observable `user`; corrected at the source of truth.
         * @tradeoff  None; one-character fix, no component changes needed.
         * @verify    Avatar mounts ~500ms after load; observer re-renders on assignment.
         */
        this.user = result;
      });

      return {
        status: ActionResultStatus.SUCCESS,
        result: result
      } as ActionSuccess<User>;
    }

    return {
      status: ActionResultStatus.ERROR,
      error: "Something went wrong."
    } as ActionError;
  }
}
