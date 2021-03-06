import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../common/misc/Button';
import CallProgressBar from './CallProgressBar';
import PropTypes from '../../utils/PropTypes';
import TargetInfo from './TargetInfo';
import { selectedAssignment } from '../../store/assignments';
import { currentCall, currentReport } from '../../store/calls';
import { setLaneStep } from '../../actions/lane';
import { showOverlay } from '../../actions/view';
import {
    endCallSession,
    startNewCall,
    submitCallReport
} from '../../actions/call';


const mapStateToProps = state => ({
    call: currentCall(state),
    currentIsPending: state.getIn(['calls', 'currentIsPending']),
    report: currentReport(state),
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class LaneControlBar extends React.Component {
    static propTypes = {
        lane: PropTypes.map.isRequired,
        assignment: PropTypes.map.isRequired,
    };

    render() {
        let returnSection, content, proceedSection;
        let call = this.props.call;
        let currentIsPending = this.props.currentIsPending;
        let lane = this.props.lane;
        let step = lane.get('step');

        if (step === 'assignment') {
            let assignment = this.props.assignment;

            returnSection = (
                <Button key="assignmentsButton"
                    labelMsg="controlBar.assignmentsButton"
                    href="/assignments"
                    />
            );

            content = null;

            proceedSection = (
                <Button key="startButton"
                    labelMsg="controlBar.startButton"
                    loading={currentIsPending}
                    onClick={ this.onClickStart.bind(this) }/>
            );
        }
        else if (step === 'prepare' && call) {
            let target = call.get('target');

            returnSection = (
                <Button key="endButton"
                    href="/end"
                    onClick={ this.onClickEnd.bind(this) }
                    labelMsg="controlBar.endButton"/>
            );

            content = (
                <Msg tagName="p" className="" id="controlBar.instructions.prepare"/>
                // TODO: Fix transition when not using TargetInfo anymore.
            );

            proceedSection = [
                <Button key="skipButton"
                    className="LaneControlBar-skipButton"
                    labelMsg="controlBar.skipButton"
                    labelValues={{ target: target.get('first_name') }}
                    onClick={ this.onClickSkip.bind(this) }
                    />,
                <Button key="callButton"
                    labelMsg="controlBar.callButton"
                    labelValues={{ target: target.get('first_name') }}
                    onClick={ this.onClickCall.bind(this) }
                    />
            ];
        }
        else if (step === 'call') {
            let target = call.get('target');

            content = (
                <TargetInfo target={ call.get('target') }
                    showFullInfo={ true }/>
            );

            proceedSection = [
                <Button key="skipButton"
                    className="LaneControlBar-skipButton"
                    labelMsg="controlBar.skipButton"
                    labelValues={{ target: target.get('first_name') }}
                    onClick={ this.onClickSkip.bind(this) }
                    />,
                <Button key="finishCallButton"
                    labelMsg="controlBar.finishCallButton"
                    onClick={ this.onClickFinishCall.bind(this) }/>
            ];
        }
        else if (step === 'report') {
            let report = this.props.report;

            content = (
                <TargetInfo target={ call.get('target') }
                    showFullInfo={ true }/>
            );

            if (report.get('step') === 'summary') {
                proceedSection = (
                    <Button key="submitReportButton"
                        labelMsg="controlBar.submitReportButton"
                        loading={report.get("isPending")}
                        onClick={ this.onClickSubmitReport.bind(this) }/>
                );
            }
        }
        else if (step === 'done') {
            returnSection = (
                <Button key="endButton"
                    href="/end"
                    labelMsg="controlBar.endButton"/>
            );

            content = null;

            proceedSection = (
                <Button key="nextCallButton"
                    labelMsg="controlBar.nextCallButton"
                    loading={currentIsPending}
                    onClick={ this.onClickNextCall.bind(this) }/>
            );
        }

        let classes = cx('LaneControlBar', 'LaneControlBar-' + step + 'Step');

        return (
            <div className={ classes }>
                <CallProgressBar key={ call? call.get('id') : '' } lane={ lane }/>
                <div className="LaneControlBar-returnSection">
                    { returnSection }
                </div>
                <div className="LaneControlBar-content">
                    { content }
                </div>
                <div className="LaneControlBar-proceedSection">
                    { proceedSection }
                </div>
            </div>
        );
    }

    onClickStart() {
        this.props.dispatch(startNewCall(this.props.assignment));
    }

    onClickEnd() {
        this.props.dispatch(endCallSession());
    }

    onClickSkip() {
        let call = this.props.call;
        this.props.dispatch(showOverlay('skip', { call }));
    }

    onClickCall() {
        let lane = this.props.lane;
        this.props.dispatch(setLaneStep(lane, 'call'));
    }

    onClickFinishCall() {
        let lane = this.props.lane;
        this.props.dispatch(setLaneStep(lane, 'report'));
    }

    onClickSubmitReport() {
        this.props.dispatch(submitCallReport());
    }

    onClickNextCall() {
        this.props.dispatch(startNewCall(this.props.assignment));
    }
}
