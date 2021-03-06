import { ActionContainer } from '@msft-sme/angular';
import { ActionButtonAsync } from '@msft-sme/angular';
import { Observable, Subject } from 'rxjs';

export interface MyModel {
    disable1: boolean;
    disable2: boolean;
    hidden3: boolean;
}

function fakeAsync(): Subject<void> {
    const subject = new Subject<void>();
    setTimeout(
        () => {
            subject.next();
            subject.complete();
        },
        1000);
    return subject;
}

function fakeAsyncError(): Subject<void> {
    const subject = new Subject<void>();
    setTimeout(
        () => {
            subject.error('This is bad! Panic and run! Panic and run!');
            subject.complete();
        },
        1000);
    return subject;
}

export class ModelDrivenAction1 extends ActionButtonAsync<MyModel> {
    public text = 'Action1';

    protected onExecute(target: MyModel): Observable<MyModel> {
        const done = new Subject<MyModel>();
        // after some time, this action will changes the model so that itself is disabled, action 2 is disabled , and action 3 is hidden
        fakeAsync().subscribe(() => {
            target.disable1 = true;
            target.disable2 = false;
            target.hidden3 = false;
            done.next(target);
            done.complete();
        });

        return done;
    }

    public setActionState(target: MyModel, container: ActionContainer) {
        super.setActionState(target, container);
        this.enabled = target && !target.disable1 && container.enabled && !container.isBusy;
    }
}

export class ModelDrivenAction2 extends ActionButtonAsync<MyModel> {
    public text = 'Action2';

    protected onExecute(target: MyModel): Observable<MyModel> {
        const done = new Subject<MyModel>();
        // after some time, this action will changes the model so that itself is disabled, action 1 is disabled , and action 3 is visible
        fakeAsync().subscribe(() => {
            target.disable1 = false;
            target.disable2 = true;
            target.hidden3 = true;
            done.next(target);
            done.complete();
        });

        return done;
    }

    public setActionState(target: MyModel, container: ActionContainer) {
        super.setActionState(target, container);
        this.enabled = target && !target.disable2 && container.enabled && !container.isBusy;
    }
}

export class ModelDrivenAction3 extends ActionButtonAsync<MyModel> {
    public text = 'Action3';

    protected onExecute(target: MyModel): Observable<MyModel> {
        const done = new Subject<MyModel>();
        // after some time, this action will popup an alert. it does not change the model so it calls next with the target passed in
        fakeAsync().subscribe(() => {
            alert('Action3 complete!');
            done.next(target);
            done.complete();
        });

        return done;
    }

    public setActionState(target: MyModel, container: ActionContainer) {
        super.setActionState(target, container);
        this.enabled = container.enabled && !container.isBusy;
        this.hidden = target && target.hidden3;
    }
}

export class ModelDrivenActionWithError extends ActionButtonAsync<MyModel> {
    public text = 'Cause async error';

    protected onExecute(target: MyModel): Observable<MyModel> {
        const done = new Subject<MyModel>();
        fakeAsyncError().subscribe(
            () => { throw new Error('we should not hit this.'); },
            error => {
                done.error(error);
                done.complete();
            });

        return done;
    }

    public setActionState(target: MyModel, container: ActionContainer) {
        super.setActionState(target, container);
        this.enabled = container.enabled && !container.isBusy;
    }
}
