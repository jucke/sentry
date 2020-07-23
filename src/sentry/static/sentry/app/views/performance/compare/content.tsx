import React from 'react';
import styled from '@emotion/styled';
import {Params} from 'react-router/lib/Router';
import {Location} from 'history';

import {t} from 'app/locale';
import {Event, Organization} from 'app/types';
import {Panel} from 'app/components/panels';
import * as Layout from 'app/components/layouts/thirds';
import Breadcrumb from 'app/views/performance/breadcrumb';

import TraceView from './traceView';
import TransactionSummary from './transactionSummary';

type Props = {
  organization: Organization;
  location: Location;
  params: Params;
  baselineEvent: Event;
  regressionEvent: Event;
};

class TransactionComparisonContent extends React.Component<Props> {
  render() {
    const {baselineEvent, regressionEvent, organization, location} = this.props;

    const transactionName =
      baselineEvent.title === regressionEvent.title ? baselineEvent.title : undefined;

    return (
      <React.Fragment>
        <Layout.Header>
          <Layout.HeaderContent>
            <Breadcrumb
              organization={organization}
              location={location}
              transactionName={transactionName}
              transactionComparison
            />
            <Layout.Title>{transactionName ?? t('mixed transaction names')}</Layout.Title>
          </Layout.HeaderContent>
          <Layout.HeaderActions>
            <TransactionSummary
              baselineEvent={baselineEvent}
              regressionEvent={regressionEvent}
            />
          </Layout.HeaderActions>
        </Layout.Header>
        <Layout.Body>
          <StyledPanel>
            <TraceView baselineEvent={baselineEvent} regressionEvent={regressionEvent} />
          </StyledPanel>
        </Layout.Body>
      </React.Fragment>
    );
  }
}

const StyledPanel = styled(Panel)`
  grid-column: 1 / span 2;
  overflow: hidden;
`;

export default TransactionComparisonContent;
