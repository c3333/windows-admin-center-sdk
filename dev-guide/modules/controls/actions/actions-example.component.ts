import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActionItemErrorEventArgs, ActionItemExecutedEventArgs } from '@msft-sme/angular';
import { ActionButton, ActionButtonAsync } from '@msft-sme/angular';
import { ActionItem } from '@msft-sme/angular';
import { NavigationTitle } from '@msft-sme/angular';
import { ActionBarComponent } from '@msft-sme/angular';
import { ActionButtonAsyncExecuteArgs } from '@msft-sme/angular';
import { LogLevel } from '@msft-sme/core/diagnostics/log-level';
import { Logging } from '@msft-sme/core/diagnostics/logging';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModelDrivenAction1, ModelDrivenAction2, ModelDrivenAction3, ModelDrivenActionWithError, MyModel } from './model-driven-action';

@Component({
    selector: 'sme-dev-guide-controls-action-bar',
    templateUrl: './actions-example.component.html'
})
@NavigationTitle({
    getTitle: () => 'Action Bar Component'
})
export class ActionsExampleComponent {
    @ViewChild('custom')
    public customActionBar: ActionBarComponent;

    public inlineExampleText = 'I was defined inline!';
    public inlineItems = [this.inlineExampleText];
    public enableToggle = true;

    public actions: ActionItem[] = [];
    public customActions: ActionButtonAsync<MyModel>[] = [
        new ModelDrivenAction1(),
        new ModelDrivenAction1(),
        new ModelDrivenAction2(),
        new ModelDrivenAction2(),
        new ModelDrivenAction3(),
        new ModelDrivenAction3(),
        new ModelDrivenAction3(),
        new ModelDrivenActionWithError()
    ];

    public actionTarget: MyModel = {
        disable1: false,
        disable2: true,
        hidden3: true
    };

    constructor(private changeDetector: ChangeDetectorRef) {
        for (let i = 0; i < 2; i++) {
            const b1 = new ActionButton();
            const b2 = new ActionButton();
            const toggle = () => {
                b1.enabled = !b1.enabled;
                b2.toggled = b1.enabled;
                b1.text = `Enabled: ${b1.enabled}`;
                b1.iconClass = `sme-icon sme-icon-${b1.enabled ? 'lEDLight' : 'lEDLightOff'}`;
            };
            toggle();
            b1.execute = () => alert(`You clicked button #${(i * 3) + 1}`);
            b2.text = `Toggle Button #${(i * 3) + 1}`;
            b2.iconClass = 'sme-icon sme-icon-back';
            b2.execute = toggle;

            const b3 = new ActionButton();
            b3.text = `A really long action that will result in creating an ellipsis ${i}`;
            b3.iconClass = 'sme-icon sme-icon-more';
            b3.execute = () => alert(`You clicked button #${(i * 3) + 3}`);
            this.actions.push(b1, b2, b3);
        }

        const bAdd = new ActionButton();
        bAdd.text = `Add Inline button`;
        bAdd.iconClass = 'sme-icon sme-icon-add';
        bAdd.execute = () => this.inlineItems.push(this.inlineExampleText);
        this.actions.push(bAdd);
    }

    public asyncAction(event: ActionButtonAsyncExecuteArgs): void {
        event.execute = of(event.target).pipe(delay(2000));
    }


    public removeInline(index: number) {
        this.inlineItems.splice(index, 1);
    }

    public onError(args: ActionItemErrorEventArgs) {
        alert(`Received Async Error from "${args.item.text}": \n\n"${args.error}"\n`);
    }

    public onExecuted(args: ActionItemExecutedEventArgs) {
        Logging.log({
            level: LogLevel.Informational,
            message: `Received Result from ${args.item.text}`,
            params: {},
            source: 'ActionsExampleComponent'
        });
    }
}
