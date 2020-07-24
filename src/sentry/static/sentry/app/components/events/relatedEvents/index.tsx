import React from 'react';
import styled from '@emotion/styled';
import moment from 'moment-timezone';
import {Location} from 'history';

import space from 'app/styles/space';
import {t} from 'app/locale';
import {Organization, Event} from 'app/types';
import EventView from 'app/utils/discover/eventView';
import LoadingIndicator from 'app/components/loadingIndicator';
import {getTraceDateTimeRange} from 'app/components/events/interfaces/spans/utils';
import EventDataSection from 'app/components/events/eventDataSection';
import {PanelTable, PanelItem} from 'app/components/panels';
import PlatformIcon from 'app/components/platformIcon';
import Link from 'app/components/links/link';
import Button from 'app/components/button';
import DiscoverQuery from 'app/utils/discover/discoverQuery';
import DateTime from 'app/components/dateTime';
import {IconOpen} from 'app/icons';
import TableView from 'app/views/eventsV2/table/tableView';
import SortLink from 'app/components/gridEditable/sortLink';

import TypeIndicator from './typeIndicator';

type Type = React.ComponentProps<typeof TypeIndicator>['type'];

type Props = {
  organization: Organization;
  event: Event;
  location: Location;
};

type state = {
  traceEvents: Array<TraceEvent>;
  isLoading: boolean;
};

type TraceEvent = {
  'event.type': string;
  id: string;
  project: string;
  'project.id': number;
  timestamp: string;
  title: string;
  'trace.span': string;
};

// List events that have the same tracing ID as the current Event
class RelatedEvents extends React.Component<Props, state> {
  state: state = {traceEvents: [], isLoading: true};

  componentDidMount() {
    //this.getIssues();
  }

  // async getIssues() {}

  getEventView = () => {
    const {organization, event} = this.props;
    const traceId = event.contexts?.trace?.trace_id;

    const orgFeatures = new Set(organization.features);
    const dateCreated = moment(event.dateCreated).valueOf() / 1000;
    const pointInTime = event?.dateReceived
      ? moment(event.dateReceived).valueOf() / 1000
      : dateCreated;

    const {start, end} = getTraceDateTimeRange({start: pointInTime, end: pointInTime});

    return EventView.fromSavedQuery({
      id: undefined,
      name: `Events with Trace ID ${traceId}`,
      fields: ['title', 'event.type', 'project', 'trace.span', 'timestamp'],
      orderby: '-timestamp',
      query: `trace:${traceId}`,
      projects: orgFeatures.has('global-views') ? [] : [Number(event.projectID)],
      version: 2,
      start,
      end,
    });
  };

  render() {
    const {organization, location} = this.props;
    const orgSlug = organization.slug;

    const eventView = this.getEventView();

    return (
      <EventDataSection
        type="relted-events"
        title={t('Related Events')}
        actions={<Button size="small">{t('Open in Discover')}</Button>}
      >
        <DiscoverQuery location={location} eventView={eventView} orgSlug={orgSlug}>
          {({isLoading, tableData}) => {
            if (isLoading) {
              return <LoadingIndicator />;
            }

            const hasEventErrorType = tableData?.data.some(
              event => event['event.type'] === 'error'
            );

            const headers = [
              t('Id'),
              t('Title'),
              t('Type'),
              t('Project'),
              t('Timestamp'),
            ];

            if (hasEventErrorType) {
              headers.push(' ');
            }

            if (tableData) {
              return (
                <PanelTable
                  emptyMessage={t('No Related Events have been found.')}
                  headers={headers}
                >
                  {tableData.data.map(
                    ({id, title, project, timestamp, ...data}, index) => {
                      const isLast = index === tableData.data.length - 1;
                      const type = data['event.type'];
                      return (
                        <React.Fragment key={id}>
                          <StyledPanelItem isLast={isLast}>
                            <SortLink />
                          </StyledPanelItem>
                          <StyledPanelItem isLast={isLast}>{title}</StyledPanelItem>
                          <StyledPanelItem isLast={isLast}>{type}</StyledPanelItem>
                          <StyledPanelItem isLast={isLast}>
                            <StyledPlatformIcon platform={String(project)} size="16px" />
                            {project}
                          </StyledPanelItem>
                          <StyledPanelItem isLast={isLast}>
                            <StyledDateTime date={timestamp} />
                          </StyledPanelItem>
                          {hasEventErrorType && (
                            <StyledPanelItem isLast={isLast}>
                              {type === 'error' && (
                                <Button
                                  size="xsmall"
                                  title={t('Open in discover')}
                                  icon={<IconOpen size="xs" />}
                                />
                              )}
                            </StyledPanelItem>
                          )}
                        </React.Fragment>
                      );
                    }
                  )}
                </PanelTable>
              );
            }
            return null;
          }}
        </DiscoverQuery>
      </EventDataSection>
    );
  }
}

export default RelatedEvents;

const StyledPanelItem = styled(PanelItem)<{isLast: boolean}>`
  padding: ${space(1)} ${space(2)};
  border: ${p => (p.isLast ? 'none' : null)};
  font-size: ${p => p.theme.fontSizeMedium};
  align-items: center;
`;

const StyledPlatformIcon = styled(PlatformIcon)`
  border-radius: ${p => p.theme.borderRadius};
  box-shadow: 0 0 0 1px ${p => p.theme.white};
  margin-right: ${space(1)};
`;

const StyledDateTime = styled(DateTime)`
  color: ${p => p.theme.gray500};
`;
