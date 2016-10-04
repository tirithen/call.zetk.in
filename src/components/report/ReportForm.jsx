import React from 'react';

import PropTypes from '../../utils/PropTypes';
import * as steps from './steps';
import { REPORT_STEPS } from '../../store/calls';


export default class ReportForm extends React.Component {
    static propTypes = {
        report: PropTypes.map.isRequired,
    };

    render() {
        let report = this.props.report;
        let steps = [];

        let curStepIndex = REPORT_STEPS.indexOf(report.get('step')) || 0;
        for (let i = 0; i <= curStepIndex; i++) {
            let step = REPORT_STEPS[i];
            let StepComponent = componentFromStep(step);

            steps.push(
                <StepComponent key={ step }
                    report={ report }/>
            );
        }

        return (
            <div className="ReportForm">
                { steps }
            </div>
        );
    }
}

const componentFromStep = step => {
    return {
        success_or_failure: steps.SuccessOrFailureStep,
        success_callback: steps.ReportStepBase,
        failure_reason: steps.FailureReasonStep,
        failure_message: steps.FailureMessageStep,
        caller_log: steps.ReportStepBase,
        organizer_log: steps.ReportStepBase,
        complete: steps.ReportStepBase,
    }[step];
};
