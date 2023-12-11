/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Icon from '@ant-design/icons/lib/components/Icon';
import { Space, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { ReactComponent as EditIcon } from '../../../assets/svg/edit-new.svg';
import {
  DE_ACTIVE_COLOR,
  NO_DATA_PLACEHOLDER,
} from '../../../constants/constants';
import { formatDate } from '../../../utils/date-time/DateTimeUtils';
import AppBadge from '../../common/Badge/Badge.component';
import { TestCaseStatusModal } from '../../DataQuality/TestCaseStatusModal/TestCaseStatusModal.component';
import { TestCaseStatusIncidentManagerProps } from './TestCaseIncidentManagerStatus.interface';

const TestCaseIncidentManagerStatus = ({
  data,
  onSubmit,
}: TestCaseStatusIncidentManagerProps) => {
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);

  const statusType = useMemo(() => data.testCaseResolutionStatusType, [data]);

  const onEditSeverity = useCallback(() => setIsEditStatus(true), []);
  const onCancel = useCallback(() => setIsEditStatus(false), []);

  const handleSubmit = useCallback(
    async (data) => {
      await onSubmit(data);
      onCancel();
    },
    [onCancel, onSubmit]
  );

  if (!statusType) {
    return <Typography.Text>{NO_DATA_PLACEHOLDER}</Typography.Text>;
  }

  return (
    <>
      <Space align="center">
        <Tooltip
          placement="bottom"
          title={
            data?.updatedAt &&
            `${formatDate(data.updatedAt)}
                ${data.updatedBy ? 'by ' + data.updatedBy : ''}`
          }>
          <AppBadge
            className={classNames('resolution', statusType.toLocaleLowerCase())}
            label={statusType}
          />
        </Tooltip>
        <Icon
          component={EditIcon}
          data-testid="edit-description-icon"
          style={{ color: DE_ACTIVE_COLOR }}
          onClick={onEditSeverity}
        />
      </Space>

      <TestCaseStatusModal
        data={data}
        open={isEditStatus}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default TestCaseIncidentManagerStatus;
