// Required for uuid to work
// https://github.com/uuidjs/uuid?tab=readme-ov-file#react-native--expo
import 'react-native-get-random-values';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import {v4} from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';

BackgroundTimer.start();

const hitSlop = { top: 10, left: 10, right: 10, bottom: 10};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    // marginTop: 20,
    // marginBottom: 20,
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    // alignItems: 'center',
    flex: 1,
    // flexDirection: 'row',
  },
  callButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    flexWrap: 'wrap',
    gap: 20
  },
  logContainer: {
    flex: 3,
    width: '100%',
    backgroundColor: '#D9D9D9',
  },
  log: {
    fontSize: 10,
  }
});

// RNCallKeep.setup({
//   ios: {
//     appName: 'CallKeepDemo',
//   },
//   android: {
//     alertTitle: 'HIIIIIII Permissions required',
//     alertDescription: 'This application needs to access your phone accounts',
//     cancelButton: 'Cancel',
//     okButton: 'ok',
//     additionalPermissions: []
//   },
// });

const getNewUuid = () => v4().toLowerCase();

const format = (uuid: string) => uuid.split('-')[0];

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));
/**
 * useCallbackStable
 * https://github.com/stutrek/use-callback-stable?tab=readme-ov-file#how-it-works
 */
function useCallbackStable<T extends any[], U>(callback: (...args: T) => U): (...args: T) => U {
    const callbackRef = useRef(callback);

    // Update the ref to the latest callback on each render
    callbackRef.current = callback;

    // Return a stable callback function
    return useCallback((...args: T) => {
        return callbackRef.current(...args);
    }, []);
}

const isIOS = Platform.OS === 'ios';

