import { Position, Toaster, IToaster } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = (): IToaster => {
    if(typeof document !== undefined) {
        return Toaster.create({
            className: "toaster",
            position: Position.TOP,
        });
    } else return {} as IToaster
}

export default AppToaster;