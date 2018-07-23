import * as types from '.';
import { laneByCallId } from '../store/lanes';
import { selectedAssignment } from '../store/assignments';


export function setLaneStep(lane, step) {
    return ({ dispatch, getState }) => {
        let assignment = selectedAssignment(getState());

        dispatch({
            type: types.SET_LANE_STEP,
            payload: { lane, step, assignment },
        });
    }
}

export function setLaneInfoMode(mode) {
    return {
        type: types.SET_LANE_INFO_MODE,
        payload: { mode },
    };
}

export function switchLaneToCall(call, step) {
    return ({ dispatch, getState }) => {
        let callId = call.get('id');

        dispatch({
            type: types.SWITCH_LANE_TO_CALL,
            payload: { callId },
        });

        if (step) {
            let lane = laneByCallId(getState().get('lanes'), callId.toString());

            dispatch(setLaneStep(lane, step));
        }
    };
}