export default function Demo() {
  const [logText, setLog] = useState('');
  const [heldCalls, setHeldCalls] = useState<{ [key: string]: boolean }>({}); // callKeep uuid: held
  const [mutedCalls, setMutedCalls] = useState<{ [key: string]: boolean }>({}); // callKeep uuid: muted
  const [calls, setCalls] = useState<{ [key: string]: string }>({}); // callKeep uuid: number

  const log = useCallbackStable((text: string) => {
    console.info(text);
    setLog(logText + "\n" + text);
  });

  const addCall = useCallbackStable((callUUID: string, number: string) => {
    setHeldCalls({ ...heldCalls, [callUUID]: false });
    setCalls({ ...calls, [callUUID]: number });
  });

  const removeCall = useCallbackStable((callUUID: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [callUUID]: _, ...updated } = calls;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [callUUID]: __, ...updatedHeldCalls } = heldCalls;

    setCalls(updated);
    setHeldCalls(updatedHeldCalls);
  });

  const setCallHeld = useCallbackStable((callUUID: string, held: boolean) => {
    setHeldCalls({ ...heldCalls, [callUUID]: held });
  });

  const setCallMuted = useCallbackStable((callUUID: string, muted: boolean) => {
    setMutedCalls({ ...mutedCalls, [callUUID]: muted });
  });

  const displayIncomingCall = (number: string) => {
    const callUUID = getNewUuid();
    addCall(callUUID, number);

    log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
  };

  const displayIncomingCallNow = () => {
    displayIncomingCall(getRandomNumber());
  };

  const displayIncomingCallDelayed = () => {
    BackgroundTimer.setTimeout(() => {
      displayIncomingCall(getRandomNumber());
    }, 3000);
  };

  const answerCall = useCallbackStable(({callUUID}: { callUUID: string }) => {
    const number = calls[callUUID];
    log(`[answerCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.startCall(callUUID, number, number);

    BackgroundTimer.setTimeout(() => {
      log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  });

  const didPerformDTMFAction = useCallbackStable(({ callUUID, digits }: any) => {
    const number = calls[callUUID];
    log(`[didPerformDTMFAction] ${format(callUUID)}, number: ${number} (${digits})`);
  });

  const didReceiveStartCallAction = useCallback(({ handle }: any) => {

    log(`[didReceiveStartCallAction] number: ${handle}`);

    if (!handle) {
      // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
      return;
    }
    const callUUID = getNewUuid();
    addCall(callUUID, handle);

    log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

    RNCallKeep.startCall(callUUID, handle, handle);

    BackgroundTimer.setTimeout(() => {
      log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  }, [addCall, log]);

  const didPerformSetMutedCallAction = useCallbackStable(({ muted, callUUID }: any) => {
    const number = calls[callUUID];
    log(`[didPerformSetMutedCallAction] ${format(callUUID)}, number: ${number} (${muted})`);

    setCallMuted(callUUID, muted);
  });

  const didToggleHoldCallAction = useCallbackStable(({ hold, callUUID }: any) => {
    const number = calls[callUUID];
    log(`[didToggleHoldCallAction] ${format(callUUID)}, number: ${number} (${hold})`);

    setCallHeld(callUUID, hold);
  });

  const endCall = useCallbackStable(({ callUUID }: any) => {
    const handle = calls[callUUID];
    log(`[endCall] ${format(callUUID)}, number: ${handle}`);

    removeCall(callUUID);
  });

  const hangup = (callUUID: string) => {
    RNCallKeep.endCall(callUUID);
    removeCall(callUUID);
  };

  const setOnHold = (callUUID: string, held: boolean) => {
    const handle = calls[callUUID];
    RNCallKeep.setOnHold(callUUID, held);
    log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);

    setCallHeld(callUUID, held);
  };

  const setOnMute = (callUUID: string, muted: boolean) => {
    const handle = calls[callUUID];
    RNCallKeep.setMutedCall(callUUID, muted);
    log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);

    setCallMuted(callUUID, muted);
  };

  const updateDisplay = (callUUID: string) => {
    const number = calls[callUUID];
    // Workaround because Android doesn't display well displayName, se we have to switch ...
    if (isIOS) {
      RNCallKeep.updateDisplay(callUUID, 'New Name', number);
    } else {
      RNCallKeep.updateDisplay(callUUID, number, 'New Name');
    }

    log(`[updateDisplay: ${number}] ${format(callUUID)}`);
  };

  useEffect(() => {
    const removeAnswerCallListener = RNCallKeep.addEventListener('answerCall', answerCall);
    const removeDidPerformDTMFActionListener = RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
    const removeDidReceiveStartCallActionListener = RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
    const removeDidPerformSetMutedCallActionListener = RNCallKeep.addEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
    const removeDidToggleHoldCallActionListener = RNCallKeep.addEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
    const removeEndCallListener = RNCallKeep.addEventListener('endCall', endCall);
    return () => {
      removeAnswerCallListener.remove();
      removeDidPerformDTMFActionListener.remove();
      removeDidReceiveStartCallActionListener.remove();
      removeDidPerformSetMutedCallActionListener.remove();
      removeDidToggleHoldCallActionListener.remove();
      removeEndCallListener.remove();
    }
  }, [answerCall, didPerformDTMFAction, didPerformSetMutedCallAction, didReceiveStartCallAction, didToggleHoldCallAction, endCall]);

  return (

    
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', gap: 20 }}>

      <TouchableOpacity onPress={displayIncomingCallNow} style={styles.button} hitSlop={hitSlop}>
        <Text>Display incoming call now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={displayIncomingCallDelayed} style={styles.button} hitSlop={hitSlop}>
        <Text>Display incoming call now in 3s</Text>
      </TouchableOpacity>
      </View>

      {Object.keys(calls).map(callUUID => (
        <View key={callUUID}>
          <View style={styles.callButtons}>
            <TouchableOpacity
              onPress={() => setOnHold(callUUID, !heldCalls[callUUID])}
              style={styles.button}
              hitSlop={hitSlop}
            >
              <Text>{heldCalls[callUUID] ? 'Unhold' : 'Hold'} {calls[callUUID]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateDisplay(callUUID)}
              style={styles.button}
              hitSlop={hitSlop}
            >
              <Text>Update display</Text>
            </TouchableOpacity>
          </View>
          <View key={callUUID} style={styles.callButtons}>
            <TouchableOpacity
              onPress={() => setOnMute(callUUID, !mutedCalls[callUUID])}
              style={styles.button}
              hitSlop={hitSlop}
            >
              <Text>{mutedCalls[callUUID] ? 'Unmute' : 'Mute'} {calls[callUUID]}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => hangup(callUUID)} style={styles.button} hitSlop={hitSlop}>
              <Text>Hangup {calls[callUUID]}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <ScrollView style={styles.logContainer}>
        <Text style={styles.log}>
          {logText}
        </Text>
      </ScrollView>
    </View>
  );
}
