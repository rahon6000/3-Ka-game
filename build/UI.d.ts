export declare function onWindowResize(): void;
export declare function onDocumentMouseMove(event: MouseEvent): void;
export declare function onDocumentClick(event: MouseEvent): void;
export declare function onKeydown(event: KeyboardEvent): void;
export declare function smoothCameraSet(Phi: number, Theta: number, Radi: number): Promise<void>;
export declare function debugging(debTab: HTMLCollectionOf<Element>): void;
export declare let getAngle: number;
export declare function onCamDebugChanged(event: Event): void;
