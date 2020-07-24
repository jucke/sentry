import React from 'react';
import styled from '@emotion/styled';
import capitalize from 'lodash/capitalize';

import {t} from 'app/locale';
import Tooltip from 'app/components/tooltip';
import {Theme} from 'app/utils/theme';

type Type = 'error' | 'transaction';

type Props = {
  type: Type;
};

const TypeIndicator = ({type}: Props) => (
  <Wrapper>
    <Tooltip title={t('Event Type: %s', capitalize(type))}>
      <Content type={type} />
    </Tooltip>
  </Wrapper>
);

export default TypeIndicator;

const getColor = ({type, theme}: Props & {theme: Theme}) => {
  switch (type) {
    case 'error':
      return theme.red400;
    case 'transaction':
      return theme.pink400;
    default:
      return theme.gray500;
  }
};

const Wrapper = styled('div')`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const Content = styled('div')<Props>`
  background: ${getColor};
  height: 15px;
  width: 9px;
  border-radius: 0 3px 3px 0;
`;
