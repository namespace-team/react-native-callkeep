import type { TurboModule, CodegenTypes } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes'

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
    number: string,
    callerName: string,
    hasVideo: boolean
  ): void
  startCall(
    uuid: string,
    number: string,
    callerName: string,
    hasVideo: boolean
  ): void
  updateDisplay(
    uuid: string,
    displayName: string,
    uri: string,
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
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNCallKeep')
