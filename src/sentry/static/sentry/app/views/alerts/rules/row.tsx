import React from 'react';
import moment from 'moment';
import styled from '@emotion/styled';
import memoize from 'lodash/memoize';

import {t, tct} from 'app/locale';
import {IconDelete, IconSettings} from 'app/icons';
import {PanelItem} from 'app/components/panels';
import {Project} from 'app/types';
import {IssueAlertRule} from 'app/types/alerts';
import Access from 'app/components/acl/access';
import AsyncComponent from 'app/components/asyncComponent';
import Button from 'app/components/button';
import ButtonBar from 'app/components/buttonBar';
import Confirm from 'app/components/confirm';
import ErrorBoundary from 'app/components/errorBoundary';
import IdBadge from 'app/components/idBadge';
import overflowEllipsis from 'app/styles/overflowEllipsis';
import space from 'app/styles/space';

import {isIssueAlert} from '../utils';
import {IncidentStats} from '../types';
import {TableLayout} from './styles';

type Props = {
  rule: IssueAlertRule;
  projects: Project[];
  projectsLoaded: boolean;
  orgId: string;
  onDelete: (projectId: string, ruleId: string) => void;
} & AsyncComponent['props'];

type State = {
  stats: IncidentStats;
} & AsyncComponent['state'];

class RuleListRow extends React.Component<Props, State> {
  /**
   * Memoized function to find a project from a list of projects
   */
  getProject = memoize((slug: string, projects: Project[]) =>
    projects.find(project => project.slug === slug)
  );

  render() {
    const {rule, projectsLoaded, projects, orgId, onDelete} = this.props;
    // const {error, stats} = this.state;
    const created = moment(rule.dateCreated).format('ll');
    // TODO(scttcper):
    // const slug = incident.projects[0];
    const slug = 'earth';

    return (
      <ErrorBoundary>
        <IncidentPanelItem>
          <TableLayout>
            <RuleType>{isIssueAlert(rule) ? t('Issue') : t('Metric')}</RuleType>
            <Title>{rule.name}</Title>
            <ProjectBadge
              avatarSize={18}
              project={!projectsLoaded ? {slug} : this.getProject(slug, projects)}
            />
            <div>Marshawn Lynch</div>
            <div>{created}</div>
            <Access access={['project:write']}>
              {({hasAccess}) => (
                <ButtonBar gap={1}>
                  <Confirm
                    disabled={!hasAccess}
                    message={tct(
                      "Are you sure you want to delete [name]? You won't be able to view the history of this alert once it's deleted.",
                      {
                        name: rule.name,
                      }
                    )}
                    header={t('Delete Alert Rule?')}
                    priority="danger"
                    confirmText={t('Delete Rule')}
                    onConfirm={() => onDelete(slug, rule.id)}
                  >
                    <Button
                      type="button"
                      icon={<IconDelete />}
                      size="small"
                      title={t('Delete')}
                    />
                  </Confirm>
                  <Button
                    size="small"
                    icon={<IconSettings />}
                    title={t('Edit')}
                    to={`/settings/${orgId}/projects/${slug}/alerts/${
                      isIssueAlert(rule) ? 'rules' : 'metric-rules'
                    }/${rule.id}/`}
                  />
                </ButtonBar>
              )}
            </Access>
          </TableLayout>
        </IncidentPanelItem>
      </ErrorBoundary>
    );
  }
}

const RuleType = styled('div')`
  font-size: 12px;
  font-weight: 400;
  color: ${p => p.theme.gray500};
  text-transform: uppercase;
`;

const Title = styled('div')`
  ${overflowEllipsis}
`;

const IncidentPanelItem = styled(PanelItem)`
  font-size: ${p => p.theme.fontSizeMedium};
  padding: ${space(1.5)} ${space(2)};
`;

const ProjectBadge = styled(IdBadge)`
  flex-shrink: 0;
`;

export default RuleListRow;