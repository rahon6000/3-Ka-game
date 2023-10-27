export declare let container: HTMLElement;
export declare let w_width: number;
export declare let w_height: number;
export declare let w_ratio: number;
export declare let currentPhi: number, targetPhi: number;
export declare let currentTheta: number, targetTheta: number;
export declare let currentRadi: number, targetRadi: number;
export declare let currentRank: number;
export declare function onWindowResize(): void;
export declare function onDocumentMouseMove(event: MouseEvent): void;
export declare function onDocumentClick(event: MouseEvent): void;
export declare function onDocumentMouseUp(event: MouseEvent): void;
export declare function onKeydown(event: KeyboardEvent): void;
export declare function onDocumentTouchStart(this: Document, ev: TouchEvent): void;
export declare function onDocumentTouched(this: Document, ev: TouchEvent): void;
export declare function onDocumentSwipe(this: Document, ev: TouchEvent): void;
export declare function smoothCameraSet(Phi: number, Theta: number, Radi: number): Promise<void>;
export declare function addGameScore(num: number): void;
export declare function display(): void;
/**
 *
 * Debugging, parameter adjust only
 */
export declare function debugging(debTab: HTMLCollectionOf<Element>): void;
export declare let getAngle: number;
export declare function onCamDebugChanged(event: Event): void;
