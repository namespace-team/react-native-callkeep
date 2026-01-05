import type { TurboModule, CodegenTypes } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes'

export type DisplayOptions = {
  hasVideo?: boolean
  supportsHolding?: boolean
  supportsDTMF?: boolean
  supportsGrouping?: boolean
  supportsUngrouping?: boolean
}

export type StartCallOptionsIOS = {
  hasVideo?: boolean
  handleType?: string
}

export type StartCallOptionsAndroid = {
  hasVideo?: boolean
}

export type IncomingCallOptionsIOS = undefined |{
  handleType?: string
} & DisplayOptions

export type IncomingCallOptionsAndroid = Pick<DisplayOptions, 'hasVideo'> | undefined;


export interface Spec extends TurboModule {
  setup(options: Object): void
  checkDefaultPhoneAccount(): Promise<boolean>
  checkPhoneAccountPermission(optionalPermissions: Array<string>): Promise<void>
  openPhoneAccounts(): void
  openPhoneAccountSettings():void
  answerIncomingCall(uuid: string): void
  registerPhoneAccount(options: Object): void
  registerEvents(): void
  unregisterEvents(): void
  displayIncomingCall(
    uuid: string,
    handle: string,
    localizedCallerName: string,
    options?: Object
  ): void
  startCall(
    uuid: string,
    handle: string,
    contactIdentifier: string,
    options: Object
  ): void
  /**
   * Updates the display with a new name and URI.
   *
   * @param uuid - Unique identifier of the display
   * @param displayName - New display name
   * @param uri - URI to display
   * @param options - Optional settings (iOS only)
   *
   * @platform ios
   */
  updateDisplay(
    uuid: string,
    displayName: string,
    handle: string,
    options?: Object
  ): void
  checkPhoneAccountEnabled(): Promise<boolean>
  isConnectionServiceAvailable(): Promise<boolean>
  reportConnectedOutgoingCallWithUUID(uuid: string): void
  reportConnectingOutgoingCallWithUUID(uuid: string): void
  reportEndCallWithUUID(uuid: string, reason: Int32): void
  toggleAudioRouteSpeaker(uuid: string, routeSpeaker: boolean): void
  rejectCall(uuid: string): void
  endCall(uuid: string): void
  endAllCalls(): void
  setReachable(): void
  setSettings(options: Object): void
  isCallActive(uuid: string): Promise<boolean>
  getCalls(): Promise<{}[] | void>
  // Different return type is set that from module ts spec
  getAudioRoutes(): Promise<{}[] | void>
  setAudioRoute(uid: string, route: string): Promise<boolean>
  hasPhoneAccount(): Promise<boolean>
  hasOutgoingCall(): Promise<boolean>
  setMutedCall(uuid: string, muted: boolean): void
  setOnHold(uuid: string, held: boolean): void
  setConnectionState(uuid: string, state: CodegenTypes.Int32): void
  sendDTMF(uuid: string, key: string): void
  checkIfBusy(): Promise<boolean>
  checkSpeaker(): Promise<boolean>
  setAvailable(active: boolean): void
  setForegroundServiceSettings(settings: Object): void
  canMakeMultipleCalls(allow: boolean): void
  setCurrentCallActive(callUUID: string): void
  backToForeground(): void
  checkIsInManagedCall(): Promise<boolean>
  getInitialEvents(): Promise<Object[]>
  clearInitialEvents(): void
  addListener(eventName: string): void;
  removeListeners(count: number): void;
  _startCallActionEventListenerAdded(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNCallKeep')
