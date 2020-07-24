import React from 'react';
import styled from '@emotion/styled';

import {t} from 'app/locale';
import space from 'app/styles/space';
import {Event} from 'app/types';
import {getHumanDuration, parseTrace} from 'app/components/events/interfaces/spans/utils';

import {isTransactionEvent} from './utils';

type Props = {
  baselineEvent: Event;
  regressionEvent: Event;
};

class TransactionSummary extends React.Component<Props> {
  render() {
    const {baselineEvent, regressionEvent} = this.props;

    if (!isTransactionEvent(baselineEvent) || !isTransactionEvent(regressionEvent)) {
      // TODO: better error
      return null;
    }

    const baselineTrace = parseTrace(baselineEvent);
    const regressionTrace = parseTrace(regressionEvent);

    const baselineDuration = Math.abs(
      baselineTrace.traceStartTimestamp - baselineTrace.traceEndTimestamp
    );
    const regressionDuration = Math.abs(
      regressionTrace.traceStartTimestamp - regressionTrace.traceEndTimestamp
    );

    return (
      <Container>
        <EventRow>
          <Baseline />
          <EventRowContent>
            <Content>
              <ContentTitle>{t('Baseline Event')}</ContentTitle>
              <EventId>{`ID: ${shortEventId(baselineEvent.eventID)}`}</EventId>
            </Content>
            <TimeDuration>
              <span>{getHumanDuration(baselineDuration)}</span>
            </TimeDuration>
          </EventRowContent>
        </EventRow>
        <EventRow>
          <Regression />
          <EventRowContent>
            <Content>
              <ContentTitle>{t('Regressive Event')}</ContentTitle>
              <EventId>{`ID: ${shortEventId(regressionEvent.eventID)}`}</EventId>
            </Content>
            <TimeDuration>
              <span>{getHumanDuration(regressionDuration)}</span>
            </TimeDuration>
          </EventRowContent>
        </EventRow>
      </Container>
    );
  }
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;

  justify-content: space-between;
  align-content: space-between;

  padding-bottom: ${space(1)};

  > * + * {
    margin-top: ${space(0.75)};
  }
`;

const EventRow = styled('div')`
  display: flex;
`;

const Baseline = styled('div')`
  background-color: ${p => p.theme.purple300};
  height: 100%;
  width: 4px;

  margin-right: ${space(1)};
`;

const Regression = styled('div')`
  background-color: ${p => p.theme.gray700};
  height: 100%;
  width: 4px;

  margin-right: ${space(1)};
`;

const EventRowContent = styled('div')`
  flex-grow: 1;
  display: flex;
`;

const TimeDuration = styled('div')`
  display: flex;
  align-items: center;

  font-size: ${p => p.theme.headerFontSize};
  line-height: 1.2;

  margin-left: ${space(1)};
`;

const Content = styled('div')`
  flex-grow: 1;
  width: 150px;

  font-size: ${p => p.theme.fontSizeMedium};
`;

const ContentTitle = styled('div')`
  font-weight: 600;
`;

const EventId = styled('div')`
  color: ${p => p.theme.gray500};
`;

function shortEventId(value: string): string {
  return value.substring(0, 8);
}

export default TransactionSummary;
