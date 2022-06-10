import { Position, Toaster } from "@blueprintjs/core";
import App from "next/app";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = Toaster.create({
    className: "toaster",
    position: Position.TOP,
});

export default AppToaster;